import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import './SidebarCategorias.css';

const SidebarCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const location = useLocation();

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

  useEffect(() => {
    // Extrai o ID da categoria da URL
    const pathParts = location.pathname.split('/');
    if (pathParts.includes('categoria')) {
      const categoryId = pathParts[pathParts.indexOf('categoria') + 1];
      setActiveCategory(categoryId);
    }
  }, [location]);

  if (loading) {
    return <div className="sidebar-loading">Carregando...</div>;
  }

  return (
    <div className="sidebar-categorias">
      <h3 className="sidebar-title">Categorias</h3>
      <ul className="categorias-list">
        {categorias.map(categoria => (
          <li 
            key={categoria._id} 
            className={`categoria-item ${activeCategory === categoria._id ? 'active' : ''}`}
          >
            <Link 
              to={`/categoria/${categoria._id}`} 
              className="categoria-link"
              onClick={() => setActiveCategory(categoria._id)}
            >
              {categoria.nome}
            </Link>
            {categoria.subcategorias && categoria.subcategorias.length > 0 && (
              <ul className="subcategorias-list">
                {categoria.subcategorias.map(sub => (
                  <li 
                    key={sub._id} 
                    className="subcategoria-item"
                  >
                    <Link 
                      to={`/categoria/${categoria._id}/subcategoria/${sub._id}`}
                      className="subcategoria-link"
                    >
                      {sub.nome}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarCategorias;