import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(0);

  // Carregar carrinho do localStorage ao iniciar
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Atualizar localStorage e calcular totais quando o carrinho mudar
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    const itemCount = cartItems.reduce((acc, item) => acc + item.quantidade, 0);
    setCount(itemCount);
    
    const cartTotal = cartItems.reduce(
      (acc, item) => acc + item.preco * item.quantidade, 
      0
    );
    setTotal(cartTotal);
  }, [cartItems]);

  // Adicionar item ao carrinho
  const addToCart = (produto, quantidade = 1) => {
    setCartItems(prevItems => {
      // Verificar se o produto já está no carrinho
      const existingItemIndex = prevItems.findIndex(item => item.id === produto.id);
      
      if (existingItemIndex >= 0) {
        // Se já existe, atualizar a quantidade
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantidade: updatedItems[existingItemIndex].quantidade + quantidade
        };
        return updatedItems;
      } else {
        // Se não existe, adicionar novo item
        return [...prevItems, {
          id: produto.id,
          nome: produto.nome,
          preco: produto.preco,
          imagem: produto.imagem,
          quantidade
        }];
      }
    });
  };

  // Remover item do carrinho
  const removeFromCart = (produtoId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== produtoId));
  };

  // Atualizar quantidade de um item
  const updateQuantity = (produtoId, quantidade) => {
    if (quantidade <= 0) {
      removeFromCart(produtoId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === produtoId ? { ...item, quantidade } : item
      )
    );
  };

  // Limpar carrinho
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const value = {
    cartItems,
    total,
    count,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
