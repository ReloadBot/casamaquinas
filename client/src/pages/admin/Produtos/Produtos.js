import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import './AdminProdutos.css';

const AdminProdutos = () => {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [novoProduto, setNovoProduto] = useState({
    nome: '',
    descricao: '',
    preco: 0,
    estoque: 0,
    categoria_id: '',
    subcategoria_id: '',
    imagem_principal: '',
    imagens_secundarias: []
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [produtosRes, categoriasRes] = await Promise.all([
          axios.get('/api/produtos'),
          axios.get('/api/categorias?includeSubcategories=true')
        ]);
        setProdutos(produtosRes.data);
        setCategorias(categoriasRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNovoProduto(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/produtos/${editingId}`, novoProduto);
        setProdutos(produtos.map(prod => 
          prod._id === editingId ? { ...prod, ...novoProduto } : prod
        ));
      } else {
        const response = await axios.post('/api/produtos', novoProduto);
        setProdutos([...produtos, response.data]);
      }
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    }
  };

  const handleEdit = (produto) => {
    setNovoProduto({
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco,
      estoque: produto.estoque,
      categoria_id: produto.categoria_id?._id || '',
      subcategoria_id: produto.subcategoria_id?._id || '',
      imagem_principal: produto.imagem_principal,
      imagens_secundarias: produto.imagens_secundarias || []
    });
    setEditingId(produto._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/produtos/${id}`);
      setProdutos(produtos.filter(prod => prod._id !== id));
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
    }
  };

  const resetForm = () => {
    setNovoProduto({
      nome: '',
      descricao: '',
      preco: 0,
      estoque: 0,
      categoria_id: '',
      subcategoria_id: '',
      imagem_principal: '',
      imagens_secundarias: []
    });
    setEditingId(null);
  };

  if (!currentUser || currentUser.tipo !== 'admin') {
    return <div className="admin-error">Acesso não autorizado</div>;
  }

  if (loading) {
    return <div className="admin-loading">Carregando...</div>;
  }

  return (
    <div className="admin-produtos-container">
      <h2>Gerenciar Produtos</h2>
      
      <form onSubmit={handleSubmit} className="produto-form">
        <div className="form-row">
          <div className="form-group">
            <label>Nome:</label>
            <input
              type="text"
              name="nome"
              value={novoProduto.nome}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Preço:</label>
            <input
              type="number"
              name="preco"
              step="0.01"
              min="0"
              value={novoProduto.preco}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Descrição:</label>
          <textarea
            name="descricao"
            value={novoProduto.descricao}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Estoque:</label>
            <input
              type="number"
              name="estoque"
              min="0"
              value={novoProduto.estoque}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Categoria:</label>
            <select
              name="categoria_id"
              value={novoProduto.categoria_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecione</option>
              {categorias.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.nome}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Subcategoria:</label>
            <select
              name="subcategoria_id"
              value={novoProduto.subcategoria_id}
              onChange={handleInputChange}
              disabled={!novoProduto.categoria_id}
            >
              <option value="">Nenhuma</option>
              {novoProduto.categoria_id && 
                categorias
                  .find(c => c._id === novoProduto.categoria_id)
                  ?.subcategorias?.map(sub => (
                    <option key={sub._id} value={sub._id}>{sub.nome}</option>
                  ))
              }
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Imagem Principal (URL):</label>
          <input
            type="text"
            name="imagem_principal"
            value={novoProduto.imagem_principal}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="submit-btn">
            {editingId ? 'Atualizar' : 'Adicionar'}
          </button>
          {editingId && (
            <button 
              type="button" 
              className="cancel-btn"
              onClick={resetForm}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="produtos-list">
        <h3>Lista de Produtos</h3>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Preço</th>
                <th>Estoque</th>
                <th>Categoria</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map(produto => (
                <tr key={produto._id}>
                  <td>{produto.nome}</td>
                  <td>R$ {produto.preco.toFixed(2)}</td>
                  <td className={produto.estoque <= 0 ? 'estoque-zero' : ''}>
                    {produto.estoque}
                  </td>
                  <td>{produto.categoria_id?.nome || '-'}</td>
                  <td className="actions">
                    <button 
                      onClick={() => handleEdit(produto)}
                      className="edit-btn"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(produto._id)}
                      className="delete-btn"
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
  );
};

export default AdminProdutos;