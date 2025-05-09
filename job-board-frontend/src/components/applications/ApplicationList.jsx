// src/components/applications/ApplicationList.jsx
import { useState, useEffect } from 'react';
import { getUserApplications, getJobApplications } from '../../services/jobService';
import ApplicationCard from './ApplicationCard';
import { useAuth } from '../../hooks/useAuth';

const ApplicationList = ({ jobId = null }) => {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchApplications();
    }, [jobId]);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            let response;

            if (jobId) {
                // Fetch applications for a specific job (company view)
                response = await getJobApplications(jobId);
            } else {
                // Fetch user's applications (candidate view)
                response = await getUserApplications();
            }

            setApplications(response.data);
        } catch (error) {
            console.error('Error fetching applications:', error);
            setError('Failed to load applications. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = (applicationId, newStatus) => {
        setApplications(prev =>
            prev.map(app =>
                app._id === applicationId
                    ? { ...app, status: newStatus }
                    : app
            )
        );
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

    if (applications.length === 0) {
        return (
            <div className="text-center py-8">
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                    {jobId
                        ? 'No applications for this job yet'
                        : 'You haven\'t applied to any jobs yet'
                    }
                </h3>
                {!jobId && user.role === 'candidate' && (
                    <div className="mt-4">
                        <a
                            href="/jobs"
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            Browse Jobs
                        </a>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {applications.map((application) => (
                <ApplicationCard
                    key={application._id}
                    application={application}
                    isCandidateView={user.role === 'candidate'}
                    onStatusUpdate={handleStatusUpdate}
                />
            ))}
        </div>
    );
};

export default ApplicationList;
