const Usuario = require('../models/Usuario');

const admin = async (req, res, next) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id);
    
    if (!usuario) {
      return res.status(401).json({ msg: 'Usuário não encontrado' });
    }

    if (usuario.tipo !== 'admin') {
      return res.status(403).json({ msg: 'Acesso negado - Requer privilégios de administrador' });
    }

    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

module.exports = admin;