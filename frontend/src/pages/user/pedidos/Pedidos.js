import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';
import './UserPedidos.css';

const UserPedidos = () => {
  const { currentUser } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/pedidos/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setPedidos(response.data);
      } catch (err) {
        console.error('Erro ao buscar pedidos:', err);
        setError('Erro ao carregar pedidos. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchPedidos();
    }
  }, [currentUser]);

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pago':
        return 'status-badge-pago';
      case 'enviado':
        return 'status-badge-enviado';
      case 'entregue':
        return 'status-badge-entregue';
      case 'cancelado':
        return 'status-badge-cancelado';
      default:
        return 'status-badge-pendente';
    }
  };

  if (!currentUser) {
    return <div className="auth-required">Faça login para visualizar seus pedidos</div>;
  }

  if (loading) {
    return <div className="loading-pedidos">Carregando seus pedidos...</div>;
  }

  if (error) {
    return <div className="error-pedidos">{error}</div>;
  }

  return (
    <div className="user-pedidos-container">
      <h2>Meus Pedidos</h2>
      
      {pedidos.length === 0 ? (
        <div className="no-pedidos">
          <p>Você ainda não fez nenhum pedido.</p>
          <a href="/produtos" className="btn-comprar">Ir para loja</a>
        </div>
      ) : (
        <div className="pedidos-list">
          {pedidos.map(pedido => (
            <div key={pedido._id} className="pedido-card">
              <div className="pedido-header">
                <div>
                  <span className="pedido-id">Pedido #{pedido._id.substring(0, 8)}</span>
                  <span className="pedido-date">{formatDate(pedido.data_pedido)}</span>
                </div>
                <span className={`status-badge ${getStatusBadgeClass(pedido.status)}`}>
                  {pedido.status}
                </span>
              </div>

              <div className="pedido-items">
                {pedido.itens.map((item, index) => (
                  <div key={index} className="pedido-item">
                    <img 
                      src={item.produto_id?.imagem_principal || '/images/product-placeholder.jpg'} 
                      alt={item.produto_id?.nome} 
                      className="item-image"
                    />
                    <div className="item-details">
                      <h4>{item.produto_id?.nome || 'Produto não disponível'}</h4>
                      <p>Quantidade: {item.quantidade}</p>
                      <p>R$ {item.preco_unitario.toFixed(2)} cada</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pedido-footer">
                <div className="pedido-total">
                  Total: R$ {pedido.valor_total.toFixed(2)}
                </div>
                <a href={`/pedidos/${pedido._id}`} className="btn-detalhes">
                  Ver detalhes
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserPedidos;