import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
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

  if (!currentUser || currentUser.tipo !== 'admin') {
    return (
      <div className="admin-access-denied">
        <h2>Acesso não autorizado</h2>
        <p>Você precisa ser um administrador para acessar esta página.</p>
        <Link to="/" className="return-home">Voltar à página inicial</Link>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <h2>Painel Admin</h2>
        <nav>
          <ul className="admin-menu">
            <li>
              <Link to="/admin" end>Visão Geral</Link>
            </li>
            <li>
              <Link to="/admin/produtos">Produtos</Link>
            </li>
            <li>
              <Link to="/admin/categorias">Categorias</Link>
            </li>
            <li>
              <Link to="/admin/pedidos">Pedidos</Link>
            </li>
            <li>
              <Link to="/admin/clientes">Clientes</Link>
            </li>
          </ul>
        </nav>
        <button onClick={handleLogout} className="logout-btn">
          Sair
        </button>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;