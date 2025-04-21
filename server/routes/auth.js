const express = require('express');
const router = express.Router();
const { register, login, getUsuario, updateUsuario } = require('../controllers/authController');
const auth = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Registrar novo usuário
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Autenticar usuário e retornar token
// @access  Public
router.post('/login', login);

// @route   GET /api/auth/usuario
// @desc    Obter dados do usuário logado
// @access  Private
router.get('/usuario', auth, getUsuario);

// @route   PUT /api/auth/usuario
// @desc    Atualizar dados do usuário
// @access  Private
router.put('/usuario', auth, updateUsuario);

module.exports = router;