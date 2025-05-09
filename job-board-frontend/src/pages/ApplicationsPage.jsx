// src/pages/ApplicationsPage.jsx
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ApplicationList from '../components/applications/ApplicationList';
import { useAuth } from '../hooks/useAuth';
import { getCompanyJobs } from '../services/jobService';

const ApplicationsPage = () => {
    const { isAuthenticated, user } = useAuth();
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [companyJobs, setCompanyJobs] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // If user is a company, fetch their jobs
        if (isAuthenticated && user?.role === 'company') {
            const fetchCompanyJobs = async () => {
                setLoading(true);
                try {
                    const response = await getCompanyJobs();
                    setCompanyJobs(response.data);
                    // Set the first job as default selected if available
                    if (response.data.length > 0 && !selectedJobId) {
                        setSelectedJobId(response.data[0]._id);
                    }
                } catch (error) {
                    console.error('Error fetching company jobs:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchCompanyJobs();
        }
    }, [isAuthenticated, user, selectedJobId]);

    // Redirect if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return (
        <Layout>
            <div className="container mx-auto py-8 px-4">
                <h1 className="text-3xl font-bold mb-8">
                    {user?.role === 'candidate' ? 'My Applications' : 'Job Applications'}
                </h1>

                {user?.role === 'company' && (
                    <div className="mb-8">
                        {loading ? (
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                                <span>Loading jobs...</span>
                            </div>
                        ) : companyJobs.length === 0 ? (
                            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                                <p>You haven't posted any jobs yet.</p>
                                <a href="/post-job" className="text-blue-600 underline">Post your first job</a>
                            </div>
                        ) : (
                            <div>
                                <label htmlFor="jobSelect" className="block text-gray-700 font-medium mb-2">
                                    Select Job to View Applications
                                </label>
                                <select
                                    id="jobSelect"
                                    value={selectedJobId || ''}
                                    onChange={(e) => setSelectedJobId(e.target.value)}
                                    className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {companyJobs.map((job) => (
                                        <option key={job._id} value={job._id}>
                                            {job.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                )}

                {/* For candidates, show all their applications */}
                {user?.role === 'candidate' && (
                    <ApplicationList />
                )}

                {/* For companies, show applications for the selected job */}
                {user?.role === 'company' && selectedJobId && (
                    <ApplicationList jobId={selectedJobId} />
                )}
            </div>
        </Layout>
    );
};

export default ApplicationsPage;
