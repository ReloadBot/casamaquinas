import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import './AdminCategorias.css';

const AdminCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [novaCategoria, setNovaCategoria] = useState({
    nome: '',
    descricao: '',
    imagem: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get('/api/categorias');
        setCategorias(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNovaCategoria(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/categorias/${editingId}`, novaCategoria);
        setCategorias(categorias.map(cat => 
          cat._id === editingId ? { ...cat, ...novaCategoria } : cat
        ));
        setEditingId(null);
      } else {
        const response = await axios.post('/api/categorias', novaCategoria);
        setCategorias([...categorias, response.data]);
      }
      setNovaCategoria({ nome: '', descricao: '', imagem: '' });
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
    }
  };

  const handleEdit = (categoria) => {
    setNovaCategoria({
      nome: categoria.nome,
      descricao: categoria.descricao || '',
      imagem: categoria.imagem || ''
    });
    setEditingId(categoria._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/categorias/${id}`);
      setCategorias(categorias.filter(cat => cat._id !== id));
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
    }
  };

  if (!currentUser || currentUser.tipo !== 'admin') {
    return <div className="admin-error">Acesso não autorizado</div>;
  }

  if (loading) {
    return <div className="admin-loading">Carregando...</div>;
  }

  return (
    <div className="admin-categorias-container">
      <h2>Gerenciar Categorias</h2>
      
      <form onSubmit={handleSubmit} className="categoria-form">
        <div className="form-group">
          <label>Nome:</label>
          <input
            type="text"
            name="nome"
            value={novaCategoria.nome}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Descrição:</label>
          <textarea
            name="descricao"
            value={novaCategoria.descricao}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="form-group">
          <label>URL da Imagem:</label>
          <input
            type="text"
            name="imagem"
            value={novaCategoria.imagem}
            onChange={handleInputChange}
          />
        </div>
        
        <button type="submit" className="submit-btn">
          {editingId ? 'Atualizar' : 'Adicionar'}
        </button>
        {editingId && (
          <button 
            type="button" 
            className="cancel-btn"
            onClick={() => {
              setNovaCategoria({ nome: '', descricao: '', imagem: '' });
              setEditingId(null);
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      <div className="categorias-list">
        <h3>Lista de Categorias</h3>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map(categoria => (
              <tr key={categoria._id}>
                <td>{categoria.nome}</td>
                <td>{categoria.descricao || '-'}</td>
                <td className="actions">
                  <button 
                    onClick={() => handleEdit(categoria)}
                    className="edit-btn"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(categoria._id)}
                    className="delete-btn"
                  >
                    Excluir
                  </button>
                  <Link 
                    to={`/admin/categorias/${categoria._id}/subcategorias`}
                    className="subcategorias-link"
                  >
                    Subcategorias
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCategorias;