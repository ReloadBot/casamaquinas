import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Banner from '../components/Banner';
import './Home.css';

const Home = () => {
  const [destaques, setDestaques] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [destaquesRes, categoriasRes] = await Promise.all([
          axios.get('/api/produtos?destaque=true&limite=8'),
          axios.get('/api/categorias?limite=4')
        ]);

        setDestaques(destaquesRes.data.produtos);
        setCategorias(categoriasRes.data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading-home">Carregando...</div>;
  }

  return (
    <div className="home-container">
      <Banner />

      <section className="destaques-section">
        <div className="section-header">
          <h2>Produtos em Destaque</h2>
          <Link to="/produtos" className="ver-todos">Ver todos</Link>
        </div>
        
        <div className="produtos-grid">
          {destaques.map(produto => (
            <ProductCard key={produto._id} product={produto} />
          ))}
        </div>
      </section>

      <section className="categorias-section">
        <h2>Nossas Categorias</h2>
        <div className="categorias-grid">
          {categorias.map(categoria => (
            <Link 
              to={`/categoria/${categoria._id}`} 
              key={categoria._id} 
              className="categoria-card"
            >
              <div className="categoria-imagem">
                {categoria.imagem ? (
                  <img src={categoria.imagem} alt={categoria.nome} />
                ) : (
                  <div className="placeholder-imagem"></div>
                )}
              </div>
              <h3>{categoria.nome}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section className="sobre-section">
        <div className="sobre-content">
          <h2>Casa das Máquinas</h2>
          <p>
            Especializada em equipamentos para jardinagem e peças para motores de roçadeiras, 
            cortadores de grama e geradores. Qualidade e garantia em todos os nossos produtos.
          </p>
          <Link to="/sobre" className="saiba-mais">Saiba mais</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;