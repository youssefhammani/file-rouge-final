// src/components/jobs/JobDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getJobById, saveJob, unsaveJob, deleteJob } from '../../services/jobService';
import ApplicationForm from '../applications/ApplicationForm';


const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const [savingJob, setSavingJob] = useState(false);
    const [showApplicationForm, setShowApplicationForm] = useState(false);

    useEffect(() => {
        const fetchJobDetails = async () => {
            setLoading(true);
            try {
                const response = await getJobById(id);
                setJob(response.data);

                // Check if job is saved by user (if applicable)
                if (isAuthenticated && user.role === 'candidate') {
                    const savedJobs = await getSavedJobs();
                    const isJobSaved = savedJobs.data.some(savedJob => savedJob._id === id);
                    setIsSaved(isJobSaved);
                }
            } catch (error) {
                console.error('Error fetching job details:', error);
                setError('Failed to load job details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetails();
    }, [id, isAuthenticated, user]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleSaveToggle = async () => {
        if (!isAuthenticated || user.role !== 'candidate') return;

        setSavingJob(true);
        try {
            if (isSaved) {
                await unsaveJob(id);
                setIsSaved(false);
            } else {
                await saveJob(id);
                setIsSaved(true);
            }
        } catch (error) {
            console.error('Error toggling job save:', error);
        } finally {
            setSavingJob(false);
        }
    };

    const handleDeleteJob = async () => {
        if (!window.confirm('Are you sure you want to delete this job posting?')) {
            return;
        }

        try {
            await deleteJob(id);
            navigate('/my-jobs');
        } catch (error) {
            console.error('Error deleting job:', error);
            setError('Failed to delete job. Please try again later.');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
            </div>
        );
    }

    if (!job) {
        return (
            <div className="text-center py-8">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Job not found</h3>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-6 mb-6">
                    <div className="flex items-start mb-4 md:mb-0">
                        {job.companyId?.logo ? (
                            <img
                                src={job.companyId.logo}
                                alt={job.companyId?.companyName || 'Company'}
                                className="w-16 h-16 rounded object-cover mr-4"
                            />
                        ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center mr-4">
                                <span className="text-gray-500 text-xl">{job.companyId?.companyName?.charAt(0) || 'C'}</span>
                            </div>
                        )}
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                            <p className="text-lg text-gray-600">{job.companyId?.companyName}</p>
                            <p className="text-gray-500">{job.location}</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {isAuthenticated && user.role === 'candidate' && (
                            <>
                                <button
                                    onClick={handleSaveToggle}
                                    disabled={savingJob}
                                    className={`flex items-center px-4 py-2 rounded-md ${isSaved
                                            ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {isSaved ? (
                                        <>
                                            <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            Saved
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                                />
                                            </svg>
                                            Save
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={() => setShowApplicationForm(true)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                >
                                    Apply Now
                                </button>
                            </>
                        )}

                        {isAuthenticated &&
                            (user.role === 'company' && job.companyId?._id === user.id) && (
                                <>
                                    <button
                                        onClick={() => navigate(`/edit-job/${job._id}`)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                    >
                                        Edit Job
                                    </button>

                                    <button
                                        onClick={handleDeleteJob}
                                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                                    >
                                        Delete Job
                                    </button>
                                </>
                            )}
                    </div>
                </div>

                {/* Job Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="col-span-2">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-3">Job Description</h2>
                            <div className="prose text-gray-700 whitespace-pre-line">
                                {job.description}
                            </div>
                        </div>

                        {job.requiredSkills?.length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold mb-3">Required Skills</h2>
                                <div className="flex flex-wrap gap-2">
                                    {job.requiredSkills.map(skill => (
                                        <span
                                            key={skill}
                                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h2 className="text-lg font-semibold mb-4">Job Details</h2>

                            <div className="space-y-3">
                                <div>
                                    <p className="text-gray-500 text-sm">Job Type</p>
                                    <p className="font-medium">{job.jobType}</p>
                                </div>

                                {job.salary && (
                                    <div>
                                        <p className="text-gray-500 text-sm">Salary</p>
                                        <p className="font-medium">${job.salary.toLocaleString()} / year</p>
                                    </div>
                                )}

                                <div>
                                    <p className="text-gray-500 text-sm">Posted Date</p>
                                    <p className="font-medium">{formatDate(job.postedDate)}</p>
                                </div>

                                {job.deadlineDate && (
                                    <div>
                                        <p className="text-gray-500 text-sm">Application Deadline</p>
                                        <p className="font-medium">{formatDate(job.deadlineDate)}</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 pt-6 border-t">
                                <h3 className="text-lg font-semibold mb-3">About the Company</h3>

                                <div className="space-y-3">
                                    <p className="text-gray-700">{job.companyId?.description || 'No description available.'}</p>

                                    {job.companyId?.website && (
                                        <div>
                                            <p className="text-gray-500 text-sm">Website</p>
                                            <a
                                                href={job.companyId.website.startsWith('http') ? job.companyId.website : `https://${job.companyId.website}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                {job.companyId.website}
                                            </a>
                                        </div>
                                    )}

                                    <div>
                                        <p className="text-gray-500 text-sm">Location</p>
                                        <p className="font-medium">{job.companyId?.location || job.location}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Application Form Modal */}
            {showApplicationForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Apply for {job.title}</h2>
                                <button
                                    onClick={() => setShowApplicationForm(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>

                            <ApplicationForm
                                jobId={job._id}
                                onSuccess={() => {
                                    setShowApplicationForm(false);
                                    navigate('/applications');
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobDetails;
