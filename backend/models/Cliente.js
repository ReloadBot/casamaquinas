const mongoose = require('mongoose');

const ClienteSchema = new mongoose.Schema({
  usuario_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
    unique: true
  },
  cpf: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  telefone: {
    type: String,
    required: true,
    trim: true
  },
  endereco: {
    type: String,
    required: true,
    trim: true
  },
  complemento: {
    type: String,
    trim: true
  },
  cidade: {
    type: String,
    required: true,
    trim: true
  },
  estado: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2
  },
  cep: {
    type: String,
    required: true,
    trim: true
  },
  data_cadastro: {
    type: Date,
    default: Date.now
  }
});

// Index para melhorar consultas por CPF e usuário
ClienteSchema.index({ cpf: 1 });
ClienteSchema.index({ usuario_id: 1 });

module.exports = mongoose.model('Cliente', ClienteSchema);