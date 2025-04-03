const mongoose = require('mongoose');

const SubcategoriaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  categoria_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categoria',
    required: true
  },
  data_criacao: {
    type: Date,
    default: Date.now
  }
});

// Índices para otimização
SubcategoriaSchema.index({ nome: 1, categoria_id: 1 }, { unique: true });
SubcategoriaSchema.index({ categoria_id: 1 });

// Middleware para remover referência da categoria pai quando subcategoria é removida
SubcategoriaSchema.pre('remove', async function(next) {
  await this.model('Categoria').updateOne(
    { _id: this.categoria_id },
    { $pull: { subcategorias: this._id } }
  );
  next();
});

// Middleware para adicionar referência na categoria pai quando subcategoria é criada
SubcategoriaSchema.post('save', async function(doc) {
  await this.model('Categoria').updateOne(
    { _id: doc.categoria_id },
    { $addToSet: { subcategorias: doc._id } }
  );
});

module.exports = mongoose.model('Subcategoria', SubcategoriaSchema);