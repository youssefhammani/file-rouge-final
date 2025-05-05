// src/pages/JobDetailsPage.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/auth/AuthContext';
import Spinner from '../components/layout/Spinner';
import JobApplicationForm from '../components/applications/JobApplicationForm';

const JobDetailsPage = () => {
    const { id } = useParams();
    const { isAuthenticated, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [alreadyApplied, setAlreadyApplied] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await axios.get(`/api/jobs/${id}`);
                setJob(res.data.data);

                // Check if current user has applied
                if (isAuthenticated && user.role === 'candidate' && res.data.data.applications) {
                    const applied = res.data.data.applications.some(
                        app => app.candidateId._id === user._id
                    );
                    setAlreadyApplied(applied);
                }
            } catch (err) {
                setError('Error fetching job details.');
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [id, isAuthenticated, user]);

    const handleSaveJob = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to save jobs');
            return;
        }

        try {
            await axios.post(`/api/users/jobs/${id}/save`);
            toast.success('Job saved successfully');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error saving job');
        }
    };

    const handleApply = () => {
        if (!isAuthenticated) {
            toast.error('Please login to apply for jobs');
            navigate('/login');
            return;
        }

        setShowApplicationForm(true);
    };

    if (loading) return <Spinner />;

    if (error || !job) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
                    {error || 'Job not found'}
                </div>
                <Link to="/jobs" className="text-blue-600 hover:underline">
                    &larr; Back to Jobs
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Link to="/jobs" className="text-blue-600 hover:underline mb-4 inline-block">
                &larr; Back to Jobs
            </Link>

            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                    <div className="flex">
                        {job.companyId.logo ? (
                            <img
                                src={job.companyId.logo}
                                alt={job.companyId.companyName}
                                className="w-20 h-20 object-contain mr-6"
                            />
                        ) : (
                            <div className="w-20 h-20 bg-gray-200 flex items-center justify-center text-gray-500 mr-6 rounded">
                                {job.companyId.companyName?.charAt(0) || 'C'}
                            </div>
                        )}
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                            <div className="text-lg text-gray-600">{job.companyId.companyName}</div>
                            <div className="text-gray-500 mt-1">{job.location}</div>
                            <div className="mt-2 flex space-x-2">
                                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                    {job.jobType.replace('-', ' ')}
                                </span>
                                {job.salary && (
                                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                        ${job.salary.toLocaleString('en-US')}/year
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-gray-500 text-sm">
                            Posted on {format(new Date(job.postedDate), 'MMM d, yyyy')}
                        </div>
                        {job.deadlineDate && (
                            <div className="text-red-500 text-sm mt-1">
                                Apply before {format(new Date(job.deadlineDate), 'MMM d, yyyy')}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Job Description</h2>
                    <div className="prose max-w-none">
                        {job.description.split('\n').map((paragraph, index) => (
                            <p key={index} className="mb-4">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </div>

                {job.requiredSkills && job.requiredSkills.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold mb-4">Required Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {job.requiredSkills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">About the Company</h2>
                    <p className="text-gray-700">{job.companyId.description || 'No company description available.'}</p>
                    {job.companyId.website && (
                        <div className="mt-2">
                            <a
                                href={job.companyId.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                Company Website
                            </a>
                        </div>
                    )}
                </div>

                {isAuthenticated && user.role === 'candidate' && (
                    <div className="mt-8 flex space-x-4">
                        {alreadyApplied ? (
                            <div className="bg-gray-100 text-gray-700 px-6 py-3 rounded font-medium">
                                You have already applied for this job
                            </div>
                        ) : (
                            <button
                                onClick={handleApply}
                                className="bg-blue-600 text-white px-6 py-3 rounded font-medium hover:bg-blue-700"
                            >
                                Apply Now
                            </button>
                        )}
                        <button
                            onClick={handleSaveJob}
                            className="border border-gray-300 text-gray-700 px-6 py-3 rounded font-medium hover:bg-gray-50 flex items-center"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                                />
                            </svg>
                            Save Job
                        </button>
                    </div>
                )}

                {isAuthenticated && user.role === 'company' && user._id === job.companyId._id && (
                    <div className="mt-8 flex space-x-4">
                        <Link
                            to={`/company/jobs/edit/${job._id}`}
                            className="bg-blue-600 text-white px-6 py-3 rounded font-medium hover:bg-blue-700"
                        >
                            Edit Job
                        </Link>
                        <Link
                            to={`/company/jobs/${job._id}/applications`}
                            className="border border-gray-300 text-gray-700 px-6 py-3 rounded font-medium hover:bg-gray-50"
                        >
                            View Applications
                        </Link>
                    </div>
                )}
            </div>

            {showApplicationForm && (
                <div className="mt-8">
                    <JobApplicationForm jobId={job._id} onSuccess={() => navigate('/my-applications')} />
                </div>
            )}
        </div>
    );
};

export default JobDetailsPage;
