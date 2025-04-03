import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../../context/CartContext';
import './ProdutoDetalhe.css';

const ProdutoDetalhe = () => {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [imagemAtiva, setImagemAtiva] = useState(0);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/produtos/${id}`);
        setProduto(response.data);
      } catch (err) {
        console.error('Erro ao buscar produto:', err);
        setError('Produto não encontrado');
      } finally {
        setLoading(false);
      }
    };

    fetchProduto();
  }, [id]);

  const handleAddToCart = () => {
    if (produto.estoque > 0) {
      addToCart({
        id: produto._id,
        nome: produto.nome,
        preco: produto.preco,
        imagem_principal: produto.imagem_principal
      }, quantidade);
      navigate('/carrinho');
    }
  };

  if (loading) {
    return <div className="loading-container">Carregando produto...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => navigate('/produtos')} className="back-button">
          Voltar para produtos
        </button>
      </div>
    );
  }

  return (
    <div className="produto-detalhe-container">
      <div className="produto-imagens">
        <div className="imagem-principal">
          <img 
            src={produto.imagens_secundarias[imagemAtiva] || produto.imagem_principal} 
            alt={produto.nome} 
          />
        </div>
        <div className="imagens-secundarias">
          {[produto.imagem_principal, ...produto.imagens_secundarias].map((img, index) => (
            <div 
              key={index} 
              className={`thumbnail ${imagemAtiva === index ? 'active' : ''}`}
              onClick={() => setImagemAtiva(index)}
            >
              <img src={img} alt={`${produto.nome} ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>

      <div className="produto-info">
        <h1>{produto.nome}</h1>
        <div className="produto-meta">
          <span className="produto-codigo">Código: {produto._id.substring(0, 8)}</span>
          <span className={`produto-estoque ${produto.estoque > 0 ? 'disponivel' : 'indisponivel'}`}>
            {produto.estoque > 0 ? 'Em estoque' : 'Esgotado'}
          </span>
        </div>

        <div className="produto-preco">
          R$ {produto.preco.toFixed(2)}
        </div>

        <div className="produto-descricao">
          <h3>Descrição</h3>
          <p>{produto.descricao}</p>
        </div>

        {produto.estoque > 0 && (
          <div className="produto-comprar">
            <div className="quantidade-container">
              <label>Quantidade:</label>
              <input
                type="number"
                min="1"
                max={produto.estoque}
                value={quantidade}
                onChange={(e) => setQuantidade(Math.max(1, Math.min(produto.estoque, e.target.value)))}
              />
            </div>
            <button 
              onClick={handleAddToCart}
              className="comprar-button"
            >
              Adicionar ao Carrinho
            </button>
          </div>
        )}

        <div className="produto-categorias">
          <p>
            <strong>Categoria:</strong> 
            <span onClick={() => navigate(`/produtos?categoria=${produto.categoria_id._id}`)} className="categoria-link">
              {produto.categoria_id.nome}
            </span>
          </p>
          {produto.subcategoria_id && (
            <p>
              <strong>Subcategoria:</strong> 
              <span onClick={() => navigate(`/produtos?subcategoria=${produto.subcategoria_id._id}`)} className="categoria-link">
                {produto.subcategoria_id.nome}
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProdutoDetalhe;