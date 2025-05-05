// src/utils/axiosConfig.js
import axios from 'axios';

// Base URL without /api suffix
const API_BASE = import.meta.env?.VITE_API_URL ||
    (typeof window !== 'undefined' && window.env?.API_URL) ||
    (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) ||
    'http://localhost:5000';

// Remove trailing slashes and /api suffix if present
let normalizedBase = API_BASE;
if (normalizedBase.endsWith('/')) {
    normalizedBase = normalizedBase.slice(0, -1);
}

// Set the baseURL without /api suffix
axios.defaults.baseURL = normalizedBase;

// Log the base URL to help debugging
console.log('API base URL:', axios.defaults.baseURL);

// Content type
axios.defaults.headers.post['Content-Type'] = 'application/json';

// Add request interceptor to handle /api prefix intelligently
axios.interceptors.request.use(
    (config) => {
        // If URL doesn't start with /api, add it
        if (!config.url.startsWith('/api')) {
            config.url = `/api${config.url}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercept responses to handle common errors
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        // Log the error for debugging
        console.error('API Error:', error.config?.url, error.message);

        const { status } = error.response || {};

        // Handle authentication errors
        if (status === 401) {
            // Clear token from localStorage
            localStorage.removeItem('token');

            // Redirect to login if not already on login or register page
            const pathname = window.location.pathname;
            if (pathname !== '/login' && pathname !== '/register') {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default axios;
