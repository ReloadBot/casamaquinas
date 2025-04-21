import React from 'react';
import { Link } from 'react-router-dom';
import './styles/index.css';

const Home = () => {
  return (
    <div className="home-page">
      <div className="container">
        {/* Banner principal */}
        <div className="jumbotron bg-light p-5 rounded mb-4">
          <h1 className="display-4">Bem-vindo à Casa das Máquinas</h1>
          <p className="lead">
            Sua loja especializada em máquinas e equipamentos de qualidade para sua empresa ou projeto.
          </p>
          <hr className="my-4" />
          <p>
            Explore nossa variedade de produtos com os melhores preços e condições do mercado.
          </p>
          <Link to="/produtos" className="btn btn-primary btn-lg">
            Ver Produtos
          </Link>
        </div>

        {/* Categorias em destaque */}
        <h2 className="text-center mb-4">Categorias em Destaque</h2>
        <div className="row mb-5">
          <div className="col-md-4 mb-3">
            <div className="card h-100">
              <div className="card-body text-center">
                <h5 className="card-title">Ferramentas Elétricas</h5>
                <p className="card-text">
                  Encontre as melhores ferramentas elétricas para seu trabalho.
                </p>
                <Link to="/categoria/ferramentas-eletricas" className="btn btn-outline-primary">
                  Explorar
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card h-100">
              <div className="card-body text-center">
                <h5 className="card-title">Equipamentos Industriais</h5>
                <p className="card-text">
                  Equipamentos de alta qualidade para sua indústria.
                </p>
                <Link to="/categoria/equipamentos-industriais" className="btn btn-outline-primary">
                  Explorar
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card h-100">
              <div className="card-body text-center">
                <h5 className="card-title">Peças e Acessórios</h5>
                <p className="card-text">
                  Peças e acessórios para manutenção e upgrade de seus equipamentos.
                </p>
                <Link to="/categoria/pecas-acessorios" className="btn btn-outline-primary">
                  Explorar
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Produtos em destaque */}
        <h2 className="text-center mb-4">Produtos em Destaque</h2>
        <div className="row">
          {/* Estes seriam carregados dinamicamente do backend */}
          <div className="col-md-3 mb-4">
            <div className="card product-card">
              <div className="position-relative">
                <span className="badge bg-danger position-absolute top-0 end-0 m-2">Oferta</span>
                <img src="https://via.placeholder.com/300" className="card-img-top" alt="Produto 1" />
              </div>
              <div className="card-body">
                <h5 className="card-title">Furadeira Profissional</h5>
                <p className="card-text">Furadeira de impacto com 800W de potência.</p>
                <p className="card-text price">R$ 299,90</p>
                <Link to="/produtos/1" className="btn btn-primary w-100">Ver Detalhes</Link>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="card product-card">
              <img src="https://via.placeholder.com/300" className="card-img-top" alt="Produto 2" />
              <div className="card-body">
                <h5 className="card-title">Serra Circular</h5>
                <p className="card-text">Serra circular com 1200W e disco de 7".</p>
                <p className="card-text price">R$ 459,90</p>
                <Link to="/produtos/2" className="btn btn-primary w-100">Ver Detalhes</Link>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="card product-card">
              <img src="https://via.placeholder.com/300" className="card-img-top" alt="Produto 3" />
              <div className="card-body">
                <h5 className="card-title">Compressor de Ar</h5>
                <p className="card-text">Compressor de ar 50L com 2HP.</p>
                <p className="card-text price">R$ 899,90</p>
                <Link to="/produtos/3" className="btn btn-primary w-100">Ver Detalhes</Link>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="card product-card">
              <div className="position-relative">
                <span className="badge bg-success position-absolute top-0 end-0 m-2">Novo</span>
                <img src="https://via.placeholder.com/300" className="card-img-top" alt="Produto 4" />
              </div>
              <div className="card-body">
                <h5 className="card-title">Parafusadeira a Bateria</h5>
                <p className="card-text">Parafusadeira com bateria de lítio 12V.</p>
                <p className="card-text price">R$ 349,90</p>
                <Link to="/produtos/4" className="btn btn-primary w-100">Ver Detalhes</Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Seção de vantagens */}
        <div className="row mt-5 py-4 bg-light rounded">
          <div className="col-md-4 text-center mb-3 mb-md-0">
            <i className="bi bi-truck fs-1 text-primary"></i>
            <h4 className="mt-3">Entrega Rápida</h4>
            <p>Entregamos em todo o Brasil</p>
          </div>
          <div className="col-md-4 text-center mb-3 mb-md-0">
            <i className="bi bi-shield-check fs-1 text-primary"></i>
            <h4 className="mt-3">Garantia de Qualidade</h4>
            <p>Produtos com garantia</p>
          </div>
          <div className="col-md-4 text-center">
            <i className="bi bi-credit-card fs-1 text-primary"></i>
            <h4 className="mt-3">Pagamento Seguro</h4>
            <p>Diversas formas de pagamento</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
