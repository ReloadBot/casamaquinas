// Middleware de autenticação atualizado para Sequelize
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');

// Carregar variáveis de ambiente
dotenv.config({ path: path.resolve(__dirname, '../../config/.env') });

module.exports = (req, res, next) => {
  // Obter token do cabeçalho
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  // Verificar se o token existe
  if (!token) {
    return res.status(401).json({ msg: 'Acesso negado, token não fornecido' });
  }
  
  try {
    // Verificar token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || '2e62d3c3601695b043c01838cb31cd8584dfe441aa37718a0476cc84a425e626'
    );
    
    // Adicionar usuário ao objeto de requisição
    req.usuario = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token inválido' });
  }
};
