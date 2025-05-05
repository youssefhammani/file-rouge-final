// src/pages/CompanyDashboardPage.js
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/auth/AuthContext';

const CompanyDashboardPage = () => {
    const { user } = useContext(AuthContext);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [jobStats, setJobStats] = useState({
        totalJobs: 0,
        activeJobs: 0,
        totalApplications: 0,
    });

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/jobs/company/myjobs');

            setJobs(res.data.data);

            // Calculate stats
            const activeJobs = res.data.data.filter(job => job.isActive).length;
            const totalApplications = res.data.data.reduce(
                (acc, job) => acc + (job.applications?.length || 0),
                0
            );

            setJobStats({
                totalJobs: res.data.data.length,
                activeJobs,
                totalApplications,
            });
        } catch (err) {
            setError('Error fetching jobs');
            toast.error('Failed to load your jobs');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteJob = async (jobId) => {
        if (!window.confirm('Are you sure you want to delete this job?')) {
            return;
        }

        try {
            await axios.delete(`/api/jobs/${jobId}`);
            toast.success('Job deleted successfully');
            fetchJobs(); // Refresh jobs list
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error deleting job');
        }
    };

    const handleToggleJobStatus = async (jobId, currentStatus) => {
        try {
            await axios.put(`/api/jobs/${jobId}`, {
                isActive: !currentStatus,
            });
            toast.success(`Job ${currentStatus ? 'deactivated' : 'activated'} successfully`);
            fetchJobs(); // Refresh jobs list
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error updating job status');
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Company Dashboard</h1>
                <Link
                    to="/company/jobs/post"
                    className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700"
                >
                    Post New Job
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                    <h2 className="text-gray-500 text-sm font-medium">Total Jobs</h2>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{jobStats.totalJobs}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
                    <h2 className="text-gray-500 text-sm font-medium">Active Jobs</h2>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{jobStats.activeJobs}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
                    <h2 className="text-gray-500 text-sm font-medium">Total Applications</h2>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{jobStats.totalApplications}</p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold">Your Job Listings</h2>
                </div>

                {error && (
                    <div className="bg-red-100 text-red-700 p-4">
                        {error}
                    </div>
                )}

                {jobs.length === 0 ? (
                    <div className="px-6 py-8 text-center">
                        <p className="text-gray-500">You haven't posted any jobs yet.</p>
                        <Link
                            to="/company/jobs/post"
                            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700"
                        >
                            Post Your First Job
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Job Title
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Location
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Posted Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Applications
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {jobs.map((job) => (
                                    <tr key={job._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Link to={`/jobs/${job._id}`} className="text-blue-600 hover:underline font-medium">
                                                {job.title}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {job.location}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {format(new Date(job.postedDate), 'MMM d, yyyy')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Link to={`/company/jobs/${job._id}/applications`} className="text-blue-600 hover:underline">
                                                {job.applications?.length || 0} applications
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${job.isActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {job.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <Link to={`/company/jobs/edit/${job._id}`} className="text-blue-600 hover:text-blue-900">
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleToggleJobStatus(job._id, job.isActive)}
                                                    className={`${job.isActive ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'
                                                        }`}
                                                >
                                                    {job.isActive ? 'Deactivate' : 'Activate'}
                                                </button>
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
        </div>
    );
};

export default CompanyDashboardPage;
