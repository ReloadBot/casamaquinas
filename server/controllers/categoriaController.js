const Categoria = require('../models/Categoria');
const Subcategoria = require('../models/Subcategoria');

const criarCategoria = async (req, res) => {
  try {
    const { nome, descricao, imagem } = req.body;

    const novaCategoria = new Categoria({
      nome,
      descricao,
      imagem
    });

    await novaCategoria.save();
    res.status(201).json(novaCategoria);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

const listarCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find().populate('subcategorias');
    res.json(categorias);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

const obterCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id).populate('subcategorias');
    if (!categoria) {
      return res.status(404).json({ msg: 'Categoria não encontrada' });
    }
    res.json(categoria);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

const atualizarCategoria = async (req, res) => {
  try {
    const { nome, descricao, imagem } = req.body;

    const categoria = await Categoria.findByIdAndUpdate(
      req.params.id,
      { nome, descricao, imagem },
      { new: true }
    );

    if (!categoria) {
      return res.status(404).json({ msg: 'Categoria não encontrada' });
    }

    res.json(categoria);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

const deletarCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findByIdAndDelete(req.params.id);
    if (!categoria) {
      return res.status(404).json({ msg: 'Categoria não encontrada' });
    }

    await Subcategoria.deleteMany({ categoria_id: req.params.id });
    res.json({ msg: 'Categoria removida' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

const criarSubcategoria = async (req, res) => {
  try {
    const { nome } = req.body;

    const categoria = await Categoria.findById(req.params.categoriaId);
    if (!categoria) {
      return res.status(404).json({ msg: 'Categoria não encontrada' });
    }

    const novaSubcategoria = new Subcategoria({
      nome,
      categoria_id: req.params.categoriaId
    });

    await novaSubcategoria.save();

    categoria.subcategorias.push(novaSubcategoria._id);
    await categoria.save();

    res.status(201).json(novaSubcategoria);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

module.exports = {
  criarCategoria,
  listarCategorias,
  obterCategoria,
  atualizarCategoria,
  deletarCategoria,
  criarSubcategoria
};