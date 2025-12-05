import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await api.get('/auth/me');
                    setUser(response.data);
                } catch (error) {
                    console.error('Auth check failed:', error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email, password, role = 'user') => {
        const response = await api.post('/auth/login', { email, password, role });
        const { access_token, role: userRole } = response.data;
        localStorage.setItem('token', access_token);

        // Fetch user details immediately after login
        const meResponse = await api.get('/auth/me');
        setUser({ ...meResponse.data, role: userRole });
        return meResponse.data;
    };

    const register = async (userData) => {
        const response = await api.post('/auth/register', userData);
        const { access_token } = response.data;
        localStorage.setItem('token', access_token);

        const meResponse = await api.get('/auth/me');
        setUser(meResponse.data);
        return meResponse.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
