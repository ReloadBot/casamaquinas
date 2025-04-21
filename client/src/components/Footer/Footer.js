import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>Casa das Máquinas</h4>
          <p>Especializada em equipamentos para jardinagem e peças para motores</p>
        </div>

        <div className="footer-section">
          <h4>Links Rápidos</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/produtos">Produtos</Link></li>
            <li><Link to="/contato">Contato</Link></li>
            <li><Link to="/sobre">Sobre Nós</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contato</h4>
          <p>Email: contato@casadasmaquinas.com.br</p>
          <p>Telefone: (XX) XXXX-XXXX</p>
          <p>Endereço: Rua Exemplo, 123 - Centro</p>
        </div>

        <div className="footer-section">
          <h4>Formas de Pagamento</h4>
          <div className="payment-methods">
            <span>Cartões</span>
            <span>Boleto</span>
            <span>PIX</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Casa das Máquinas. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;