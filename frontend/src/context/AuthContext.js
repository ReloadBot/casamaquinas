import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verificar se o usuário está autenticado ao carregar a página
    const loadUser = async () => {
      if (token) {
        try {
          const config = {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          };

          const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/me`, config);
          setUser(res.data);
        } catch (err) {
          localStorage.removeItem('token');
          setToken(null);
          setError('Sessão expirada. Por favor, faça login novamente.');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Registrar usuário
  const register = async (userData) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, userData, config);
      
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
      }
      
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao registrar. Tente novamente.');
      throw err;
    }
  };

  // Login de usuário
  const login = async (email, password) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        { email, password },
        config
      );
      
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
      }
      
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciais inválidas');
      throw err;
    }
  };

  // Logout de usuário
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Atualizar perfil
  const updateProfile = async (userData) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/auth/profile`,
        userData,
        config
      );
      
      setUser(res.data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao atualizar perfil');
      throw err;
    }
  };

  const value = {
    user,
    token,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
