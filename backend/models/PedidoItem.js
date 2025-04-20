const mongoose = require('mongoose');

const PedidoItemSchema = new mongoose.Schema({
  produto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Produto',
    required: true
  },
  quantidade: {
    type: Number,
    required: true,
    min: 1
  },
  precoUnitario: {
    type: Number,
    required: true,
    min: 0
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  }
}, { timestamps: true });

// Calcular subtotal antes de salvar
PedidoItemSchema.pre('save', function(next) {
  this.subtotal = this.quantidade * this.precoUnitario;
  next();
});

module.exports = mongoose.model('PedidoItem', PedidoItemSchema);
