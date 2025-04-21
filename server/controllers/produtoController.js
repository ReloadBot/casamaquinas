// Exemplo de controlador atualizado para Produtos usando Sequelize
const { Produto, Categoria, Subcategoria, ProdutoImagem } = require('../models');
const logger = require('../utils/logger');

// @desc    Listar todos os produtos
// @route   GET /api/produtos
// @access  Público
exports.listarProdutos = async (req, res) => {
  try {
    const { categoria, subcategoria, destaque, busca, limite = 10, pagina = 1 } = req.query;
    
    // Configurar opções de consulta
    const options = {
      include: [
        { model: Categoria, attributes: ['id', 'nome'] },
        { model: Subcategoria, attributes: ['id', 'nome'] },
        { model: ProdutoImagem, as: 'imagens_secundarias', attributes: ['id', 'imagem'] }
      ],
      order: [['data_cadastro', 'DESC']],
      limit: parseInt(limite),
      offset: (parseInt(pagina) - 1) * parseInt(limite)
    };
    
    // Adicionar filtros se fornecidos
    const where = {};
    
    if (categoria) {
      where.categoria_id = categoria;
    }
    
    if (subcategoria) {
      where.subcategoria_id = subcategoria;
    }
    
    if (destaque === 'true') {
      where.destaque = true;
    }
    
    if (busca) {
      where[Sequelize.Op.or] = [
        { nome: { [Sequelize.Op.like]: `%${busca}%` } },
        { descricao: { [Sequelize.Op.like]: `%${busca}%` } }
      ];
    }
    
    if (Object.keys(where).length > 0) {
      options.where = where;
    }
    
    // Executar consulta
    const produtos = await Produto.findAndCountAll(options);
    
    res.status(200).json({
      success: true,
      count: produtos.count,
      totalPaginas: Math.ceil(produtos.count / parseInt(limite)),
      paginaAtual: parseInt(pagina),
      produtos: produtos.rows
    });
  } catch (err) {
    logger.error(`Erro ao listar produtos: ${err.message}`);
    res.status(500).json({ message: 'Erro ao listar produtos', error: err.message });
  }
};

// @desc    Obter um produto pelo ID
// @route   GET /api/produtos/:id
// @access  Público
exports.getProduto = async (req, res) => {
  try {
    const produto = await Produto.findByPk(req.params.id, {
      include: [
        { model: Categoria, attributes: ['id', 'nome'] },
        { model: Subcategoria, attributes: ['id', 'nome'] },
        { model: ProdutoImagem, as: 'imagens_secundarias', attributes: ['id', 'imagem'] }
      ]
    });
    
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    
    res.status(200).json({
      success: true,
      produto
    });
  } catch (err) {
    logger.error(`Erro ao obter produto: ${err.message}`);
    res.status(500).json({ message: 'Erro ao obter produto', error: err.message });
  }
};

