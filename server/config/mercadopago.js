const mercadopago = require('mercadopago');
const logger = require('../utils/logger');

/**
 * Configuração do Mercado Pago
 */
const configureMercadoPago = () => {
  try {
    const accessToken = process.env.MP_ACCESS_TOKEN;
    
    if (!accessToken) {
      throw new Error('A variável de ambiente MP_ACCESS_TOKEN não está definida no arquivo .env');
    }
    
    mercadopago.configure({
      access_token: accessToken
    });
    
    logger.info('Mercado Pago configurado com sucesso');
    
    return mercadopago;
  } catch (err) {
    logger.error(`Erro ao configurar Mercado Pago: ${err.message}`);
    throw err;
  }
};

module.exports = {
  configureMercadoPago,
  mercadopago
};
