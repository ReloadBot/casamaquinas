import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './styles/index.css';

const Produtos = () => {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');
  const [categoria, setCategoria] = useState('');
  const [ordenacao, setOrdenacao] = useState('nome');

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        setLoading(true);
        let url = `${process.env.REACT_APP_API_URL}/api/produtos`;
        
        // Adicionar parâmetros de filtro se existirem
        const params = new URLSearchParams();
        if (filtro) params.append('nome', filtro);
        if (categoria) params.append('categoria', categoria);
        params.append('sort', ordenacao);
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        const res = await axios.get(url);
        setProdutos(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar produtos:', err);
        setLoading(false);
      }
    };

    const fetchCategorias = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/categorias`);
        setCategorias(res.data);
      } catch (err) {
        console.error('Erro ao carregar categorias:', err);
      }
    };

    fetchProdutos();
    fetchCategorias();
  }, [filtro, categoria, ordenacao]);

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
  };

  const handleCategoriaChange = (e) => {
    setCategoria(e.target.value);
  };

  const handleOrdenacaoChange = (e) => {
    setOrdenacao(e.target.value);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-2">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="produtos-page">
      <div className="container">
        <h1 className="mb-4">Produtos</h1>
        
        {/* Filtros */}
        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar produtos..."
              value={filtro}
              onChange={handleFiltroChange}
            />
          </div>
          <div className="col-md-4 mb-3">
            <select
              className="form-select"
              value={categoria}
              onChange={handleCategoriaChange}
            >
              <option value="">Todas as categorias</option>
              {categorias.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.nome}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4 mb-3">
            <select
              className="form-select"
              value={ordenacao}
              onChange={handleOrdenacaoChange}
            >
              <option value="nome">Nome (A-Z)</option>
              <option value="-nome">Nome (Z-A)</option>
              <option value="preco">Preço (menor-maior)</option>
              <option value="-preco">Preço (maior-menor)</option>
              <option value="-createdAt">Mais recentes</option>
            </select>
          </div>
        </div>
        
        {/* Lista de produtos */}
        {produtos.length === 0 ? (
          <div className="alert alert-info">
            Nenhum produto encontrado com os filtros selecionados.
          </div>
        ) : (
          <div className="row">
            {produtos.map((produto) => (
              <div key={produto._id} className="col-md-3 mb-4">
                <div className="card product-card h-100">
                  {produto.emPromocao && (
                    <span className="badge bg-danger position-absolute top-0 end-0 m-2">
                      Oferta
                    </span>
                  )}
                  <img
                    src={produto.imagem || "https://via.placeholder.com/300"}
                    className="card-img-top"
                    alt={produto.nome}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{produto.nome}</h5>
                    <p className="card-text">{produto.descricao.substring(0, 100)}...</p>
                    <p className="card-text price mt-auto">
                      R$ {produto.preco.toFixed(2)}
                    </p>
                    <Link
                      to={`/produtos/${produto._id}`}
                      className="btn btn-primary w-100 mt-2"
                    >
                      Ver Detalhes
                    </Link>
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

export default Produtos;
