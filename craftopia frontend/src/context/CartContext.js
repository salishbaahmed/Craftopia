import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState([]);
    const [cartCount, setCartCount] = useState(0);

    // Load cart when user changes
    useEffect(() => {
        if (user) {
            // TODO: Implement backend cart fetching
            // For now, we'll stick to localStorage or implement a simple backend sync later
            // const fetchCart = async () => { ... }
            // fetchCart();
        } else {
            // Load from localStorage for guest
            const savedCart = JSON.parse(localStorage.getItem('craftopiaCart') || '[]');
            setCart(savedCart);
            updateCount(savedCart);
        }
    }, [user]);

    const updateCount = (items) => {
        const count = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
        setCartCount(count);
    };

    const addToCart = (product, quantity = 1) => {
        let newCart = [...cart];
        const existingItemIndex = newCart.findIndex(item => item.id === product.id);

        if (existingItemIndex > -1) {
            newCart[existingItemIndex].quantity += quantity;
        } else {
            newCart.push({ ...product, quantity });
        }

        setCart(newCart);
        updateCount(newCart);
        localStorage.setItem('craftopiaCart', JSON.stringify(newCart));

        // TODO: Sync with backend if logged in
    };

    const removeFromCart = (productId) => {
        const newCart = cart.filter(item => item.id !== productId);
        setCart(newCart);
        updateCount(newCart);
        localStorage.setItem('craftopiaCart', JSON.stringify(newCart));
    };

    const clearCart = () => {
        setCart([]);
        setCartCount(0);
        localStorage.removeItem('craftopiaCart');
    };

    return (
        <CartContext.Provider value={{ cart, cartCount, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
