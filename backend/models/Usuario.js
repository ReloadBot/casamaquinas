// Modelo de Usuário corrigido para o projeto casamaquinas
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, 'Por favor, informe seu nome']
    },
    email: {
      type: String,
      required: [true, 'Por favor, informe seu email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Por favor, informe um email válido'
      ]
    },
    senha: {
      type: String,
      required: [true, 'Por favor, informe sua senha'],
      minlength: [6, 'A senha deve ter pelo menos 6 caracteres'],
      select: false
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    endereco: {
      rua: { type: String },
      numero: { type: String },
      complemento: { type: String },
      bairro: { type: String },
      cidade: { type: String },
      estado: { type: String },
      cep: { type: String }
    },
    telefone: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Método para verificar se a senha está correta
usuarioSchema.methods.matchPassword = async function (senhaDigitada) {
  return await bcrypt.compare(senhaDigitada, this.senha);
};

// Middleware para criptografar a senha antes de salvar
usuarioSchema.pre('save', async function (next) {
  // Só executa se a senha foi modificada
  if (!this.isModified('senha')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
