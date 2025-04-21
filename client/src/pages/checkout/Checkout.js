import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Checkout.css';

const Checkout = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagamentoConcluido, setPagamentoConcluido] = useState(false);

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/pedidos/${id}`);
        setPedido(response.data);
      } catch (err) {
        console.error('Erro ao buscar pedido:', err);
        setError('Erro ao carregar pedido');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchPedido();
    }
  }, [id, currentUser]);

  const handlePayment = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`/api/pagamento/checkout`, {
        pedidoId: pedido._id,
        itens: pedido.itens.map(item => ({
          id: item.produto_id._id,
          nome: item.produto_id.nome,
          preco: item.preco_unitario,
          quantidade: item.quantidade
        })),
        cliente: {
          id: currentUser._id,
          nome: currentUser.nome,
          email: currentUser.email
        }
      });

      // Redirecionar para o gateway de pagamento
      window.location.href = response.data.url;
    } catch (err) {
      console.error('Erro ao processar pagamento:', err);
      setError(err.response?.data?.message || 'Erro ao processar pagamento');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="auth-required">
        <p>Você precisa estar logado para acessar o checkout</p>
        <button onClick={() => navigate('/login', { state: { from: `/checkout/${id}` } })}>
          Fazer Login
        </button>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Carregando seu pedido...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => navigate('/carrinho')}>Voltar ao Carrinho</button>
      </div>
    );
  }

  if (pagamentoConcluido) {
    return (
      <div className="success-container">
        <h2>Pagamento Concluído!</h2>
        <p>Seu pedido #{pedido._id} foi confirmado.</p>
        <button onClick={() => navigate('/perfil/pedidos')}>Ver Meus Pedidos</button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-steps">
        <div className="step active">1. Revisão</div>
        <div className="step">2. Pagamento</div>
        <div className="step">3. Confirmação</div>
      </div>

      <div className="checkout-content">
        <div className="pedido-resumo">
          <h2>Resumo do Pedido</h2>
          <div className="pedido-itens">
            {pedido.itens.map((item, index) => (
              <div key={index} className="pedido-item">
                <div className="item-info">
                  <h4>{item.produto_id.nome}</h4>
                  <p>Quantidade: {item.quantidade}</p>
                </div>
                <div className="item-price">
                  R$ {(item.preco_unitario * item.quantidade).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <div className="pedido-total">
            <span>Total:</span>
            <span>R$ {pedido.valor_total.toFixed(2)}</span>
          </div>
        </div>

        <div className="endereco-entrega">
          <h2>Endereço de Entrega</h2>
          <p>{pedido.endereco_entrega}</p>
        </div>

        <div className="payment-options">
          <h2>Método de Pagamento</h2>
          <div className="option selected">
            <input 
              type="radio" 
              id="mercado-pago" 
              name="payment" 
              value="mercado-pago" 
              checked 
              readOnly
            />
            <label htmlFor="mercado-pago">Mercado Pago</label>
          </div>
        </div>

        <button 
          onClick={handlePayment}
          className="finalizar-button"
          disabled={loading}
        >
          {loading ? 'Processando...' : 'Finalizar Compra'}
        </button>
      </div>
    </div>
  );
};

export default Checkout;