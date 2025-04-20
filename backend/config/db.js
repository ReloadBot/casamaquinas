const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    // Usar a URI do MongoDB local definida no arquivo .env
    const mongoUri = process.env.DB_URI;
    
    if (!mongoUri) {
      throw new Error('A variável de ambiente DB_URI não está definida no arquivo .env');
    }
    
    // Conectar ao MongoDB local
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    logger.info(`MongoDB local conectado: ${conn.connection.host}`);
    
    // Event listeners para monitoramento da conexão
    mongoose.connection.on('connected', () => {
      logger.info('Mongoose conectado ao DB local');
    });
    
    mongoose.connection.on('error', (err) => {
      logger.error(`Erro na conexão do Mongoose: ${err.message}`);
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('Mongoose desconectado do DB local');
    });
    
    // Captura eventos de encerramento para fechar a conexão graciosamente
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('Conexão com MongoDB local fechada devido ao encerramento da aplicação');
      process.exit(0);
    });
  } catch (err) {
    logger.error(`Erro ao conectar ao MongoDB local: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
