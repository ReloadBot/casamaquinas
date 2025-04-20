const express = require('express');
const router = express.Router();
const { 
  loginUsuario, 
  registrarUsuario, 
  getPerfilUsuario, 
  atualizarPerfilUsuario 
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Rota para login de usuário
router.post('/login', loginUsuario);

// Rota para registro de usuário
router.post('/register', registrarUsuario);

// Rotas protegidas (requerem autenticação)
router.get('/perfil', protect, getPerfilUsuario);
router.put('/perfil', protect, atualizarPerfilUsuario);

module.exports = router;