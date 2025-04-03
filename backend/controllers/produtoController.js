const Produto = require('../models/Produto');
const Categoria = require('../models/Categoria');
const Subcategoria = require('../models/Subcategoria');

const criarProduto = async (req, res) => {
  const { nome, descricao, preco, estoque, categoria_id, subcategoria_id, imagem_principal, imagens_secundarias } = req.body;

  try {
    // Verificar se categoria existe
    const categoria = await Categoria.findById(categoria_id);
    if (!categoria) {
      return res.status(400).json({ msg: 'Categoria não encontrada' });
    }

    // Verificar se subcategoria existe e pertence à categoria
    if (subcategoria_id) {
      const subcategoria = await Subcategoria.findOne({ 
        _id: subcategoria_id, 
        categoria_id: categoria_id 
      });
      if (!subcategoria) {
        return res.status(400).json({ msg: 'Subcategoria não encontrada ou não pertence à categoria' });
      }
    }

    const novoProduto = new Produto({
      nome,
      descricao,
      preco,
      estoque,
      categoria_id,
      subcategoria_id,
      imagem_principal,
      imagens_secundarias: imagens_secundarias || []
    });

    await novoProduto.save();
    res.status(201).json(novoProduto);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

const listarProdutos = async (req, res) => {
  try {
    const { categoria, subcategoria, busca, limite, pagina } = req.query;
    const filtro = {};

    if (categoria) filtro.categoria_id = categoria;
    if (subcategoria) filtro.subcategoria_id = subcategoria;
    if (busca) filtro.nome = { $regex: busca, $options: 'i' };

    const options = {
      page: parseInt(pagina) || 1,
      limit: parseInt(limite) || 10,
      populate: ['categoria_id', 'subcategoria_id'],
      sort: { data_cadastro: -1 }
    };

    const produtos = await Produto.paginate(filtro, options);
    res.json(produtos);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

const obterProduto = async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id)
      .populate('categoria_id')
      .populate('subcategoria_id');

    if (!produto) {
      return res.status(404).json({ msg: 'Produto não encontrado' });
    }

    res.json(produto);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

const atualizarProduto = async (req, res) => {
  const { nome, descricao, preco, estoque, categoria_id, subcategoria_id, imagem_principal, imagens_secundarias } = req.body;

  try {
    // Verificar se produto existe
    const produto = await Produto.findById(req.params.id);
    if (!produto) {
      return res.status(404).json({ msg: 'Produto não encontrado' });
    }

    // Verificar se categoria existe
    if (categoria_id) {
      const categoria = await Categoria.findById(categoria_id);
      if (!categoria) {
        return res.status(400).json({ msg: 'Categoria não encontrada' });
      }
    }

    // Verificar se subcategoria existe e pertence à categoria
    if (subcategoria_id) {
      const subcategoria = await Subcategoria.findOne({ 
        _id: subcategoria_id, 
        categoria_id: categoria_id || produto.categoria_id 
      });
      if (!subcategoria) {
        return res.status(400).json({ msg: 'Subcategoria não encontrada ou não pertence à categoria' });
      }
    }

    // Atualizar campos
    produto.nome = nome || produto.nome;
    produto.descricao = descricao || produto.descricao;
    produto.preco = preco || produto.preco;
    produto.estoque = estoque !== undefined ? estoque : produto.estoque;
    produto.categoria_id = categoria_id || produto.categoria_id;
    produto.subcategoria_id = subcategoria_id !== undefined ? subcategoria_id : produto.subcategoria_id;
    produto.imagem_principal = imagem_principal || produto.imagem_principal;
    produto.imagens_secundarias = imagens_secundarias || produto.imagens_secundarias;

    await produto.save();

    const produtoAtualizado = await Produto.findById(req.params.id)
      .populate('categoria_id')
      .populate('subcategoria_id');

    res.json(produtoAtualizado);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

const deletarProduto = async (req, res) => {
  try {
    const produto = await Produto.findByIdAndDelete(req.params.id);
    if (!produto) {
      return res.status(404).json({ msg: 'Produto não encontrado' });
    }

    res.json({ msg: 'Produto removido com sucesso' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

module.exports = {
  criarProduto,
  listarProdutos,
  obterProduto,
  atualizarProduto,
  deletarProduto
};