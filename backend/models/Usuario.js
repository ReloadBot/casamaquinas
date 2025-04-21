// Modelo Usuario usando Sequelize
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  senha: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  tipo: {
    type: DataTypes.ENUM('admin', 'cliente'),
    defaultValue: 'cliente'
  },
  data_cadastro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  ultimo_acesso: {
    type: DataTypes.DATE,
    allowNull: true
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'usuarios',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeCreate: async (usuario) => {
      if (usuario.senha) {
        const salt = await bcrypt.genSalt(10);
        usuario.senha = await bcrypt.hash(usuario.senha, salt);
      }
    },
    beforeUpdate: async (usuario) => {
      if (usuario.changed('senha')) {
        const salt = await bcrypt.genSalt(10);
        usuario.senha = await bcrypt.hash(usuario.senha, salt);
      }
    }
  }
});

// Método para comparar senhas
Usuario.prototype.compararSenha = async function(senha) {
  return await bcrypt.compare(senha, this.senha);
};

module.exports = Usuario;
