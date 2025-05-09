// src/services/authService.js
import api from './api';

export const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

export const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);

    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;
};

export const getCurrentUser = async () => {
    const response = await api.get('/auth/me');
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const getLocalUser = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        return JSON.parse(userStr);
    }
    return null;
};

export const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
};