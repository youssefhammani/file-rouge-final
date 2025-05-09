// src/components/applications/ApplicationCard.jsx
import { useState } from 'react';
import { updateApplicationStatus } from '../../services/jobService';
import { useAuth } from '../../hooks/useAuth';

const ApplicationCard = ({ application, isCandidateView = false, onStatusUpdate }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'reviewed':
                return 'bg-blue-100 text-blue-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'accepted':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleStatusChange = async (newStatus) => {
        setLoading(true);
        setError('');

        try {
            await updateApplicationStatus(application._id, newStatus);
            if (onStatusUpdate) {
                onStatusUpdate(application._id, newStatus);
            }
        } catch (error) {
            console.error('Error updating application status:', error);
            setError('Failed to update status. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-5">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="flex justify-between items-start mb-4">
                    <div>
                        {isCandidateView ? (
                            // For candidate view (showing job details)
                            <div className="flex items-center">
                                {application.jobId?.companyId?.logo ? (
                                    <img
                                        src={application.jobId.companyId.logo}
                                        alt={application.jobId.companyId.companyName}
                                        className="w-12 h-12 rounded object-cover mr-3"
                                    />
                                ) : (
                                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center mr-3">
                                        <span className="text-gray-500 text-xs">
                                            {application.jobId?.companyId?.companyName?.charAt(0) || 'C'}
                                        </span>
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800">
                                        {application.jobId?.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {application.jobId?.companyId?.companyName}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            // For company view (showing candidate details)
                            <div className="flex items-center">
                                {application.candidateId?.profilePicture ? (
                                    <img
                                        src={application.candidateId.profilePicture}
                                        alt={application.candidateId.name}
                                        className="w-12 h-12 rounded-full object-cover mr-3"
                                    />
                                ) : (
                                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                                        <span className="text-gray-500 text-lg">
                                            {application.candidateId?.name?.charAt(0) || 'U'}
                                        </span>
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800">
                                        {application.candidateId?.name}
                                    </h3>
                                    <p className="text-gray-600">
                                        {application.candidateId?.email}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col items-end">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(application.status)}`}>
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                            Applied: {formatDate(application.appliedDate)}
                        </span>
                    </div>
                </div>

                {application.coverLetter && (
                    <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-1">Cover Letter:</h4>
                        <p className="text-gray-600 text-sm whitespace-pre-line">
                            {application.coverLetter}
                        </p>
                    </div>
                )}

                <div className="flex justify-between items-center">
                    <a
                        href={application.resumeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        View Resume
                    </a>

                    {/* Status update buttons (only for company view) */}
                    {!isCandidateView && user.role === 'company' && (
                        <div className="flex space-x-2">
                            {application.status !== 'reviewed' && (
                                <button
                                    onClick={() => handleStatusChange('reviewed')}
                                    disabled={loading}
                                    className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200"
                                >
                                    Mark as Reviewed
                                </button>
                            )}

                            {application.status !== 'accepted' && (
                                <button
                                    onClick={() => handleStatusChange('accepted')}
                                    disabled={loading}
                                    className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-md hover:bg-green-200"
                                >
                                    Accept
                                </button>
                            )}

                            {application.status !== 'rejected' && (
                                <button
                                    onClick={() => handleStatusChange('rejected')}
                                    disabled={loading}
                                    className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded-md hover:bg-red-200"
                                >
                                    Reject
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ApplicationCard;
