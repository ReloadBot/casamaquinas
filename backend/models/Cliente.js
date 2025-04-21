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
    unique: true,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
  cpf: {
    type: DataTypes.STRING(14),
    allowNull: false,
    unique: true
  },
  telefone: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  endereco: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  complemento: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  cidade: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING(2),
    allowNull: false
  },
  cep: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  data_cadastro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'clientes',
  timestamps: false
});

// Definir associação com Usuario
Cliente.belongsTo(Usuario, { foreignKey: 'usuario_id' });

module.exports = Cliente;
