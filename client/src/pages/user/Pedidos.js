import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './styles/index.css';

const Pedidos = () => {
  const { user } = useAuth();
  const [pedidos, setPedidos] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulação de carregamento de pedidos
    // Em uma implementação real, isso seria uma chamada à API
    setTimeout(() => {
      setPedidos([
        {
          id: '1',
          data: '15/04/2025',
          status: 'Entregue',
          total: 1299.90,
          itens: [
            { nome: 'Furadeira Profissional', quantidade: 1, preco: 299.90 },
            { nome: 'Serra Circular', quantidade: 1, preco: 459.90 },
            { nome: 'Compressor de Ar', quantidade: 1, preco: 540.10 }
          ]
        },
        {
          id: '2',
          data: '10/04/2025',
          status: 'Em transporte',
          total: 349.90,
          itens: [
            { nome: 'Parafusadeira a Bateria', quantidade: 1, preco: 349.90 }
          ]
        }
      ]);
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
          <p className="mt-2">Carregando seus pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pedidos-page">
      <div className="container my-5">
        <h1 className="mb-4">Meus Pedidos</h1>
        
        {pedidos.length === 0 ? (
          <div className="alert alert-info">
            Você ainda não realizou nenhum pedido.
          </div>
        ) : (
          <div className="row">
            {pedidos.map((pedido) => (
              <div key={pedido.id} className="col-12 mb-4">
                <div className="card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <div>
                      <strong>Pedido #{pedido.id}</strong> - {pedido.data}
                    </div>
                    <span className={`badge ${pedido.status === 'Entregue' ? 'bg-success' : 'bg-primary'}`}>
                      {pedido.status}
                    </span>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">Itens do Pedido</h5>
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>Produto</th>
                            <th>Quantidade</th>
                            <th>Preço Unitário</th>
                            <th>Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pedido.itens.map((item, index) => (
                            <tr key={index}>
                              <td>{item.nome}</td>
                              <td>{item.quantidade}</td>
                              <td>R$ {item.preco.toFixed(2)}</td>
                              <td>R$ {(item.quantidade * item.preco).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                            <td><strong>R$ {pedido.total.toFixed(2)}</strong></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                  <div className="card-footer">
                    <button className="btn btn-outline-primary">Ver Detalhes</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Pedidos;
