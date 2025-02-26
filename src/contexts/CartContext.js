import React, { createContext, useState, useEffect } from 'react';

// สร้าง Context
export const CartContext = createContext();

// สร้าง CartProvider
export const CartProvider = ({ children }) => {
  // โหลดข้อมูลจาก localStorage หรือใช้ค่าเริ่มต้นเป็นอาร์เรย์ว่าง
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // ใช้ useEffect เพื่ออัปเดตข้อมูลใน localStorage เมื่อ cart เปลี่ยนแปลง
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    const productInCart = cart.find(item => item.id === product.id);
    const quantityToAdd = product.quantity || 1; // ใช้ค่า 1 ถ้า quantity ไม่มีการกำหนด
    if (productInCart) {
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + quantityToAdd } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: quantityToAdd }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const increaseQuantity = (productId) => {
    setCart(cart.map(item =>
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const decreaseQuantity = (productId) => {
    setCart(cart.map(item =>
      item.id === productId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, increaseQuantity, decreaseQuantity }}>
      {children}
    </CartContext.Provider>
  );
};
