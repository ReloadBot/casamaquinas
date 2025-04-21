import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import './styles/index.css';

const ProdutoDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const [produtosRelacionados, setProdutosRelacionados] = useState([]);

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/produtos/${id}`);
        setProduto(res.data);
        
        // Buscar produtos relacionados da mesma categoria
        if (res.data.categoria) {
          const relatedRes = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/produtos?categoria=${res.data.categoria._id}&limit=4`
          );
          // Filtrar o produto atual da lista de relacionados
          setProdutosRelacionados(
            relatedRes.data.filter(p => p._id !== id)
          );
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar produto:', err);
        setError('Produto não encontrado ou erro ao carregar dados.');
        setLoading(false);
      }
    };

    fetchProduto();
  }, [id]);

  const handleQuantidadeChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (produto?.estoque || 10)) {
      setQuantidade(value);
    }
  };

  const handleAddToCart = () => {
    if (produto) {
      addToCart(produto, quantidade);
      navigate('/carrinho');
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-2">Carregando detalhes do produto...</p>
        </div>
      </div>
    );
  }

  if (error || !produto) {
    return (
      <div className="container">
        <div className="alert alert-danger my-5">
          {error || 'Produto não encontrado.'}
        </div>
        <Link to="/produtos" className="btn btn-primary">
          Voltar para Produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="produto-detalhe">
      <div className="container">
        <nav aria-label="breadcrumb" className="mt-3">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Início</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/produtos">Produtos</Link>
            </li>
            {produto.categoria && (
              <li className="breadcrumb-item">
                <Link to={`/categoria/${produto.categoria._id}`}>
                  {produto.categoria.nome}
                </Link>
              </li>
            )}
            <li className="breadcrumb-item active" aria-current="page">
              {produto.nome}
            </li>
          </ol>
        </nav>

        <div className="row mb-5">
          <div className="col-md-5 mb-4">
            <div className="card">
              <img
                src={produto.imagem || "https://via.placeholder.com/600x400"}
                className="img-fluid"
                alt={produto.nome}
              />
            </div>
          </div>
          <div className="col-md-7">
            <h1 className="mb-3">{produto.nome}</h1>
            
            {produto.emPromocao && (
              <div className="badge bg-danger mb-3">Promoção</div>
            )}
            
            <p className="fs-2 fw-bold text-success mb-3">
              R$ {produto.preco.toFixed(2)}
            </p>
            
            <div className="mb-4">
              {produto.estoque > 0 ? (
                <span className="badge bg-success">Em estoque</span>
              ) : (
                <span className="badge bg-danger">Fora de estoque</span>
              )}
            </div>
            
            <div className="mb-4">
              <p>{produto.descricao}</p>
            </div>
            
            <div className="mb-4">
              <div className="row g-3 align-items-center">
                <div className="col-auto">
                  <label htmlFor="quantidade" className="col-form-label">
                    Quantidade:
                  </label>
                </div>
                <div className="col-auto">
                  <input
                    type="number"
                    id="quantidade"
                    className="form-control"
                    value={quantidade}
                    onChange={handleQuantidadeChange}
                    min="1"
                    max={produto.estoque || 10}
                  />
                </div>
              </div>
            </div>
            
            <div className="d-grid gap-2">
              <button
                className="btn btn-primary btn-lg"
                onClick={handleAddToCart}
                disabled={produto.estoque <= 0}
              >
                Adicionar ao Carrinho
              </button>
            </div>
            
            <div className="mt-4">
              <h5>Especificações:</h5>
              <ul className="list-group">
                {produto.especificacoes && produto.especificacoes.map((spec, index) => (
                  <li key={index} className="list-group-item">
                    <strong>{spec.nome}:</strong> {spec.valor}
                  </li>
                ))}
                {(!produto.especificacoes || produto.especificacoes.length === 0) && (
                  <li className="list-group-item">
                    Informações detalhadas não disponíveis.
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Produtos relacionados */}
        {produtosRelacionados.length > 0 && (
          <div className="related-products mb-5">
            <h3 className="mb-4">Produtos Relacionados</h3>
            <div className="row">
              {produtosRelacionados.map((produto) => (
                <div key={produto._id} className="col-md-3 mb-4">
                  <div className="card product-card h-100">
                    <img
                      src={produto.imagem || "https://via.placeholder.com/300"}
                      className="card-img-top"
                      alt={produto.nome}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{produto.nome}</h5>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default ProdutoDetalhe;
