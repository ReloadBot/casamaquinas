import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './styles/index.css';

// Componente para rotas que requerem privilégios de administrador
const AdminRoute = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Carregando...</div>;
  }
  
  return isAuthenticated && isAdmin ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;
