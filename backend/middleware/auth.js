// Middleware de autenticação atualizado para Sequelize
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');
const logger = require('../utils/logger');

// Middleware para proteger rotas
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Verificar se o token está no header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Verificar se o token existe
    if (!token) {
      return res.status(401).json({ message: 'Acesso não autorizado, token não fornecido' });
    }

    try {
      // Verificar o token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Buscar o usuário
      const usuario = await Usuario.findByPk(decoded.id, {
        attributes: { exclude: ['senha'] }
      });

      if (!usuario) {
        return res.status(401).json({ message: 'Usuário não encontrado' });
      }

      // Verificar se o usuário está ativo
      if (!usuario.ativo) {
        return res.status(401).json({ message: 'Usuário desativado' });
      }

      // Adicionar o usuário à requisição
      req.usuario = usuario;
      next();
    } catch (err) {
      logger.error(`Erro na verificação do token: ${err.message}`);
      return res.status(401).json({ message: 'Token inválido ou expirado' });
    }
  } catch (err) {
    logger.error(`Erro no middleware de autenticação: ${err.message}`);
    return res.status(500).json({ message: 'Erro no servidor' });
  }
};

// Middleware para verificar se é admin
exports.admin = (req, res, next) => {
  if (req.usuario && req.usuario.tipo === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Acesso não autorizado, apenas administradores' });
  }
};
