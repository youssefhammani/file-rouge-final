// src/components/routing/CandidateRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/auth/AuthContext';
import Spinner from '../layout/Spinner';

const CandidateRoute = ({ children }) => {
    const { isAuthenticated, user, loading } = useContext(AuthContext);

    if (loading) return <Spinner />;

    if (!isAuthenticated) return <Navigate to="/login" />;

    return user && user.role === 'candidate' ? children : <Navigate to="/" />;
};

export default CandidateRoute;
