// src/components/routing/CompanyRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/auth/AuthContext';
import Spinner from '../layout/Spinner';

const CompanyRoute = ({ children }) => {
    const { isAuthenticated, user, loading } = useContext(AuthContext);

    if (loading) return <Spinner />;

    if (!isAuthenticated) return <Navigate to="/login" />;

    return user && user.role === 'company' ? children : <Navigate to="/" />;
};

export default CompanyRoute;