// @desc    Criar um novo produto
// @route   POST /api/produtos
// @access  Privado/Admin
exports.criarProduto = async (req, res) => {
  try {
    // Verificar se é admin
    if (req.usuario.tipo !== 'admin') {
      return res.status(403).json({ message: 'Acesso não autorizado' });
    }
    
    const { 
      nome, 
      descricao, 
      preco, 
      estoque, 
      categoria_id, 
      subcategoria_id, 
      imagem_principal, 
      imagens_secundarias, 
      destaque 
    } = req.body;
    
    // Verificar se a categoria existe
    const categoria = await Categoria.findByPk(categoria_id);
    if (!categoria) {
      return res.status(400).json({ message: 'Categoria não encontrada' });
    }
    
    // Verificar se a subcategoria existe (se fornecida)
    if (subcategoria_id) {
      const subcategoria = await Subcategoria.findByPk(subcategoria_id);
      if (!subcategoria) {
        return res.status(400).json({ message: 'Subcategoria não encontrada' });
      }
    }
    
    // Criar o produto
    const produto = await Produto.create({
      nome,
      descricao,
      preco,
      estoque,
      categoria_id,
      subcategoria_id,
      imagem_principal,
      destaque: destaque || false
    });
    
    // Adicionar imagens secundárias (se fornecidas)
    if (imagens_secundarias && imagens_secundarias.length > 0) {
      const imagensPromises = imagens_secundarias.map(imagem => 
        ProdutoImagem.create({
          produto_id: produto.id,
          imagem
        })
      );
      
      await Promise.all(imagensPromises);
    }
    
    // Buscar o produto completo com as relações
    const produtoCompleto = await Produto.findByPk(produto.id, {
      include: [
        { model: Categoria, attributes: ['id', 'nome'] },
        { model: Subcategoria, attributes: ['id', 'nome'] },
        { model: ProdutoImagem, as: 'imagens_secundarias', attributes: ['id', 'imagem'] }
      ]
    });
    
    res.status(201).json({
      success: true,
      produto: produtoCompleto
    });
  } catch (err) {
    logger.error(`Erro ao criar produto: ${err.message}`);
    res.status(500).json({ message: 'Erro ao criar produto', error: err.message });
  }
};

// @desc    Atualizar um produto
// @route   PUT /api/produtos/:id
// @access  Privado/Admin
exports.atualizarProduto = async (req, res) => {
  try {
    // Verificar se é admin
    if (req.usuario.tipo !== 'admin') {
      return res.status(403).json({ message: 'Acesso não autorizado' });
    }
    
    const produto = await Produto.findByPk(req.params.id);
    
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    
    // Atualizar campos
    const campos = [
      'nome', 'descricao', 'preco', 'estoque', 
      'categoria_id', 'subcategoria_id', 'imagem_principal', 'destaque'
    ];
    
    campos.forEach(campo => {
      if (req.body[campo] !== undefined) {
        produto[campo] = req.body[campo];
      }
    });
    
    await produto.save();
    
    // Atualizar imagens secundárias (se fornecidas)
    if (req.body.imagens_secundarias) {
      // Remover imagens existentes
      await ProdutoImagem.destroy({ where: { produto_id: produto.id } });
      
      // Adicionar novas imagens
      if (req.body.imagens_secundarias.length > 0) {
        const imagensPromises = req.body.imagens_secundarias.map(imagem => 
          ProdutoImagem.create({
            produto_id: produto.id,
            imagem
          })
        );
        
        await Promise.all(imagensPromises);
      }
    }
    
    // Buscar o produto atualizado com as relações
    const produtoAtualizado = await Produto.findByPk(produto.id, {
      include: [
        { model: Categoria, attributes: ['id', 'nome'] },
        { model: Subcategoria, attributes: ['id', 'nome'] },
        { model: ProdutoImagem, as: 'imagens_secundarias', attributes: ['id', 'imagem'] }
      ]
    });
    
    res.status(200).json({
      success: true,
      produto: produtoAtualizado
    });
  } catch (err) {
    logger.error(`Erro ao atualizar produto: ${err.message}`);
    res.status(500).json({ message: 'Erro ao atualizar produto', error: err.message });
  }
};

// @desc    Excluir um produto
// @route   DELETE /api/produtos/:id
// @access  Privado/Admin
exports.excluirProduto = async (req, res) => {
  try {
    // Verificar se é admin
    if (req.usuario.tipo !== 'admin') {
      return res.status(403).json({ message: 'Acesso não autorizado' });
    }
    
    const produto = await Produto.findByPk(req.params.id);
    
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    
    // Remover imagens secundárias
    await ProdutoImagem.destroy({ where: { produto_id: produto.id } });
    
    // Remover o produto
    await produto.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Produto removido com sucesso'
    });
  } catch (err) {
    logger.error(`Erro ao excluir produto: ${err.message}`);
    res.status(500).json({ message: 'Erro ao excluir produto', error: err.message });
  }
};
