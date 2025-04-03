import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../../../components/ProductCard';
import SidebarCategorias from '../../../components/SidebarCategorias';
import './ProdutosPage.css';

const ProdutosPage = () => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [filtros, setFiltros] = useState({
    busca: '',
    categoria: '',
    subcategoria: '',
    ordenar: 'recentes'
  });

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const params = {
      busca: searchParams.get('busca') || '',
      categoria: searchParams.get('categoria') || '',
      subcategoria: searchParams.get('subcategoria') || '',
      ordenar: searchParams.get('ordenar') || 'recentes',
      pagina: searchParams.get('pagina') || 1
    };

    setFiltros({
      busca: params.busca,
      categoria: params.categoria,
      subcategoria: params.subcategoria,
      ordenar: params.ordenar
    });
    setPaginaAtual(Number(params.pagina));

    const fetchProdutos = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/produtos', {
          params: {
            busca: params.busca,
            categoria: params.categoria,
            subcategoria: params.subcategoria,
            ordenar: params.ordenar,
            pagina: params.pagina,
            limite: 12
          }
        });

        setProdutos(response.data.produtos);
        setTotalPaginas(response.data.totalPaginas);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, [location.search]);

  const handleFiltroChange = (novosFiltros) => {
    const params = new URLSearchParams();
    
    if (novosFiltros.busca) params.set('busca', novosFiltros.busca);
    if (novosFiltros.categoria) params.set('categoria', novosFiltros.categoria);
    if (novosFiltros.subcategoria) params.set('subcategoria', novosFiltros.subcategoria);
    if (novosFiltros.ordenar && novosFiltros.ordenar !== 'recentes') params.set('ordenar', novosFiltros.ordenar);
    
    navigate(`/produtos?${params.toString()}`);
  };

  const handlePaginaChange = (pagina) => {
    const params = new URLSearchParams(location.search);
    params.set('pagina', pagina);
    navigate(`/produtos?${params.toString()}`);
  };

  return (
    <div className="produtos-page-container">
      <SidebarCategorias 
        categoriaAtiva={filtros.categoria}
        subcategoriaAtiva={filtros.subcategoria}
        onCategoriaClick={(categoriaId) => handleFiltroChange({
          ...filtros,
          categoria: categoriaId,
          subcategoria: ''
        })}
        onSubcategoriaClick={(subcategoriaId) => handleFiltroChange({
          ...filtros,
          subcategoria: subcategoriaId
        })}
      />

      <div className="produtos-content">
        <div className="filtros-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={filtros.busca}
              onChange={(e) => setFiltros({...filtros, busca: e.target.value})}
              onKeyPress={(e) => e.key === 'Enter' && handleFiltroChange({...filtros, busca: e.target.value})}
            />
            <button 
              onClick={() => handleFiltroChange({...filtros, busca: filtros.busca})}
              className="search-button"
            >
              <i className="fas fa-search"></i>
            </button>
          </div>

          <div className="ordenar-container">
            <label>Ordenar por:</label>
            <select
              value={filtros.ordenar}
              onChange={(e) => handleFiltroChange({...filtros, ordenar: e.target.value})}
            >
              <option value="recentes">Mais recentes</option>
              <option value="preco-asc">Preço: menor para maior</option>
              <option value="preco-desc">Preço: maior para menor</option>
              <option value="nome-asc">Nome: A-Z</option>
              <option value="nome-desc">Nome: Z-A</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">Carregando produtos...</div>
        ) : produtos.length === 0 ? (
          <div className="no-products">
            Nenhum produto encontrado com os filtros selecionados.
          </div>
        ) : (
          <>
            <div className="produtos-grid">
              {produtos.map(produto => (
                <ProductCard 
                  key={produto._id} 
                  product={produto} 
                />
              ))}
            </div>

            {totalPaginas > 1 && (
              <div className="paginacao">
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(num => (
                  <button
                    key={num}
                    onClick={() => handlePaginaChange(num)}
                    className={paginaAtual === num ? 'active' : ''}
                  >
                    {num}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProdutosPage;