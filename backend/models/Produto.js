// Modelo Produto usando Sequelize
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Categoria = require('./Categoria');
const Subcategoria = require('./Subcategoria');

const Produto = sequelize.define('Produto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  preco: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  estoque: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  categoria_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categorias',
      key: 'id'
    }
  },
  subcategoria_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'subcategorias',
      key: 'id'
    }
  },
  imagem_principal: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  destaque: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  data_cadastro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'produtos',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Definir associações
Produto.belongsTo(Categoria, { foreignKey: 'categoria_id' });
Produto.belongsTo(Subcategoria, { foreignKey: 'subcategoria_id' });
Categoria.hasMany(Produto, { foreignKey: 'categoria_id' });
Subcategoria.hasMany(Produto, { foreignKey: 'subcategoria_id' });

module.exports = Produto;
