import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './styles/index.css';

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cartItems, total, clearCart } = useCart();
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('cartao');
  const [endereco, setEndereco] = useState({
    rua: user?.endereco?.rua || '',
    numero: user?.endereco?.numero || '',
    complemento: user?.endereco?.complemento || '',
    bairro: user?.endereco?.bairro || '',
    cidade: user?.endereco?.cidade || '',
    estado: user?.endereco?.estado || '',
    cep: user?.endereco?.cep || ''
  });
  const [frete, setFrete] = useState({
    valor: 0,
    prazo: '7 a 10 dias úteis',
    tipo: 'normal'
  });

  useEffect(() => {
    // Se não houver itens no carrinho e não for um pedido existente, redirecionar
    if (cartItems.length === 0 && !id) {
      navigate('/carrinho');
    }
    
    // Se for um pedido existente, carregar os dados
    if (id) {
      const fetchPedido = async () => {
        try {
          setLoading(true);
          const config = {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          };
          
          const res = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/pedidos/${id}`,
            config
          );
          
          // Implementar lógica para carregar dados do pedido
          setLoading(false);
        } catch (err) {
          setError('Erro ao carregar pedido. Tente novamente.');
          setLoading(false);
        }
      };
      
      fetchPedido();
    }
  }, [id, cartItems, navigate, token]);

  const handleEnderecoChange = (e) => {
    setEndereco({
      ...endereco,
      [e.target.name]: e.target.value
    });
  };

  const handleFreteChange = (e) => {
    const tipoFrete = e.target.value;
    if (tipoFrete === 'expresso') {
      setFrete({
        valor: 25.90,
        prazo: '2 a 3 dias úteis',
        tipo: 'expresso'
      });
    } else {
      setFrete({
        valor: 0,
        prazo: '7 a 10 dias úteis',
        tipo: 'normal'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!endereco.rua || !endereco.numero || !endereco.bairro || !endereco.cidade || !endereco.estado || !endereco.cep) {
      setError('Por favor, preencha todos os campos de endereço obrigatórios.');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const pedidoData = {
        itens: cartItems.map(item => ({
          produto: item.id,
          quantidade: item.quantidade,
          precoUnitario: item.preco
        })),
        endereco,
        formaPagamento,
        frete: frete.tipo,
        valorFrete: frete.valor,
        valorTotal: total + frete.valor
      };
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };
      
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/pedidos`,
        pedidoData,
        config
      );
      
      // Limpar carrinho após finalizar pedido
      clearCart();
      
      // Redirecionar para página de pagamento ou confirmação
      navigate(`/checkout/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao processar pedido. Tente novamente.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
        <p className="mt-2">Processando seu pedido...</p>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container my-5">
        <h1 className="mb-4">Finalizar Compra</h1>
        
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        
        <div className="row">
          <div className="col-lg-8">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Endereço de Entrega</h5>
                <form>
                  <div className="row mb-3">
                    <div className="col-md-6 mb-3 mb-md-0">
                      <label htmlFor="cep" className="form-label">CEP</label>
                      <input
                        type="text"
                        className="form-control"
                        id="cep"
                        name="cep"
                        value={endereco.cep}
                        onChange={handleEnderecoChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-8 mb-3 mb-md-0">
                      <label htmlFor="rua" className="form-label">Rua</label>
                      <input
                        type="text"
                        className="form-control"
                        id="rua"
                        name="rua"
                        value={endereco.rua}
                        onChange={handleEnderecoChange}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="numero" className="form-label">Número</label>
                      <input
                        type="text"
                        className="form-control"
                        id="numero"
                        name="numero"
                        value={endereco.numero}
                        onChange={handleEnderecoChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="complemento" className="form-label">Complemento (opcional)</label>
                    <input
                      type="text"
                      className="form-control"
                      id="complemento"
                      name="complemento"
                      value={endereco.complemento}
                      onChange={handleEnderecoChange}
                    />
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-4 mb-3 mb-md-0">
                      <label htmlFor="bairro" className="form-label">Bairro</label>
                      <input
                        type="text"
                        className="form-control"
                        id="bairro"
                        name="bairro"
                        value={endereco.bairro}
                        onChange={handleEnderecoChange}
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3 mb-md-0">
                      <label htmlFor="cidade" className="form-label">Cidade</label>
                      <input
                        type="text"
                        className="form-control"
                        id="cidade"
                        name="cidade"
                        value={endereco.cidade}
                        onChange={handleEnderecoChange}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="estado" className="form-label">Estado</label>
                      <select
                        className="form-select"
                        id="estado"
                        name="estado"
                        value={endereco.estado}
                        onChange={handleEnderecoChange}
                        required
                      >
                        <option value="">Selecione...</option>
                        <option value="AC">Acre</option>
                        <option value="AL">Alagoas</option>
                        <option value="AP">Amapá</option>
                        <option value="AM">Amazonas</option>
                        <option value="BA">Bahia</option>
                        <option value="CE">Ceará</option>
                        <option value="DF">Distrito Federal</option>
                        <option value="ES">Espírito Santo</option>
                        <option value="GO">Goiás</option>
                        <option value="MA">Maranhão</option>
                        <option value="MT">Mato Grosso</option>
                        <option value="MS">Mato Grosso do Sul</option>
                        <option value="MG">Minas Gerais</option>
                        <option value="PA">Pará</option>
                        <option value="PB">Paraíba</option>
                        <option value="PR">Paraná</option>
                        <option value="PE">Pernambuco</option>
                        <option value="PI">Piauí</option>
                        <option value="RJ">Rio de Janeiro</option>
                        <option value="RN">Rio Grande do Norte</option>
                        <option value="RS">Rio Grande do Sul</option>
                        <option value="RO">Rondônia</option>
                        <option value="RR">Roraima</option>
                        <option value="SC">Santa Catarina</option>
                        <option value="SP">São Paulo</option>
                        <option value="SE">Sergipe</option>
                        <option value="TO">Tocantins</option>
                      </select>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Opções de Entrega</h5>
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="frete"
                    id="freteNormal"
                    value="normal"
                    checked={frete.tipo === 'normal'}
                    onChange={handleFreteChange}
                  />
                  <label className="form-check-label" htmlFor="freteNormal">
                    <div className="d-flex justify-content-between">
                      <span>Entrega Normal (7 a 10 dias úteis)</span>
                      <span className="fw-bold">Grátis</span>
                    </div>
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="frete"
                    id="freteExpresso"
                    value="expresso"
                    checked={frete.tipo === 'expresso'}
                    onChange={handleFreteChange}
                  />
                  <label className="form-check-label" htmlFor="freteExpresso">
                    <div className="d-flex justify-content-between">
                      <span>Entrega Expressa (2 a 3 dias úteis)</span>
                      <span className="fw-bold">R$ 25,90</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Forma de Pagamento</h5>
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="formaPagamento"
                    id="cartao"
                    value="cartao"
                    checked={formaPagamento === 'cartao'}
                    onChange={(e) => setFormaPagamento(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="cartao">
                    Cartão de Crédito
                  </label>
                </div>
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="formaPagamento"
                    id="boleto"
                    value="boleto"
                    checked={formaPagamento === 'boleto'}
                    onChange={(e) => setFormaPagamento(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="boleto">
                    Boleto Bancário
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="formaPagamento"
                    id="pix"
                    value="pix"
                    checked={formaPagamento === 'pix'}
                    onChange={(e) => setFormaPagamento(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="pix">
                    PIX
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-4">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Resumo do Pedido</h5>
                <hr />
                
                {cartItems.map((item) => (
                  <div key={item.id} className="d-flex justify-content-between mb-2">
                    <span>{item.nome} x {item.quantidade}</span>
                    <span>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                  </div>
                ))}
                
                <hr />
                
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
                
                <div className="d-flex justify-content-between mb-2">
                  <span>Frete</span>
                  <span>{frete.valor > 0 ? `R$ ${frete.valor.toFixed(2)}` : 'Grátis'}</span>
                </div>
                
                <hr />
                
                <div className="d-flex justify-content-between mb-3">
                  <span className="fw-bold">Total</span>
                  <span className="fw-bold">R$ {(total + frete.valor).toFixed(2)}</span>
                </div>
                
                <div className="d-grid gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? 'Processando...' : 'Finalizar Pedido'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
