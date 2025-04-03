const express = require('express');
const router = express.Router();
const {
  criarPedido,
  listarPedidos,
  obterPedido,
  atualizarStatusPedido,
  listarTodosPedidos
} = require('../controllers/pedidoController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Rota para criar novo pedido (autenticada)
router.post('/', auth, criarPedido);

// Rotas para cliente visualizar seus pedidos
router.get('/meus-pedidos', auth, listarPedidos);
router.get('/:id', auth, obterPedido);

// Rotas administrativas
router.get('/admin/todos', auth, admin, listarTodosPedidos);
router.put('/admin/:id/status', auth, admin, atualizarStatusPedido);

module.exports = router;