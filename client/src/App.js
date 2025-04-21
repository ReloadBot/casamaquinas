import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Produtos from './pages/produtos';
import ProdutoDetalhe from './pages/produtos/ProdutoDetalhe';
import Categoria from './pages/Categoria';
import Login from './pages/auth/Login';
import Cadastro from './pages/auth/Cadastro';
import Perfil from './pages/user/Perfil';
import Pedidos from './pages/user/Pedidos';
import Carrinho from './pages/Carrinho';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/admin';
import AdminProdutos from './pages/admin/Produtos';
import AdminPedidos from './pages/admin/Pedidos';
import AdminCategorias from './pages/admin/Categorias';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import PageNotFound from './components/PageNotFound';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/produtos" element={<Produtos />} />
                <Route path="/produtos/:id" element={<ProdutoDetalhe />} />
                <Route path="/categoria/:id" element={<Categoria />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
                
                {/* Rotas privadas (usuário logado) */}
                <Route element={<PrivateRoute />}>
                  <Route path="/perfil" element={<Perfil />} />
                  <Route path="/pedidos" element={<Pedidos />} />
                  <Route path="/carrinho" element={<Carrinho />} />
                  <Route path="/checkout/:id" element={<Checkout />} />
                </Route>

                {/* Rotas de administrador */}
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/produtos" element={<AdminProdutos />} />
                  <Route path="/admin/pedidos" element={<AdminPedidos />} />
                  <Route path="/admin/categorias" element={<AdminCategorias />} />
                </Route>

                {/* Rota 404 */}
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;