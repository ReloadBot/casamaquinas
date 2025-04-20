import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../styles/index.css';

const AdminPedidos = () => {
  const { token } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState('');

  useEffect(() => {
    // Simulação de carregamento de pedidos
    // Em uma implementação real, isso seria uma chamada à API
    setTimeout(() => {
      setPedidos([
        {
          _id: '1',
          cliente: { _id: '1', nome: 'João Silva', email: 'joao@example.com' },
          data: '20/04/2025',
          status: 'Entregue',
          total: 1299.90,
          itens: [
            { produto: { nome: 'Furadeira Profissional' }, quantidade: 1, precoUnitario: 299.90 },
            { produto: { nome: 'Serra Circular' }, quantidade: 1, precoUnitario: 459.90 },
            { produto: { nome: 'Compressor de Ar' }, quantidade: 1, precoUnitario: 540.10 }
          ]
        },
        {
          _id: '2',
          cliente: { _id: '2', nome: 'Maria Oliveira', email: 'maria@example.com' },
          data: '19/04/2025',
          status: 'Em transporte',
          total: 349.90,
          itens: [
            { produto: { nome: 'Parafusadeira a Bateria' }, quantidade: 1, precoUnitario: 349.90 }
          ]
        },
        {
          _id: '3',
          cliente: { _id: '3', nome: 'Pedro Santos', email: 'pedro@example.com' },
          data: '18/04/2025',
          status: 'Processando',
          total: 899.90,
          itens: [
            { produto: { nome: 'Compressor de Ar' }, quantidade: 1, precoUnitario: 899.90 }
          ]
        },
        {
          _id: '4',
          cliente: { _id: '4', nome: 'Ana Souza', email: 'ana@example.com' },
          data: '17/04/2025',
          status: 'Cancelado',
          total: 459.90,
          itens: [
            { produto: { nome: 'Serra Circular' }, quantidade: 1, precoUnitario: 459.90 }
          ]
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleStatusChange = (e) => {
    setFiltroStatus(e.target.value);
  };

  const handleUpdateStatus = (id, novoStatus) => {
    // Simulação de atualização de status
    // Em uma implementação real, isso seria uma chamada à API
    setPedidos(
      pedidos.map(pedido => 
        pedido._id === id ? { ...pedido, status: novoStatus } : pedido
      )
    );
    alert(`Status do pedido #${id} atualizado para ${novoStatus}`);
  };

  const pedidosFiltrados = filtroStatus 
    ? pedidos.filter(pedido => pedido.status === filtroStatus)
    : pedidos;

  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-2">Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-pedidos">
      <div className="container my-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Gerenciar Pedidos</h1>
          <div className="d-flex align-items-center">
            <label htmlFor="filtroStatus" className="me-2">Filtrar por Status:</label>
            <select
              id="filtroStatus"
              className="form-select"
              value={filtroStatus}
              onChange={handleStatusChange}
            >
              <option value="">Todos</option>
              <option value="Processando">Processando</option>
              <option value="Em transporte">Em transporte</option>
              <option value="Entregue">Entregue</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
        </div>
        
        {pedidosFiltrados.length === 0 ? (
          <div className="alert alert-info">
            Nenhum pedido encontrado com os filtros selecionados.
          </div>
        ) : (
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Cliente</th>
                      <th>Data</th>
                      <th>Status</th>
                      <th>Total</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidosFiltrados.map((pedido) => (
                      <tr key={pedido._id}>
                        <td>#{pedido._id}</td>
                        <td>{pedido.cliente.nome}</td>
                        <td>{pedido.data}</td>
                        <td>
                          <span className={`badge ${
                            pedido.status === 'Entregue' ? 'bg-success' :
                            pedido.status === 'Em transporte' ? 'bg-primary' :
                            pedido.status === 'Processando' ? 'bg-warning' :
                            'bg-danger'
                          }`}>
                            {pedido.status}
                          </span>
                        </td>
                        <td>R$ {pedido.total.toFixed(2)}</td>
                        <td>
                          <div className="dropdown">
                            <button
                              className="btn btn-sm btn-outline-primary dropdown-toggle me-2"
                              type="button"
                              id={`dropdownStatus${pedido._id}`}
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              Atualizar Status
                            </button>
                            <ul className="dropdown-menu" aria-labelledby={`dropdownStatus${pedido._id}`}>
                              <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() => handleUpdateStatus(pedido._id, 'Processando')}
                                >
                                  Processando
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() => handleUpdateStatus(pedido._id, 'Em transporte')}
                                >
                                  Em transporte
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() => handleUpdateStatus(pedido._id, 'Entregue')}
                                >
                                  Entregue
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() => handleUpdateStatus(pedido._id, 'Cancelado')}
                                >
                                  Cancelado
                                </button>
                              </li>
                            </ul>
                          </div>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => alert(`Detalhes do pedido #${pedido._id}`)}
                          >
                            Ver Detalhes
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPedidos;
