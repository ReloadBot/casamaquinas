// Importar o módulo de configuração do Mercado Pago no server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { configureMercadoPago } = require('./config/mercadopago');
const logger = require('./utils/logger');

// Inicializar aplicação
const app = express();

// Conectar ao banco de dados
connectDB();

// Configurar Mercado Pago
try {
  configureMercadoPago();
  logger.info('Mercado Pago configurado com sucesso');
} catch (err) {
  logger.error(`Erro ao configurar Mercado Pago: ${err.message}`);
}

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/categorias', require('./routes/categorias'));
app.use('/api/clientes', require('./routes/clientes'));
app.use('/api/pedidos', require('./routes/pedidos'));
app.use('/api/produtos', require('./routes/produtos'));
app.use('/api/pagamento', require('./routes/pagamento'));

// Configuração para produção
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
  });
}

// Tratamento de erros
app.use((err, req, res, next) => {
  logger.error(`Erro no servidor: ${err.message}`);
  console.error(err.stack);
  res.status(500).send('Algo quebrou!');
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Servidor rodando na porta ${PORT}`);
});
