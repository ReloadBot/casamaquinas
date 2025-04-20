// Middleware de autenticação para proteger rotas
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const logger = require('../utils/logger');

// Middleware para proteger rotas que requerem autenticação
const protect = async (req, res, next) => {
  try {
    let token;

    // Verificar se o token está presente no header Authorization
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        // Obter token do header
        token = req.headers.authorization.split(' ')[1];

        // Verificar token
        const decoded = jwt.verify(
          token, 
          process.env.JWT_SECRET || 'jwt_secret_key_default'
        );

        // Obter usuário do token (excluindo a senha)
        req.usuario = await Usuario.findById(decoded.id).select('-senha');

        if (!req.usuario) {
          logger.warn('Token válido, mas usuário não encontrado');
          return res.status(401).json({
            success: false,
            message: 'Não autorizado, usuário não encontrado'
          });
        }

        next();
      } catch (error) {
        logger.error(`Erro na verificação do token: ${error.message}`);
        res.status(401).json({
          success: false,
          message: 'Não autorizado, token inválido'
        });
      }
    } else {
      logger.warn('Tentativa de acesso sem token de autenticação');
      res.status(401).json({
        success: false,
        message: 'Não autorizado, sem token'
      });
    }
  } catch (error) {
    logger.error(`Erro no middleware de autenticação: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro no servidor. Tente novamente mais tarde.'
    });
  }
};

// Middleware para verificar se o usuário é administrador
const admin = (req, res, next) => {
  if (req.usuario && req.usuario.isAdmin) {
    next();
  } else {
    logger.warn(`Tentativa de acesso a rota de admin por usuário não autorizado: ${req.usuario ? req.usuario.email : 'desconhecido'}`);
    res.status(403).json({
      success: false,
      message: 'Não autorizado como administrador'
    });
  }
};

module.exports = { protect, admin };
