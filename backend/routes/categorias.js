const express = require('express');
const router = express.Router();
const {
  criarCategoria,
  listarCategorias,
  obterCategoria,
  atualizarCategoria,
  deletarCategoria,
  criarSubcategoria
} = require('../controllers/categoriaController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Rotas públicas
router.get('/', listarCategorias);
router.get('/:id', obterCategoria);

// Rotas protegidas (admin)
router.post('/', auth, admin, criarCategoria);
router.put('/:id', auth, admin, atualizarCategoria);
router.delete('/:id', auth, admin, deletarCategoria);
router.post('/:categoriaId/subcategorias', auth, admin, criarSubcategoria);

module.exports = router;