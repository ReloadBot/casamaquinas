const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');

// Configuração do Sequelize para MySQL
const sequelize = new Sequelize(
  process.env.DB_NAME || 'casadasmaquinas',
  process.env.DB_USER || 'casamaquinas',
  process.env.DB_PASSWORD || '2296',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: (msg) => logger.debug(msg),
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Função para conectar ao banco de dados
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info('MySQL conectado com sucesso');
    
    // Event listeners para monitoramento da conexão
    process.on('SIGINT', async () => {
      await sequelize.close();
      logger.info('Conexão com MySQL fechada devido ao encerramento da aplicação');
      process.exit(0);
    });
  } catch (err) {
    logger.error(`Erro ao conectar ao MySQL: ${err.message}`);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
