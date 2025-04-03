const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });

    logger.info(`MongoDB conectado: ${conn.connection.host}`);

    // Event listeners para monitoramento da conexão
    mongoose.connection.on('connected', () => {
      logger.info('Mongoose conectado ao DB');
    });

    mongoose.connection.on('error', (err) => {
      logger.error(`Erro na conexão do Mongoose: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('Mongoose desconectado do DB');
    });

    // Captura eventos de encerramento para fechar a conexão graciosamente
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('Conexão com MongoDB fechada devido ao encerramento da aplicação');
      process.exit(0);
    });

  } catch (err) {
    logger.error(`Erro ao conectar ao MongoDB: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;