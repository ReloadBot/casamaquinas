import React from 'react';
import { Link } from 'react-router-dom';
import './styles/index.css';

// Componente para página não encontrada (404)
const PageNotFound = () => {
  return (
    <div className="page-not-found">
      <h1>404 - Página Não Encontrada</h1>
      <p>A página que você está procurando não existe ou foi removida.</p>
      <Link to="/" className="btn btn-primary">
        Voltar para a Página Inicial
      </Link>
    </div>
  );
};

export default PageNotFound;
