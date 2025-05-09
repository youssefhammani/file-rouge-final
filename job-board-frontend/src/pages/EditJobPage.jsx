// src/pages/EditJobPage.jsx
import { useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import JobForm from '../components/jobs/JobForm';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const EditJobPage = () => {
    const { id } = useParams();
    const { isAuthenticated, user } = useAuth();

    // Redirect if not authenticated or not a company
    if (!isAuthenticated || (user && user.role !== 'company')) {
        return <Navigate to="/" />;
    }

    return (
        <Layout>
            <div className="container mx-auto py-8 px-4">
                <JobForm id={id} />
            </div>
        </Layout>
    );
};

export default EditJobPage;
