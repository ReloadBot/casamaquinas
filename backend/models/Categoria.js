const mongoose = require('mongoose');

const CategoriaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    maxlength: 50
  },
  descricao: {
    type: String,
    trim: true,
    maxlength: 500
  },
  imagem: {
    type: String,
    trim: true
  },
  subcategorias: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategoria'
  }],
  data_criacao: {
    type: Date,
    default: Date.now
  }
});

// Middleware para remover subcategorias relacionadas quando uma categoria é removida
CategoriaSchema.pre('remove', async function(next) {
  await this.model('Subcategoria').deleteMany({ categoria_id: this._id });
  next();
});

module.exports = mongoose.model('Categoria', CategoriaSchema);