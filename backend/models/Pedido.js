const mongoose = require('mongoose');

const PedidoSchema = new mongoose.Schema({
  cliente_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true
  },
  itens: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PedidoItem'
  }],
  data_pedido: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pendente', 'pago', 'enviado', 'entregue', 'cancelado'],
    default: 'pendente'
  },
  valor_total: {
    type: Number,
    required: true,
    min: 0
  },
  metodo_pagamento: {
    type: String
  },
  id_pagamento: {
    type: String
  },
  endereco_entrega: {
    type: String,
    required: true
  },
  rastreamento: {
    type: String
  }
}, { timestamps: true });

// Index para melhorar consultas por cliente e status
PedidoSchema.index({ cliente_id: 1 });
PedidoSchema.index({ status: 1 });
PedidoSchema.index({ data_pedido: -1 });

// Middleware para remover itens relacionados quando um pedido é removido
PedidoSchema.pre('remove', async function(next) {
  await this.model('PedidoItem').deleteMany({ pedido_id: this._id });
  next();
});

module.exports = mongoose.model('Pedido', PedidoSchema);