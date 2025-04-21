// Modelo Subcategoria usando Sequelize
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Categoria = require('./Categoria');

const Subcategoria = sequelize.define('Subcategoria', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  categoria_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categorias',
      key: 'id'
    }
  },
  data_criacao: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'subcategorias',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['nome', 'categoria_id']
    }
  ]
});

// Definir associação com Categoria
Subcategoria.belongsTo(Categoria, { foreignKey: 'categoria_id' });
Categoria.hasMany(Subcategoria, { foreignKey: 'categoria_id' });

module.exports = Subcategoria;
