// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import { getLocalUser, login as loginService, logout as logoutService, register as registerService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(getLocalUser());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check if user is already logged in on app startup
        const localUser = getLocalUser();
        if (localUser) {
            setUser(localUser);
        }
    }, []);

    const login = async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            const data = await loginService(credentials);
            setUser(data.user);
            setLoading(false);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
            setLoading(false);
            throw err;
        }
    };

    const register = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const data = await registerService(userData);
            setUser(data.user);
            setLoading(false);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
            setLoading(false);
            throw err;
        }
    };

    const logout = () => {
        logoutService();
        setUser(null);
    };

    const updateUserData = (newUserData) => {
        const updatedUser = { ...user, ...newUserData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                error,
                isAuthenticated: !!user,
                login,
                register,
                logout,
                updateUserData,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
