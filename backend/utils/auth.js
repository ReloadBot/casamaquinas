const jwt = require('jsonwebtoken');

// Função para gerar token JWT
const generateToken = (id, tipo) => {
  return jwt.sign(
    { id, tipo },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

module.exports = {
  generateToken
};
