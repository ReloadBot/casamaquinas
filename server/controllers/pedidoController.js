const Pedido = require('../models/Pedido');
const PedidoItem = require('../models/PedidoItem');
const Produto = require('../models/Produto');
const Cliente = require('../models/Cliente');

const criarPedido = async (req, res) => {
  const { itens, enderecoEntrega } = req.body;

  try {
    // Verificar estoque e calcular total
    let valorTotal = 0;
    const itensPedido = [];

    for (const item of itens) {
      const produto = await Produto.findById(item.produtoId);
      if (!produto) {
        return res.status(404).json({ msg: `Produto ${item.produtoId} não encontrado` });
      }
      if (produto.estoque < item.quantidade) {
        return res.status(400).json({ msg: `Estoque insuficiente para o produto ${produto.nome}` });
      }

      valorTotal += produto.preco * item.quantidade;
      itensPedido.push({
        produto: produto._id,
        quantidade: item.quantidade,
        precoUnitario: produto.preco
      });
    }

    // Obter cliente
    const cliente = await Cliente.findOne({ usuario_id: req.usuario.id });
    if (!cliente) {
      return res.status(404).json({ msg: 'Cliente não encontrado' });
    }

    // Criar pedido
    const novoPedido = new Pedido({
      cliente_id: cliente._id,
      valor_total: valorTotal,
      endereco_entrega: enderecoEntrega || cliente.endereco,
      status: 'pendente'
    });

    const pedidoCriado = await novoPedido.save();

    // Criar itens do pedido e atualizar estoque
    for (const item of itensPedido) {
      await PedidoItem.create({
        pedido_id: pedidoCriado._id,
        produto_id: item.produto,
        quantidade: item.quantidade,
        preco_unitario: item.precoUnitario
      });

      await Produto.findByIdAndUpdate(item.produto, {
        $inc: { estoque: -item.quantidade }
      });
    }

    const pedidoCompleto = await Pedido.findById(pedidoCriado._id)
      .populate('cliente_id')
      .populate({
        path: 'itens',
        populate: {
          path: 'produto_id',
          model: 'Produto'
        }
      });

    res.status(201).json(pedidoCompleto);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

const listarPedidos = async (req, res) => {
  try {
    const cliente = await Cliente.findOne({ usuario_id: req.usuario.id });
    if (!cliente) {
      return res.status(404).json({ msg: 'Cliente não encontrado' });
    }

    const pedidos = await Pedido.find({ cliente_id: cliente._id })
      .sort({ data_pedido: -1 })
      .populate({
        path: 'itens',
        populate: {
          path: 'produto_id',
          model: 'Produto'
        }
      });

    res.json(pedidos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

const obterPedido = async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id)
      .populate('cliente_id')
      .populate({
        path: 'itens',
        populate: {
          path: 'produto_id',
          model: 'Produto'
        }
      });

    if (!pedido) {
      return res.status(404).json({ msg: 'Pedido não encontrado' });
    }

    // Verificar se o pedido pertence ao cliente (exceto para admin)
    if (req.usuario.tipo !== 'admin') {
      const cliente = await Cliente.findOne({ usuario_id: req.usuario.id });
      if (pedido.cliente_id._id.toString() !== cliente._id.toString()) {
        return res.status(403).json({ msg: 'Não autorizado' });
      }
    }

    res.json(pedido);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

const atualizarStatusPedido = async (req, res) => {
  const { status } = req.body;

  try {
    const pedido = await Pedido.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('cliente_id');

    if (!pedido) {
      return res.status(404).json({ msg: 'Pedido não encontrado' });
    }

    res.json(pedido);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

const listarTodosPedidos = async (req, res) => {
  try {
    const { status } = req.query;
    const filtro = status ? { status } : {};

    const pedidos = await Pedido.find(filtro)
      .sort({ data_pedido: -1 })
      .populate('cliente_id')
      .populate({
        path: 'itens',
        populate: {
          path: 'produto_id',
          model: 'Produto'
        }
      });

    res.json(pedidos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

module.exports = {
  criarPedido,
  listarPedidos,
  obterPedido,
  atualizarStatusPedido,
  listarTodosPedidos
};