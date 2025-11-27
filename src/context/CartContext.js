'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  
  const [discount, setDiscount] = useState(0); 
  const [couponCode, setCouponCode] = useState(''); 

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetch(`http://localhost:5000/cart/${parsedUser.id}`)
        .then(res => res.json())
        .then(serverCart => {
            const localCart = JSON.parse(localStorage.getItem('novaCart') || '[]');
            if (serverCart.length === 0 && localCart.length > 0) {
                setCart(localCart);
            } else {
                setCart(serverCart);
            }
        })
        .catch(console.error);
    } else {
      const savedCart = localStorage.getItem('novaCart');
      if (savedCart) setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('novaCart', JSON.stringify(cart));
    // Синхронизацию с сервером пока оставим простой, чтобы не усложнять SQL для цветов
  }, [cart, user]);

  // 1. ДОБАВЛЕНИЕ (Учитывает цвет)
  const addToCart = (product) => {
    setCart((prev) => {
      const color = product.selectedColor || 'Default';
      const existing = prev.find((item) => item.id === product.id && item.selectedColor === color);
      
      if (existing) {
        return prev.map((item) =>
          (item.id === product.id && item.selectedColor === color)
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, selectedColor: color, quantity: 1 }];
    });
  };

  // 2. УДАЛЕНИЕ (Учитывает цвет)
  const removeFromCart = (id, color) => {
    setCart((prev) => prev.filter((item) => !(item.id === id && item.selectedColor === color)));
  };

  // 3. ИЗМЕНЕНИЕ КОЛИЧЕСТВА (Учитывает цвет)
  const updateQuantity = (id, color, amount) => {
    setCart((prev) => {
      return prev.map((item) => {
        if (item.id === id && item.selectedColor === color) {
          const newQuantity = Math.max(1, item.quantity + amount);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  const applyCoupon = (code, percent) => {
    setCouponCode(code);
    setDiscount(percent);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const rawTotal = cart.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
  const discountAmount = (rawTotal * discount) / 100;
  const totalPrice = rawTotal - discountAmount;

  return (
    <CartContext.Provider value={{ 
        cart, addToCart, removeFromCart, updateQuantity, cartCount, 
        totalPrice, rawTotal, discount, discountAmount, couponCode, applyCoupon 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}