import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './styles/index.css';

const Carrinho = () => {
  const { cartItems, total, updateQuantity, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleQuantidadeChange = (id, quantidade) => {
    updateQuantity(id, parseInt(quantidade));
  };

  const handleRemoveItem = (id) => {
    removeFromCart(id);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <h2>Seu carrinho está vazio</h2>
          <p className="mt-3">Adicione produtos ao seu carrinho para continuar.</p>
          <Link to="/produtos" className="btn btn-primary mt-3">
            Continuar Comprando
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="carrinho-page">
      <div className="container my-5">
        <h1 className="mb-4">Seu Carrinho</h1>
        
        <div className="row">
          <div className="col-lg-8">
            <div className="card mb-4">
              <div className="card-body">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item row align-items-center">
                    <div className="col-md-2">
                      <img
                        src={item.imagem || "https://via.placeholder.com/100"}
                        alt={item.nome}
                        className="img-fluid"
                      />
                    </div>
                    <div className="col-md-4">
                      <h5>{item.nome}</h5>
                      <p className="text-muted">Código: {item.id}</p>
                    </div>
                    <div className="col-md-2">
                      <p className="fw-bold">R$ {item.preco.toFixed(2)}</p>
                    </div>
                    <div className="col-md-2">
                      <div className="input-group">
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => handleQuantidadeChange(item.id, item.quantidade - 1)}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          className="form-control text-center"
                          value={item.quantidade}
                          onChange={(e) => handleQuantidadeChange(item.id, e.target.value)}
                          min="1"
                        />
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => handleQuantidadeChange(item.id, item.quantidade + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="col-md-2 text-end">
                      <p className="fw-bold">R$ {(item.preco * item.quantidade).toFixed(2)}</p>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="d-flex justify-content-between">
              <Link to="/produtos" className="btn btn-outline-primary">
                Continuar Comprando
              </Link>
            </div>
          </div>
          
          <div className="col-lg-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Resumo do Pedido</h5>
                <hr />
                
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.quantidade, 0)} itens)</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
                
                <div className="d-flex justify-content-between mb-2">
                  <span>Frete</span>
                  <span>Calculado no checkout</span>
                </div>
                
                <hr />
                
                <div className="d-flex justify-content-between mb-3">
                  <span className="fw-bold">Total</span>
                  <span className="fw-bold">R$ {total.toFixed(2)}</span>
                </div>
                
                <div className="d-grid gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={handleCheckout}
                  >
                    Finalizar Compra
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carrinho;
