const express = require('express');
const router = express.Router();
const {
  criarProduto,
  listarProdutos,
  obterProduto,
  atualizarProduto,
  deletarProduto
} = require('../controllers/produtoController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Rotas públicas
router.get('/', listarProdutos);
router.get('/:id', obterProduto);

// Rotas protegidas (admin)
router.post('/', auth, admin, criarProduto);
router.put('/:id', auth, admin, atualizarProduto);
router.delete('/:id', auth, admin, deletarProduto);

module.exports = router;