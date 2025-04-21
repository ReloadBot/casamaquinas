// Atualização do arquivo server.js para usar MySQL com Sequelize
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const { syncModels } = require('./models');
const logger = require('./utils/logger');

// Carregar variáveis de ambiente
dotenv.config();

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

// Rotas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/clientes', require('./routes/clientes'));
app.use('/api/categorias', require('./routes/categorias'));
app.use('/api/subcategorias', require('./routes/subcategorias'));
app.use('/api/produtos', require('./routes/produtos'));
app.use('/api/pedidos', require('./routes/pedidos'));

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API Casa das Máquinas funcionando!' });
});

// Porta
const PORT = process.env.PORT || 5000;

// Iniciar o servidor
app.listen(PORT, () => {
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
