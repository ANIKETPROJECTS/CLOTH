import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types/Product';

export interface CartItem {
  id: string;
  product: Product;
  size: string;
  quantity: number;
  addedAt: Date;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, size: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isInCart: (productId: string, size: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt)
        })));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, size: string, quantity: number) => {
    const existingItemIndex = cartItems.findIndex(
      item => item.product._id === product._id && item.size === size
    );

    if (existingItemIndex >= 0) {
      // Update quantity if item already exists
      setCartItems(prev => 
        prev.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      // Add new item
      const newItem: CartItem = {
        id: `${product._id}-${size}-${Date.now()}`,
        product,
        size,
        quantity,
        addedAt: new Date()
      };
      setCartItems(prev => [...prev, newItem]);
    }
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalItems = () => {
    return cartItems.length;
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const isInCart = (productId: string, size: string) => {
    return cartItems.some(item => item.product._id === productId && item.size === size);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice,
      isInCart
    }}>
      {children}
    </CartContext.Provider>
  );
};