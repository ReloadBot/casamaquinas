import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../styles/index.css';

const AdminProdutos = () => {
  const { token } = useAuth();
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentProduto, setCurrentProduto] = useState({
    nome: '',
    descricao: '',
    preco: 0,
    estoque: 0,
    categoria: '',
    imagem: ''
  });

  useEffect(() => {
    // Simulação de carregamento de produtos
    // Em uma implementação real, isso seria uma chamada à API
    setTimeout(() => {
      setProdutos([
        {
          _id: '1',
          nome: 'Furadeira Profissional',
          descricao: 'Furadeira de impacto com 800W de potência.',
          preco: 299.90,
          estoque: 15,
          categoria: { _id: '1', nome: 'Ferramentas Elétricas' },
          imagem: 'https://via.placeholder.com/300'
        },
        {
          _id: '2',
          nome: 'Serra Circular',
          descricao: 'Serra circular com 1200W e disco de 7".',
          preco: 459.90,
          estoque: 8,
          categoria: { _id: '1', nome: 'Ferramentas Elétricas' },
          imagem: 'https://via.placeholder.com/300'
        },
        {
          _id: '3',
          nome: 'Compressor de Ar',
          descricao: 'Compressor de ar 50L com 2HP.',
          preco: 899.90,
          estoque: 5,
          categoria: { _id: '2', nome: 'Equipamentos Industriais' },
          imagem: 'https://via.placeholder.com/300'
        },
        {
          _id: '4',
          nome: 'Parafusadeira a Bateria',
          descricao: 'Parafusadeira com bateria de lítio 12V.',
          preco: 349.90,
          estoque: 12,
          categoria: { _id: '1', nome: 'Ferramentas Elétricas' },
          imagem: 'https://via.placeholder.com/300'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleOpenModal = (produto = null) => {
    if (produto) {
      setCurrentProduto(produto);
    } else {
      setCurrentProduto({
        nome: '',
        descricao: '',
        preco: 0,
        estoque: 0,
        categoria: '',
        imagem: ''
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduto({
      ...currentProduto,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulação de salvamento de produto
    // Em uma implementação real, isso seria uma chamada à API
    alert('Produto salvo com sucesso!');
    handleCloseModal();
  };

  const handleDelete = (id) => {
    // Simulação de exclusão de produto
    // Em uma implementação real, isso seria uma chamada à API
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      setProdutos(produtos.filter(produto => produto._id !== id));
      alert('Produto excluído com sucesso!');
    }
  };

  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-2">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-produtos">
      <div className="container my-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Gerenciar Produtos</h1>
          <button
            className="btn btn-primary"
            onClick={() => handleOpenModal()}
          >
            Adicionar Produto
          </button>
        </div>
        
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Imagem</th>
                    <th>Nome</th>
                    <th>Categoria</th>
                    <th>Preço</th>
                    <th>Estoque</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {produtos.map((produto) => (
                    <tr key={produto._id}>
                      <td>
                        <img
                          src={produto.imagem}
                          alt={produto.nome}
                          style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                        />
                      </td>
                      <td>{produto.nome}</td>
                      <td>{produto.categoria.nome}</td>
                      <td>R$ {produto.preco.toFixed(2)}</td>
                      <td>{produto.estoque}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleOpenModal(produto)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(produto._id)}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Modal para adicionar/editar produto */}
        {modalOpen && (
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {currentProduto._id ? 'Editar Produto' : 'Adicionar Produto'}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="nome" className="form-label">Nome</label>
                      <input
                        type="text"
                        className="form-control"
                        id="nome"
                        name="nome"
                        value={currentProduto.nome}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="descricao" className="form-label">Descrição</label>
                      <textarea
                        className="form-control"
                        id="descricao"
                        name="descricao"
                        value={currentProduto.descricao}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label htmlFor="preco" className="form-label">Preço</label>
                        <input
                          type="number"
                          className="form-control"
                          id="preco"
                          name="preco"
                          value={currentProduto.preco}
                          onChange={handleChange}
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="estoque" className="form-label">Estoque</label>
                        <input
                          type="number"
                          className="form-control"
                          id="estoque"
                          name="estoque"
                          value={currentProduto.estoque}
                          onChange={handleChange}
                          min="0"
                          required
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="categoria" className="form-label">Categoria</label>
                      <select
                        className="form-select"
                        id="categoria"
                        name="categoria"
                        value={currentProduto.categoria._id}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Selecione uma categoria</option>
                        <option value="1">Ferramentas Elétricas</option>
                        <option value="2">Equipamentos Industriais</option>
                        <option value="3">Peças e Acessórios</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="imagem" className="form-label">URL da Imagem</label>
                      <input
                        type="text"
                        className="form-control"
                        id="imagem"
                        name="imagem"
                        value={currentProduto.imagem}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleCloseModal}
                      >
                        Cancelar
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Salvar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProdutos;
