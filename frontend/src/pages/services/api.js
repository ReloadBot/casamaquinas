import axios from 'axios';

// Configuração base da API
const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login?sessionExpired=true';
    }
    return Promise.reject(error);
  }
);

// Funções específicas da API
export const getProdutos = (params) => api.get('/produtos', { params });
export const getProdutoById = (id) => api.get(`/produtos/${id}`);
export const getCategorias = () => api.get('/categorias');
export const getCategoriaById = (id) => api.get(`/categorias/${id}`);

export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);
export const getCurrentUser = () => api.get('/auth/usuario');
export const logout = () => api.post('/auth/logout');

export const getCarrinho = () => api.get('/carrinho');
export const addToCart = (productId, quantity) => api.post('/carrinho', { productId, quantity });
export const updateCartItem = (productId, quantity) => api.put(`/carrinho/${productId}`, { quantity });
export const removeFromCart = (productId) => api.delete(`/carrinho/${productId}`);
export const clearCart = () => api.delete('/carrinho');

export const criarPedido = (pedidoData) => api.post('/pedidos', pedidoData);
export const getPedidos = (params) => api.get('/pedidos', { params });
export const getPedidoById = (id) => api.get(`/pedidos/${id}`);
export const atualizarStatusPedido = (id, status) => api.put(`/pedidos/${id}/status`, { status });

export const getCliente = () => api.get('/clientes/me');
export const atualizarCliente = (clienteData) => api.put('/clientes/me', clienteData);
export const getClientes = (params) => api.get('/clientes', { params });
export const getClienteById = (id) => api.get(`/clientes/${id}`);

export default api;
