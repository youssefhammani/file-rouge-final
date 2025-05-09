// src/components/jobs/SavedJobs.jsx
import { useState, useEffect } from 'react';
import { getSavedJobs } from '../../services/jobService';
import JobCard from './JobCard';

const SavedJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSavedJobs();
    }, []);

    const fetchSavedJobs = async () => {
        setLoading(true);
        try {
            const response = await getSavedJobs();
            setJobs(response.data);
        } catch (error) {
            console.error('Error fetching saved jobs:', error);
            setError('Failed to load saved jobs. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveToggle = (jobId, isSaved) => {
        if (!isSaved) {
            // Remove job from the list if unsaved
            setJobs(prev => prev.filter(job => job._id !== jobId));
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

    if (jobs.length === 0) {
        return (
            <div className="text-center py-12">
                <h3 className="text-xl font-medium text-gray-700 mb-2">No saved jobs</h3>
                <p className="text-gray-500 mb-6">You haven't saved any jobs yet.</p>
                <a
                    href="/jobs"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    Browse Jobs
                </a>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Saved Jobs</h2>
            <div className="space-y-4">
                {jobs.map((job) => (
                    <JobCard
                        key={job._id}
                        job={job}
                        isSaved={true}
                        onSaveToggle={handleSaveToggle}
                    />
                ))}
            </div>
        </div>
    );
};

export default SavedJobs;
