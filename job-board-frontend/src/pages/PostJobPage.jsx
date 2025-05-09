// src/pages/PostJobPage.jsx
import Layout from '../components/layout/Layout';
import JobForm from '../components/jobs/JobForm';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const PostJobPage = () => {
    const { isAuthenticated, user } = useAuth();

    // Redirect if not authenticated or not a company
    if (!isAuthenticated || (user && user.role !== 'company')) {
        return <Navigate to="/" />;
    }

    return (
        <Layout>
            <div className="container mx-auto py-8 px-4">
                <JobForm />
            </div>
        </Layout>
    );
};

export default PostJobPage;
