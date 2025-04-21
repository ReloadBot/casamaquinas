// Modelo PedidoItem usando Sequelize
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Pedido = require('./Pedido');
const Produto = require('./Produto');

const PedidoItem = sequelize.define('PedidoItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  pedido_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'pedidos',
      key: 'id'
    }
  },
  produto_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'produtos',
      key: 'id'
    }
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  preco_unitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'pedido_itens',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeCreate: (item) => {
      item.subtotal = item.quantidade * item.preco_unitario;
    },
    beforeUpdate: (item) => {
      if (item.changed('quantidade') || item.changed('preco_unitario')) {
        item.subtotal = item.quantidade * item.preco_unitario;
      }
    }
  }
});

// Definir associações
PedidoItem.belongsTo(Pedido, { foreignKey: 'pedido_id' });
PedidoItem.belongsTo(Produto, { foreignKey: 'produto_id' });
Pedido.hasMany(PedidoItem, { foreignKey: 'pedido_id', as: 'itens' });
Produto.hasMany(PedidoItem, { foreignKey: 'produto_id' });

module.exports = PedidoItem;
