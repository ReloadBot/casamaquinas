const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UsuarioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  senha: {
    type: String,
    required: true,
    minlength: 6,
    select: false
  },
  tipo: {
    type: String,
    enum: ['admin', 'cliente'],
    default: 'cliente'
  },
  data_cadastro: {
    type: Date,
    default: Date.now
  },
  ultimo_acesso: {
    type: Date
  },
  ativo: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Middleware para hash da senha antes de salvar
UsuarioSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Método para comparar senhas
UsuarioSchema.methods.compararSenha = async function(senha) {
  return await bcrypt.compare(senha, this.senha);
};

// Indexes
UsuarioSchema.index({ email: 1 });
UsuarioSchema.index({ tipo: 1 });

module.exports = mongoose.model('Usuario', UsuarioSchema);