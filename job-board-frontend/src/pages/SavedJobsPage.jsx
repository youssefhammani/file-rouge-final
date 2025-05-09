// src/pages/SavedJobsPage.jsx
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import SavedJobs from '../components/jobs/SavedJobs';
import { useAuth } from '../hooks/useAuth';

const SavedJobsPage = () => {
    const { isAuthenticated, user } = useAuth();

    // Redirect if not authenticated or not a candidate
    if (!isAuthenticated || (user && user.role !== 'candidate')) {
        return <Navigate to="/" />;
    }

    return (
        <Layout>
            <div className="container mx-auto py-8 px-4">
                <h1 className="text-3xl font-bold mb-8">Saved Jobs</h1>
                <SavedJobs />
            </div>
        </Layout>
    );
};

export default SavedJobsPage;
