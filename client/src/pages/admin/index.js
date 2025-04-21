import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './styles/index.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = React.useState({
    totalProdutos: 0,
    totalPedidos: 0,
    totalClientes: 0,
    vendasRecentes: []
  });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulação de carregamento de estatísticas
    // Em uma implementação real, isso seria uma chamada à API
    setTimeout(() => {
      setStats({
        totalProdutos: 48,
        totalPedidos: 124,
        totalClientes: 87,
        vendasRecentes: [
          { id: '1', cliente: 'João Silva', data: '20/04/2025', valor: 1299.90 },
          { id: '2', cliente: 'Maria Oliveira', data: '19/04/2025', valor: 349.90 },
          { id: '3', cliente: 'Pedro Santos', data: '18/04/2025', valor: 899.90 },
          { id: '4', cliente: 'Ana Souza', data: '17/04/2025', valor: 459.90 },
          { id: '5', cliente: 'Carlos Ferreira', data: '16/04/2025', valor: 1599.90 }
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-2">Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="container my-5">
        <h1 className="mb-4">Painel Administrativo</h1>
        
        <div className="row mb-4">
          <div className="col-md-4 mb-3 mb-md-0">
            <div className="card text-center h-100">
              <div className="card-body">
                <h5 className="card-title">Total de Produtos</h5>
                <p className="card-text display-4">{stats.totalProdutos}</p>
                <a href="/admin/produtos" className="btn btn-primary">Gerenciar Produtos</a>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3 mb-md-0">
            <div className="card text-center h-100">
              <div className="card-body">
                <h5 className="card-title">Total de Pedidos</h5>
                <p className="card-text display-4">{stats.totalPedidos}</p>
                <a href="/admin/pedidos" className="btn btn-primary">Gerenciar Pedidos</a>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center h-100">
              <div className="card-body">
                <h5 className="card-title">Total de Clientes</h5>
                <p className="card-text display-4">{stats.totalClientes}</p>
                <a href="/admin/clientes" className="btn btn-primary">Gerenciar Clientes</a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">Vendas Recentes</h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Data</th>
                    <th>Valor</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.vendasRecentes.map((venda) => (
                    <tr key={venda.id}>
                      <td>#{venda.id}</td>
                      <td>{venda.cliente}</td>
                      <td>{venda.data}</td>
                      <td>R$ {venda.valor.toFixed(2)}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-2">Ver</button>
                        <button className="btn btn-sm btn-outline-secondary">Editar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card-footer text-end">
            <a href="/admin/pedidos" className="btn btn-primary">Ver Todos os Pedidos</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
