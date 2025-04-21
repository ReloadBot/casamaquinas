const express = require('express');
const router = express.Router();
const {
  getCliente,
  updateCliente,
  getClientes,
  getClienteById
} = require('../controllers/clienteController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Rota para cliente acessar seus próprios dados
router.get('/me', auth, getCliente);
router.put('/me', auth, updateCliente);

// Rotas administrativas
router.get('/', auth, admin, getClientes);
router.get('/:id', auth, admin, getClienteById);

module.exports = router;