const express = require('express');
const router = express.Router();
const { mercadopago } = require('../config/mercadopago');
const Pedido = require('../models/Pedido');
const auth = require('../middleware/auth');
const logger = require('../utils/logger');

// Rota para criar preferência de pagamento
router.post('/checkout', auth, async (req, res) => {
  try {
    const { itens, pedidoId } = req.body;
    const cliente = req.usuario;

    const preference = {
      items: itens.map(item => ({
        title: item.nome,
        unit_price: parseFloat(item.preco),
        quantity: parseInt(item.quantidade),
        picture_url: item.imagem
      })),
      payer: {
        name: cliente.nome,
        email: cliente.email
      },
      external_reference: pedidoId,
      back_urls: {
        success: `${process.env.FRONTEND_URL}/pedido/sucesso`,
        failure: `${process.env.FRONTEND_URL}/pedido/erro`,
        pending: `${process.env.FRONTEND_URL}/pedido/pendente`
      },
      auto_return: 'approved',
      notification_url: `${process.env.BACKEND_URL}/api/pagamento/webhook`
    };

    const response = await mercadopago.preferences.create(preference);
    logger.info(`Preferência de pagamento criada para o pedido ${pedidoId}`);
    res.json({ id: response.body.id });

  } catch (err) {
    logger.error(`Erro no processamento do pagamento: ${err.message}`);
    res.status(500).send('Erro no processamento do pagamento');
  }
});

// Rota para webhook de notificação
router.post('/webhook', async (req, res) => {
  try {
    const { type, data } = req.body;

    if (type === 'payment') {
      const payment = await mercadopago.payment.findById(data.id);
      const pedidoId = payment.body.external_reference;
      const status = payment.body.status;

      let novoStatus;
      switch (status) {
        case 'approved':
          novoStatus = 'pago';
          break;
        case 'pending':
          novoStatus = 'pendente';
          break;
        case 'cancelled':
          novoStatus = 'cancelado';
          break;
        default:
          novoStatus = 'pendente';
      }

      await Pedido.findByIdAndUpdate(pedidoId, { status: novoStatus });
      logger.info(`Status do pedido ${pedidoId} atualizado para ${novoStatus}`);
    }

    res.status(200).send();
  } catch (err) {
    logger.error(`Erro no webhook: ${err.message}`);
    res.status(500).send('Erro no webhook');
  }
});

module.exports = router;
