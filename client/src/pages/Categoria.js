import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Row, Col, Card, Button } from 'react-bootstrap';
import './styles/index.css';

const Categoria = () => {
  const { id } = useParams();
  const [categoria, setCategoria] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulação de carregamento de categoria e produtos
    // Em uma implementação real, isso seria uma chamada à API
    setTimeout(() => {
      setCategoria({
        _id: id || '1',
        nome: 'Ferramentas Elétricas',
        descricao: 'Ferramentas elétricas para uso profissional e doméstico'
      });
      
      setProdutos([
        {
          _id: '1',
          nome: 'Furadeira Profissional',
          descricao: 'Furadeira de impacto com 800W de potência.',
          preco: 299.90,
          imagem: 'https://via.placeholder.com/300'
        },
        {
          _id: '2',
          nome: 'Serra Circular',
          descricao: 'Serra circular com 1200W e disco de 7".',
          preco: 459.90,
          imagem: 'https://via.placeholder.com/300'
        },
        {
          _id: '4',
          nome: 'Parafusadeira a Bateria',
          descricao: 'Parafusadeira com bateria de lítio 12V.',
          preco: 349.90,
          imagem: 'https://via.placeholder.com/300'
        }
      ]);
      
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-2">Carregando categoria...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="categoria-page">
      <div className="container my-5">
        <div className="mb-4">
          <h1>{categoria.nome}</h1>
          <p className="lead">{categoria.descricao}</p>
        </div>
        
        {produtos.length === 0 ? (
          <div className="alert alert-info">
            Nenhum produto encontrado nesta categoria.
          </div>
        ) : (
          <Row>
            {produtos.map((produto) => (
              <Col key={produto._id} md={4} className="mb-4">
                <Card className="product-card h-100">
                  <Card.Img 
                    variant="top" 
                    src={produto.imagem} 
                    alt={produto.nome}
                    className="card-img-top"
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{produto.nome}</Card.Title>
                    <Card.Text>{produto.descricao}</Card.Text>
                    <Card.Text className="price mt-auto">R$ {produto.preco.toFixed(2)}</Card.Text>
                    <div className="d-flex justify-content-between mt-3">
                      <Link to={`/produtos/${produto._id}`} className="btn btn-primary">
                        Ver Detalhes
                      </Link>
                      <Button variant="success">
                        Adicionar ao Carrinho
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};

export default Categoria;
