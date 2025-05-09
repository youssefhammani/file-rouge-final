// src/pages/RegisterPage.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Register from '../components/auth/Register';
import { useAuth } from '../hooks/useAuth';

const RegisterPage = () => {
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
                <Register />
            </div>
        </Layout>
    );
};

export default RegisterPage;
