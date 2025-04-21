import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { currentUser } = useAuth();
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  // Carregar carrinho do localStorage ou da API quando o usuário estiver autenticado
  useEffect(() => {
    const loadCart = async () => {
      try {
        if (currentUser) {
          // Se usuário logado, buscar carrinho da API
          const response = await axios.get('/api/carrinho');
          setCart(response.data.itens || []);
        } else {
          // Se não logado, buscar do localStorage
          const savedCart = localStorage.getItem('cart');
          if (savedCart) {
            setCart(JSON.parse(savedCart));
          }
        }
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
      }
    };

    loadCart();
  }, [currentUser]);

  // Atualizar contagem e total sempre que o carrinho mudar
  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantidade, 0);
    const total = cart.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    
    setCartCount(count);
    setCartTotal(total);
    
    // Salvar no localStorage se não estiver autenticado
    if (!currentUser) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, currentUser]);

  const addToCart = async (product, quantity = 1) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      updateQuantity(product.id, existingItem.quantidade + quantity);
    } else {
      const newItem = {
        id: product.id,
        nome: product.nome,
        preco: product.preco,
        imagem: product.imagem_principal,
        quantidade: quantity
      };
      
      try {
        if (currentUser) {
          await axios.post('/api/carrinho', { produtoId: product.id, quantidade: quantity });
          setCart([...cart, newItem]);
        } else {
          setCart([...cart, newItem]);
        }
      } catch (error) {
        console.error('Erro ao adicionar ao carrinho:', error);
      }
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      if (currentUser) {
        await axios.put(`/api/carrinho/${productId}`, { quantidade: newQuantity });
      }
      
      setCart(cart.map(item => 
        item.id === productId ? { ...item, quantidade: newQuantity } : item
      ));
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      if (currentUser) {
        await axios.delete(`/api/carrinho/${productId}`);
      }
      
      setCart(cart.filter(item => item.id !== productId));
    } catch (error) {
      console.error('Erro ao remover do carrinho:', error);
    }
  };

  const clearCart = async () => {
    try {
      if (currentUser) {
        await axios.delete('/api/carrinho');
      }
      
      setCart([]);
      localStorage.removeItem('cart');
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
    }
  };

  const value = {
    cart,
    cartCount,
    cartTotal,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}