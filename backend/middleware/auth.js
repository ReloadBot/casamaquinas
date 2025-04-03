const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ msg: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findOne({ _id: decoded.id });

    if (!usuario) {
      return res.status(401).json({ msg: 'Usuário não encontrado' });
    }

    req.token = token;
    req.usuario = usuario;
    next();
  } catch (err) {
    console.error(err.message);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ msg: 'Token inválido' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Token expirado' });
    }
    res.status(500).send('Erro no servidor');
  }
};

module.exports = auth;