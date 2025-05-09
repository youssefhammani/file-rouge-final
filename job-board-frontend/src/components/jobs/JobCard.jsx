// src/components/jobs/JobCard.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { saveJob, unsaveJob } from '../../services/jobService';

const JobCard = ({ job, isSaved, onSaveToggle }) => {
    const { user, isAuthenticated } = useAuth();
    const [saving, setSaving] = useState(false);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleSaveToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated || user.role !== 'candidate') return;

        setSaving(true);
        try {
            if (isSaved) {
                await unsaveJob(job._id);
            } else {
                await saveJob(job._id);
            }
            if (onSaveToggle) onSaveToggle(job._id, !isSaved);
        } catch (error) {
            console.error('Error toggling job save:', error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <Link to={`/jobs/${job._id}`} className="block">
                <div className="p-5">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center mb-3">
                            {job.companyId?.logo ? (
                                <img
                                    src={job.companyId.logo}
                                    alt={job.companyId?.companyName || 'Company'}
                                    className="w-12 h-12 rounded object-cover mr-3"
                                />
                            ) : (
                                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center mr-3">
                                    <span className="text-gray-500 text-xs">{job.companyId?.companyName?.charAt(0) || 'C'}</span>
                                </div>
                            )}
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">{job.title}</h3>
                                <p className="text-gray-600">{job.companyId?.companyName}</p>
                            </div>
                        </div>
                        {isAuthenticated && user.role === 'candidate' && (
                            <button
                                onClick={handleSaveToggle}
                                disabled={saving}
                                className={`ml-2 p-2 rounded-full focus:outline-none ${isSaved
                                        ? 'text-red-500 hover:bg-red-50'
                                        : 'text-gray-400 hover:bg-gray-50'
                                    }`}
                            >
                                {isSaved ? (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                        />
                                    </svg>
                                )}
                            </button>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {job.jobType}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                            {job.location}
                        </span>
                        {job.salary && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                ${job.salary.toLocaleString()} / year
                            </span>
                        )}
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-2">
                        {job.description}
                    </p>

                    {job.requiredSkills?.length > 0 && (
                        <div className="mb-3">
                            <p className="text-sm text-gray-500 mb-1">Required Skills:</p>
                            <div className="flex flex-wrap gap-1">
                                {job.requiredSkills.map(skill => (
                                    <span
                                        key={skill}
                                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                        <span>Posted: {formatDate(job.postedDate)}</span>
                        {job.deadlineDate && (
                            <span>Apply by: {formatDate(job.deadlineDate)}</span>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default JobCard;
