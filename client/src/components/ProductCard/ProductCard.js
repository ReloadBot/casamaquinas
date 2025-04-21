import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <Link to={`/produtos/${product.id}`} className="product-link">
        <div className="product-image-container">
          <img 
            src={product.imagem_principal || '/images/product-placeholder.jpg'} 
            alt={product.nome} 
            className="product-image"
          />
          {product.estoque <= 0 && (
            <div className="out-of-stock-badge">Esgotado</div>
          )}
        </div>
        
        <div className="product-info">
          <h3 className="product-name">{product.nome}</h3>
          <p className="product-description">{product.descricao.substring(0, 60)}...</p>
          <div className="product-price-container">
            <span className="product-price">R$ {product.preco.toFixed(2)}</span>
            {product.estoque > 0 && (
              <button 
                className="add-to-cart-btn"
                onClick={(e) => {
                  e.preventDefault();
                  // Lógica para adicionar ao carrinho será implementada aqui
                }}
              >
                <i className="fas fa-cart-plus"></i>
              </button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;