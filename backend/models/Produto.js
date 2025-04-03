const mongoose = require('mongoose');

const ProdutoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  descricao: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  preco: {
    type: Number,
    required: true,
    min: 0
  },
  estoque: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  categoria_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categoria',
    required: true
  },
  subcategoria_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategoria'
  },
  imagem_principal: {
    type: String,
    required: true
  },
  imagens_secundarias: [{
    type: String
  }],
  destaque: {
    type: Boolean,
    default: false
  },
  data_cadastro: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Indexes para melhorar performance nas consultas
ProdutoSchema.index({ nome: 'text', descricao: 'text' });
ProdutoSchema.index({ categoria_id: 1 });
ProdutoSchema.index({ subcategoria_id: 1 });
ProdutoSchema.index({ preco: 1 });
ProdutoSchema.index({ destaque: 1 });

// Middleware para validar estoque não negativo
ProdutoSchema.pre('save', function(next) {
  if (this.estoque < 0) {
    throw new Error('Estoque não pode ser negativo');
  }
  next();
});

module.exports = mongoose.model('Produto', ProdutoSchema);