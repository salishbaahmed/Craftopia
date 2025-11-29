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
        const loadCart = () => {
            const savedCart = JSON.parse(localStorage.getItem('craftopiaCart') || '[]');
            setCart(savedCart);
            updateCount(savedCart);
        };

        if (user) {
            // Load cart for logged-in user
            loadCart();
        } else {
            // Load from localStorage for guest
            loadCart();
        }
    }, [user]);

    // Listen for cart updates from other components
    useEffect(() => {
        const handleCartUpdate = () => {
            const savedCart = JSON.parse(localStorage.getItem('craftopiaCart') || '[]');
            setCart(savedCart);
            updateCount(savedCart);
        };

        // Listen for the cartUpdated event
        window.addEventListener('cartUpdated', handleCartUpdate);

        // Also listen for storage events (for cross-tab updates)
        window.addEventListener('storage', handleCartUpdate);

        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
            window.removeEventListener('storage', handleCartUpdate);
        };
    }, []);

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
