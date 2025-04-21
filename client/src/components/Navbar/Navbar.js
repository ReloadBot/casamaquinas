import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Casa das Máquinas
        </Link>

        <div className="menu-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <i className={isMenuOpen ? 'fas fa-times' : 'fas fa-bars'} />
        </div>

        <ul className={isMenuOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-links" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/produtos" className="nav-links" onClick={() => setIsMenuOpen(false)}>
              Produtos
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/contato" className="nav-links" onClick={() => setIsMenuOpen(false)}>
              Contato
            </Link>
          </li>

          {currentUser ? (
            <>
              <li className="nav-item">
                <Link to="/perfil" className="nav-links" onClick={() => setIsMenuOpen(false)}>
                  Perfil
                </Link>
              </li>
              <li className="nav-item">
                <button className="nav-links logout-btn" onClick={handleLogout}>
                  Sair
                </button>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <Link to="/login" className="nav-links" onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
            </li>
          )}
        </ul>

        <div className="nav-cart">
          <Link to="/carrinho">
            <i className="fas fa-shopping-cart"></i>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;