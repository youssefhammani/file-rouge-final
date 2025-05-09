// src/pages/LoginPage.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Login from '../components/auth/Login';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    return (
        <Layout>
            <div className="container mx-auto py-12 px-4">
                <Login />
            </div>
        </Layout>
    );
};

export default LoginPage;
