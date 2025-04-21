// Arquivo de índice para exportar todos os modelos
const Usuario = require('./Usuario');
const Cliente = require('./Cliente');
const Categoria = require('./Categoria');
const Subcategoria = require('./Subcategoria');
const Produto = require('./Produto');
const ProdutoImagem = require('./ProdutoImagem');
const Pedido = require('./Pedido');
const PedidoItem = require('./PedidoItem');

// Sincronizar modelos com o banco de dados
const syncModels = async () => {
  await Usuario.sync();
  await Cliente.sync();
  await Categoria.sync();
  await Subcategoria.sync();
  await Produto.sync();
  await ProdutoImagem.sync();
  await Pedido.sync();
  await PedidoItem.sync();
  
  console.log('Modelos sincronizados com o banco de dados');
};

module.exports = {
  Usuario,
  Cliente,
  Categoria,
  Subcategoria,
  Produto,
  ProdutoImagem,
  Pedido,
  PedidoItem,
  syncModels
};
