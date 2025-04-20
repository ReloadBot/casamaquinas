import React from 'react';
import './styles/index.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer bg-dark text-white py-4 mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5>Casa das Máquinas</h5>
            <p>Sua loja especializada em máquinas e equipamentos de qualidade.</p>
          </div>
          <div className="col-md-4">
            <h5>Links Úteis</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-white">Início</a></li>
              <li><a href="/produtos" className="text-white">Produtos</a></li>
              <li><a href="/sobre" className="text-white">Sobre Nós</a></li>
              <li><a href="/contato" className="text-white">Contato</a></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Contato</h5>
            <address>
              <p>Rua Exemplo, 123 - Centro</p>
              <p>São Paulo - SP</p>
              <p>Email: contato@casamaquinas.com.br</p>
              <p>Tel: (11) 1234-5678</p>
            </address>
          </div>
        </div>
        <hr />
        <div className="text-center">
          <p>&copy; {currentYear} Casa das Máquinas. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
