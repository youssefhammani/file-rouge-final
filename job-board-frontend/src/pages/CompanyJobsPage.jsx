// src/pages/CompanyJobsPage.jsx
import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useAuth } from '../hooks/useAuth';
import { getCompanyJobs, deleteJob } from '../services/jobService';

const CompanyJobsPage = () => {
    const { isAuthenticated, user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isAuthenticated && user?.role === 'company') {
            fetchCompanyJobs();
        }
    }, [isAuthenticated, user]);

    const fetchCompanyJobs = async () => {
        setLoading(true);
        try {
            const response = await getCompanyJobs();
            setJobs(response.data);
        } catch (error) {
            console.error('Error fetching company jobs:', error);
            setError('Failed to load your jobs. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteJob = async (id) => {
        if (!window.confirm('Are you sure you want to delete this job posting?')) {
            return;
        }

        try {
            await deleteJob(id);
            // Remove the deleted job from the list
            setJobs(prev => prev.filter(job => job._id !== id));
        } catch (error) {
            console.error('Error deleting job:', error);
            setError('Failed to delete job. Please try again later.');
        }
    };

    // Format date string
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Redirect if not authenticated or not a company
    if (!isAuthenticated || (user && user.role !== 'company')) {
        return <Navigate to="/" />;
    }

    return (
        <Layout>
            <div className="container mx-auto py-8 px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">My Job Postings</h1>
                    <Link
                        to="/post-job"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                        Post New Job
                    </Link>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-md">
                        <h3 className="text-xl font-medium text-gray-700 mb-2">No job postings yet</h3>
                        <p className="text-gray-500 mb-6">Start hiring by creating your first job posting.</p>
                        <Link
                            to="/post-job"
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            Post a Job
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-lg shadow-md">
                            <thead>
                                <tr className="bg-gray-100 border-b">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applications</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {jobs.map((job) => (
                                    <tr key={job._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Link to={`/jobs/${job._id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                                                {job.title}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">{job.location}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                                {job.jobType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                            {formatDate(job.postedDate)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 py-1 text-xs rounded-full ${job.isActive
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                    }`}
                                            >
                                                {job.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Link
                                                to={`/applications?jobId=${job._id}`}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                View Applications
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <Link
                                                    to={`/edit-job/${job._id}`}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteJob(job._id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default CompanyJobsPage;
