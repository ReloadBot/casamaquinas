// Modelo Pedido usando Sequelize
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Cliente = require('./Cliente');

const Pedido = sequelize.define('Pedido', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cliente_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'clientes',
      key: 'id'
    }
  },
  data_pedido: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.ENUM('pendente', 'pago', 'enviado', 'entregue', 'cancelado'),
    defaultValue: 'pendente'
  },
  valor_total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  metodo_pagamento: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  id_pagamento: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  endereco_entrega: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  rastreamento: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'pedidos',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Definir associações
Pedido.belongsTo(Cliente, { foreignKey: 'cliente_id' });
Cliente.hasMany(Pedido, { foreignKey: 'cliente_id' });

module.exports = Pedido;
