import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import './AdminPedidos.css';

const AdminPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos');
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        let url = '/api/pedidos';
        if (filtro !== 'todos') {
          url += `?status=${filtro}`;
        }
        
        const response = await axios.get(url);
        setPedidos(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [filtro]);

  const atualizarStatus = async (pedidoId, novoStatus) => {
    try {
      await axios.put(`/api/pedidos/${pedidoId}/status`, { status: novoStatus });
      setPedidos(pedidos.map(pedido => 
        pedido._id === pedidoId ? { ...pedido, status: novoStatus } : pedido
      ));
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  if (!currentUser || currentUser.tipo !== 'admin') {
    return <div className="admin-error">Acesso não autorizado</div>;
  }

  if (loading) {
    return <div className="admin-loading">Carregando pedidos...</div>;
  }

  return (
    <div className="admin-pedidos-container">
      <h2>Gerenciar Pedidos</h2>
      
      <div className="filtro-container">
        <label>Filtrar por status:</label>
        <select 
          value={filtro} 
          onChange={(e) => setFiltro(e.target.value)}
          className="filtro-select"
        >
          <option value="todos">Todos</option>
          <option value="pendente">Pendentes</option>
          <option value="pago">Pagos</option>
          <option value="enviado">Enviados</option>
          <option value="entregue">Entregues</option>
          <option value="cancelado">Cancelados</option>
        </select>
      </div>

      <div className="pedidos-list">
        {pedidos.length === 0 ? (
          <p className="sem-pedidos">Nenhum pedido encontrado</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Data</th>
                <th>Cliente</th>
                <th>Total</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map(pedido => (
                <tr key={pedido._id}>
                  <td>{pedido._id.substring(0, 6)}...</td>
                  <td>{new Date(pedido.data_pedido).toLocaleDateString()}</td>
                  <td>{pedido.cliente_id?.nome || 'Cliente não encontrado'}</td>
                  <td>R$ {pedido.valor_total.toFixed(2)}</td>
                  <td>
                    <select
                      value={pedido.status}
                      onChange={(e) => atualizarStatus(pedido._id, e.target.value)}
                      className={`status-select ${pedido.status}`}
                    >
                      <option value="pendente">Pendente</option>
                      <option value="pago">Pago</option>
                      <option value="enviado">Enviado</option>
                      <option value="entregue">Entregue</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </td>
                  <td>
                    <button 
                      className="detalhes-btn"
                      onClick={() => {
                        // Implementar visualização de detalhes
                      }}
                    >
                      Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminPedidos;