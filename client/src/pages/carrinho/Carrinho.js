import React, { useState, useEffect } from 'react';
import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Carrinho.css';

const Carrinho = () => {
  const { cart, cartCount, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!currentUser) {
      navigate('/login', { state: { from: '/carrinho' } });
      return;
    }

    try {
      setLoading(true);
      setError('');

      const itensPedido = cart.map(item => ({
        produtoId: item.id,
        quantidade: item.quantidade
      }));

      const response = await axios.post('/api/pedidos', { itens: itensPedido });
      clearCart();
      navigate(`/checkout/${response.data._id}`);
    } catch (err) {
      console.error('Erro ao finalizar pedido:', err);
      setError(err.response?.data?.msg || 'Erro ao finalizar pedido');
    } finally {
      setLoading(false);
    }
  };

  if (cartCount === 0) {
    return (
      <div className="carrinho-vazio">
        <h2>Seu carrinho está vazio</h2>
        <p>Adicione produtos para continuar</p>
        <Link to="/produtos" className="btn-voltar">
          Voltar para loja
        </Link>
      </div>
    );
  }

  return (
    <div className="carrinho-container">
      <h2>Seu Carrinho ({cartCount} {cartCount === 1 ? 'item' : 'itens'})</h2>
      
      {error && <div className="error-message">{error}</div>}

      <div className="carrinho-content">
        <div className="itens-list">
          {cart.map(item => (
            <div key={item.id} className="carrinho-item">
              <div className="item-imagem">
                <img 
                  src={item.imagem_principal || '/images/product-placeholder.jpg'} 
                  alt={item.nome} 
                />
              </div>
              
              <div className="item-info">
                <h3>
                  <Link to={`/produtos/${item.id}`}>{item.nome}</Link>
                </h3>
                <div className="item-preco">R$ {item.preco.toFixed(2)}</div>
                
                <div className="item-quantidade">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantidade - 1)}
                    disabled={item.quantidade <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantidade}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantidade + 1)}
                  >
                    +
                  </button>
                </div>
                
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="item-remover"
                >
                  Remover
                </button>
              </div>
              
              <div className="item-subtotal">
                R$ {(item.preco * item.quantidade).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
        
        <div className="resumo-pedido">
          <h3>Resumo do Pedido</h3>
          
          <div className="resumo-linha">
            <span>Subtotal</span>
            <span>R$ {cartTotal.toFixed(2)}</span>
          </div>
          
          <div className="resumo-linha">
            <span>Frete</span>
            <span>Grátis</span>
          </div>
          
          <div className="resumo-total">
            <span>Total</span>
            <span>R$ {cartTotal.toFixed(2)}</span>
          </div>
          
          <button 
            onClick={handleCheckout}
            className="btn-finalizar"
            disabled={loading}
          >
            {loading ? 'Processando...' : 'Finalizar Compra'}
          </button>
          
          {!currentUser && (
            <div className="login-message">
              <p>Você precisa estar logado para finalizar a compra</p>
              <Link to="/login" className="btn-login">
                Fazer Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Carrinho;