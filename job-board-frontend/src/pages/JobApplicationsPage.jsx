// src/pages/JobApplicationsPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const JobApplicationsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get job details
                const jobRes = await axios.get(`/api/jobs/${id}`);
                setJob(jobRes.data.data);

                // Get applications
                const appRes = await axios.get(`/api/applications/jobs/${id}`);
                setApplications(appRes.data.data);
            } catch (err) {
                setError('Error fetching applications');
                toast.error('Failed to load applications');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleStatusChange = async (applicationId, newStatus) => {
        try {
            await axios.put(`/api/applications/${applicationId}/status`, {
                status: newStatus,
            });

            // Update application status in the state
            setApplications(
                applications.map((app) =>
                    app._id === applicationId ? { ...app, status: newStatus } : app
                )
            );

            toast.success('Application status updated');
        } catch (err) {
            toast.error('Error updating application status');
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

    if (error || !job) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
                    {error || 'Job not found'}
                </div>
                <button
                    onClick={() => navigate('/company/dashboard')}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Link
                    to="/company/dashboard"
                    className="text-blue-600 hover:underline inline-flex items-center"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    Back to Dashboard
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h1 className="text-2xl font-bold mb-2">Applications for: {job.title}</h1>
                <div className="text-gray-600 mb-4">
                    <span className="mr-4">Location: {job.location}</span>
                    <span>Job Type: {job.jobType.replace('-', ' ')}</span>
                </div>
                <Link
                    to={`/jobs/${id}`}
                    className="text-blue-600 hover:underline"
                >
                    View Job Post
                </Link>
            </div>

            {applications.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                    <p className="text-gray-500">No applications received yet.</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold">
                            {applications.length} Applications
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Candidate
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Applied On
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Resume
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
                                {applications.map((application) => (
                                    <tr key={application._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {application.candidateId.profilePicture ? (
                                                    <img
                                                        src={application.candidateId.profilePicture}
                                                        alt={application.candidateId.name}
                                                        className="h-10 w-10 rounded-full object-cover mr-3"
                                                    />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                                        <span className="text-blue-800 font-medium">
                                                            {application.candidateId.name.charAt(0)}
                                                        </span>
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {application.candidateId.name}
                                                    </div>
                                                    <div className="text-gray-500 text-sm">
                                                        {application.candidateId.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {format(new Date(application.appliedDate), 'MMM d, yyyy')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <a
                                                href={application.resumeLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                View Resume
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${application.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : application.status === 'reviewed'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : application.status === 'accepted'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                }`}>
                                                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={application.status}
                                                onChange={(e) => handleStatusChange(application._id, e.target.value)}
                                                className="p-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="reviewed">Reviewed</option>
                                                <option value="accepted">Accepted</option>
                                                <option value="rejected">Rejected</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobApplicationsPage;
