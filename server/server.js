const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { connectDB } = require('./config/db');
const { syncModels } = require('./models');
const logger = require('./utils/logger');

// Carregar variáveis de ambiente
dotenv.config({ path: path.resolve(__dirname, '../config/.env') });

// Inicializar o aplicativo Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar ao banco de dados MySQL
connectDB();

// Sincronizar modelos com o banco de dados (apenas em desenvolvimento)
if (process.env.NODE_ENV === 'development') {
  syncModels().catch(err => {
    logger.error(`Erro ao sincronizar modelos: ${err.message}`);
  });
}

// Rotas da API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/clientes', require('./routes/clientes'));
app.use('/api/categorias', require('./routes/categorias'));
app.use('/api/produtos', require('./routes/produtos'));
app.use('/api/pedidos', require('./routes/pedidos'));
app.use('/api/pagamento', require('./routes/pagamento'));

// Rota de teste da API
app.get('/api', (req, res) => {
  res.json({ message: 'API Casa das Máquinas funcionando!' });
});

// Servir arquivos estáticos do React em produção
if (process.env.NODE_ENV === 'production') {
  // Definir pasta de arquivos estáticos
  app.use(express.static(path.join(__dirname, '../client/build')));

  // Qualquer rota não reconhecida, enviar para o React
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}

// Porta
const PORT = process.env.PORT || 5000;

// Iniciar o servidor
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Servidor rodando na porta ${PORT}`);
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (err) => {
  logger.error(`Erro não tratado: ${err.message}`);
  // Não fechar o servidor em produção, apenas registrar o erro
  if (process.env.NODE_ENV === 'development') {
    process.exit(1);
  }
});
