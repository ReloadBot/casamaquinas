// Modelo Categoria usando Sequelize
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Categoria = sequelize.define('Categoria', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  descricao: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  imagem: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  data_criacao: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'categorias',
  timestamps: false
});

module.exports = Categoria;
