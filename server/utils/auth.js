// Utilitário de autenticação atualizado para Sequelize
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');

// Carregar variáveis de ambiente
dotenv.config({ path: path.resolve(__dirname, '../../config/.env') });

// Gerar token JWT
const generateToken = (userId, userType) => {
  return jwt.sign(
    { id: userId, tipo: userType },
    process.env.JWT_SECRET || '2e62d3c3601695b043c01838cb31cd8584dfe441aa37718a0476cc84a425e626',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

module.exports = {
  generateToken
};
