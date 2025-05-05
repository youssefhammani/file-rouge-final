// src/pages/SavedJobsPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const SavedJobsPage = () => {
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSavedJobs();
    }, []);

    const fetchSavedJobs = async () => {
        try {
            const res = await axios.get('/api/users/saved-jobs');
            setSavedJobs(res.data.data);
        } catch (err) {
            setError('Error fetching saved jobs');
            toast.error('Failed to load saved jobs');
        } finally {
            setLoading(false);
        }
    };

    const handleUnsaveJob = async (jobId) => {
        try {
            await axios.delete(`/api/users/jobs/${jobId}/unsave`);
            setSavedJobs(savedJobs.filter(job => job._id !== jobId));
            toast.success('Job removed from saved jobs');
        } catch (err) {
            toast.error('Error removing job from saved jobs');
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
            <h1 className="text-2xl font-bold mb-6">Saved Jobs</h1>

            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
                    {error}
                </div>
            )}

            {savedJobs.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                    <p className="text-gray-500 mb-4">You haven't saved any jobs yet.</p>
                    <Link
                        to="/jobs"
                        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Browse Jobs
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {savedJobs.map(job => (
                        <div key={job._id} className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex justify-between">
                                <div className="flex">
                                    {job.companyId.logo ? (
                                        <img
                                            src={job.companyId.logo}
                                            alt={job.companyId.companyName}
                                            className="w-16 h-16 object-contain mr-4"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 bg-gray-200 flex items-center justify-center text-gray-500 mr-4 rounded">
                                            {job.companyId.companyName?.charAt(0) || 'C'}
                                        </div>
                                    )}
                                    <div>
                                        <Link to={`/jobs/${job._id}`} className="text-xl font-semibold text-blue-600 hover:underline">
                                            {job.title}
                                        </Link>
                                        <div className="text-gray-600">{job.companyId.companyName}</div>
                                        <div className="text-gray-500 mt-2">{job.location}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                        {job.jobType.replace('-', ' ')}
                                    </div>
                                    {job.salary && (
                                        <div className="mt-2 font-medium">
                                            ${job.salary.toLocaleString('en-US')}/year
                                        </div>
                                    )}
                                    <div className="text-gray-500 text-sm mt-2">
                                        Posted {format(new Date(job.postedDate), 'MMM d, yyyy')}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex justify-between">
                                <Link
                                    to={`/jobs/${job._id}`}
                                    className="inline-flex items-center text-blue-600 hover:underline"
                                >
                                    View Details
                                </Link>

                                <button
                                    onClick={() => handleUnsaveJob(job._id)}
                                    className="text-red-500 hover:text-red-700 flex items-center"
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
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                    Unsave
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SavedJobsPage;
