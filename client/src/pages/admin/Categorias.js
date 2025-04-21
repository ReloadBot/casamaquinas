import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../styles/index.css';

const AdminCategorias = () => {
  const { token } = useAuth();
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentCategoria, setCurrentCategoria] = useState({
    nome: '',
    descricao: ''
  });

  useEffect(() => {
    // Simulação de carregamento de categorias
    // Em uma implementação real, isso seria uma chamada à API
    setTimeout(() => {
      setCategorias([
        {
          _id: '1',
          nome: 'Ferramentas Elétricas',
          descricao: 'Ferramentas elétricas para uso profissional e doméstico',
          produtosCount: 15
        },
        {
          _id: '2',
          nome: 'Equipamentos Industriais',
          descricao: 'Equipamentos para uso industrial e comercial',
          produtosCount: 8
        },
        {
          _id: '3',
          nome: 'Peças e Acessórios',
          descricao: 'Peças e acessórios para manutenção e upgrade de equipamentos',
          produtosCount: 25
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleOpenModal = (categoria = null) => {
    if (categoria) {
      setCurrentCategoria(categoria);
    } else {
      setCurrentCategoria({
        nome: '',
        descricao: ''
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentCategoria({
      ...currentCategoria,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulação de salvamento de categoria
    // Em uma implementação real, isso seria uma chamada à API
    alert('Categoria salva com sucesso!');
    handleCloseModal();
  };

  const handleDelete = (id) => {
    // Simulação de exclusão de categoria
    // Em uma implementação real, isso seria uma chamada à API
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      setCategorias(categorias.filter(categoria => categoria._id !== id));
      alert('Categoria excluída com sucesso!');
    }
  };

  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-2">Carregando categorias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-categorias">
      <div className="container my-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Gerenciar Categorias</h1>
          <button
            className="btn btn-primary"
            onClick={() => handleOpenModal()}
          >
            Adicionar Categoria
          </button>
        </div>
        
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Descrição</th>
                    <th>Produtos</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {categorias.map((categoria) => (
                    <tr key={categoria._id}>
                      <td>{categoria.nome}</td>
                      <td>{categoria.descricao}</td>
                      <td>{categoria.produtosCount}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleOpenModal(categoria)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(categoria._id)}
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
        
        {/* Modal para adicionar/editar categoria */}
        {modalOpen && (
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {currentCategoria._id ? 'Editar Categoria' : 'Adicionar Categoria'}
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
                        value={currentCategoria.nome}
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
                        value={currentCategoria.descricao}
                        onChange={handleChange}
                        required
                      ></textarea>
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

export default AdminCategorias;
