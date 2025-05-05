// src/context/auth/AuthContext.js
import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import authReducer from './authReducer';
import setAuthToken from '../../utils/setAuthToken';

// Initial state
const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    user: null,
    loading: true,
    error: null,
};

// Create context
export const AuthContext = createContext(initialState);

// Provider component
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Load user
    useEffect(() => {
        const loadUser = async () => {
            if (localStorage.token) {
                setAuthToken(localStorage.token);
            }

            try {
                const res = await axios.get('/api/auth/me');
                dispatch({
                    type: 'USER_LOADED',
                    payload: res.data.user,
                });
            } catch (err) {
                dispatch({ type: 'AUTH_ERROR' });
            }
        };

        loadUser();
    }, []);

    // Register user
    const register = async (formData) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        try {
            const res = await axios.post('/api/auth/register', formData, config);
            dispatch({
                type: 'REGISTER_SUCCESS',
                payload: res.data,
            });

            loadUser();
        } catch (err) {
            dispatch({
                type: 'REGISTER_FAIL',
                payload: err.response.data.message,
            });
            throw err;
        }
    };

    // Login user
    const login = async (formData) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        try {
            const res = await axios.post('/api/auth/login', formData, config);
            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: res.data,
            });

            loadUser();
        } catch (err) {
            dispatch({
                type: 'LOGIN_FAIL',
                payload: err.response.data.message,
            });
            throw err;
        }
    };

    // Logout
    const logout = () => {
        dispatch({ type: 'LOGOUT' });
    };

    // Update profile
    const updateProfile = async (formData) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        try {
            const res = await axios.put('/api/users/profile', formData, config);
            dispatch({
                type: 'UPDATE_PROFILE_SUCCESS',
                payload: res.data.data,
            });
            return res.data.data;
        } catch (err) {
            dispatch({
                type: 'UPDATE_PROFILE_FAIL',
                payload: err.response.data.message,
            });
            throw err;
        }
    };

    // Clear errors
    const clearErrors = () => {
        dispatch({ type: 'CLEAR_ERRORS' });
    };

    // Load user function for use after actions
    const loadUser = async () => {
        if (localStorage.token) {
            setAuthToken(localStorage.token);
        }

        try {
            const res = await axios.get('/api/auth/me');
            dispatch({
                type: 'USER_LOADED',
                payload: res.data.user,
            });
        } catch (err) {
            dispatch({ type: 'AUTH_ERROR' });
        }
    };

    return (
        <AuthContext.Provider
            value={{
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                user: state.user,
                loading: state.loading,
                error: state.error,
                register,
                login,
                logout,
                updateProfile,
                clearErrors,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
