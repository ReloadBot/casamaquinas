const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const logger = require('../utils/logger');

let mongoServer;

const connectDB = async () => {
  try {
    // Criar instância do MongoDB em memória
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    // Conectar ao MongoDB em memória
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    logger.info(`MongoDB em memória conectado: ${conn.connection.host}`);

    // Event listeners para monitoramento da conexão
    mongoose.connection.on('connected', () => {
      logger.info('Mongoose conectado ao DB em memória');
    });

    mongoose.connection.on('error', (err) => {
      logger.error(`Erro na conexão do Mongoose: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('Mongoose desconectado do DB em memória');
    });

    // Captura eventos de encerramento para fechar a conexão graciosamente
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      if (mongoServer) {
        await mongoServer.stop();
      }
      logger.info('Conexão com MongoDB em memória fechada devido ao encerramento da aplicação');
      process.exit(0);
    });

  } catch (err) {
    logger.error(`Erro ao conectar ao MongoDB em memória: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
