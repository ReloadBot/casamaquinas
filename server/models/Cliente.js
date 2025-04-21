// Modelo Cliente usando Sequelize
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Usuario = require('./Usuario');

const Cliente = sequelize.define('Cliente', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
  cpf: {
    type: DataTypes.STRING(14),
    allowNull: true,
    unique: {
      args: true,
      msg: 'Este CPF já está cadastrado',
      // Permitir múltiplos valores NULL
      name: 'clientes_cpf_unique_constraint'
    }
  },
  telefone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  endereco: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  cidade: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  estado: {
    type: DataTypes.STRING(2),
    allowNull: true
  },
  cep: {
    type: DataTypes.STRING(9),
    allowNull: true
  }
}, {
  tableName: 'clientes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Associação com o modelo Usuario
Cliente.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

module.exports = Cliente;
