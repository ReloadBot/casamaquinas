import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import './CategoriaPage.css';

const CategoriaPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categoria, setCategoria] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [categoriaRes, produtosRes] = await Promise.all([
          axios.get(`/api/categorias/${id}`),
          axios.get('/api/produtos', {
            params: {
              categoria: id,
              pagina: paginaAtual,
              limite: 12
            }
          })
        ]);

        setCategoria(categoriaRes.data);
        setProdutos(produtosRes.data.produtos);
        setTotalPaginas(produtosRes.data.totalPaginas);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        navigate('/produtos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, paginaAtual, navigate]);

  const handlePaginaChange = (pagina) => {
    setPaginaAtual(pagina);
  };

  if (loading) {
    return <div className="loading-categoria">Carregando...</div>;
  }

  return (
    <div className="categoria-container">
      <div className="categoria-header">
        <h1>{categoria.nome}</h1>
        {categoria.descricao && <p className="categoria-descricao">{categoria.descricao}</p>}
      </div>

      {produtos.length === 0 ? (
        <div className="sem-produtos">
          Nenhum produto encontrado nesta categoria.
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
  );
};

export default CategoriaPage;