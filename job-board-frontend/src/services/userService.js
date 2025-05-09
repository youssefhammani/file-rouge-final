// src/services/userService.js
import api from './api';

export const updateProfile = async (userData) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
};