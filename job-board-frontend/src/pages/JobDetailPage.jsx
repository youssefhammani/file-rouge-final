// src/pages/JobDetailPage.jsx
import { useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import JobDetails from '../components/jobs/JobDetails';

const JobDetailPage = () => {
    const { id } = useParams();

    return (
        <Layout>
            <JobDetails id={id} />
        </Layout>
    );
};

export default JobDetailPage;
