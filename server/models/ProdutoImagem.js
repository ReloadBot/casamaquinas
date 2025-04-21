// Modelo ProdutoImagem usando Sequelize
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Produto = require('./Produto');

const ProdutoImagem = sequelize.define('ProdutoImagem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  produto_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'produtos',
      key: 'id'
    }
  },
  imagem: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'produto_imagens',
  timestamps: false
});

// Definir associações
ProdutoImagem.belongsTo(Produto, { foreignKey: 'produto_id' });
Produto.hasMany(ProdutoImagem, { foreignKey: 'produto_id', as: 'imagens_secundarias' });

module.exports = ProdutoImagem;
