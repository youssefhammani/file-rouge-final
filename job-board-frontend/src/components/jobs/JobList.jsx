// src/components/jobs/JobList.jsx
import { useState, useEffect } from 'react';
import JobCard from './JobCard';
import { useAuth } from '../../hooks/useAuth';
import { getAllJobs, getSavedJobs } from '../../services/jobService';

const JobList = ({ filters = {}, limit }) => {
    const [jobs, setJobs] = useState([]);
    const [savedJobIds, setSavedJobIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
    });

    const { user, isAuthenticated } = useAuth();

    const fetchJobs = async (page = 1) => {
        setLoading(true);
        try {
            const params = {
                ...filters,
                page,
                limit: limit || 10,
            };

            const response = await getAllJobs(params);
            setJobs(response.data);
            setPagination({
                currentPage: response.pagination.currentPage,
                totalPages: response.pagination.totalPages,
            });
        } catch (error) {
            console.error('Error fetching jobs:', error);
            setError('Failed to load jobs. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const fetchSavedJobs = async () => {
        if (isAuthenticated && user.role === 'candidate') {
            try {
                const response = await getSavedJobs();
                const savedIds = new Set(response.data.map(job => job._id));
                setSavedJobIds(savedIds);
            } catch (error) {
                console.error('Error fetching saved jobs:', error);
            }
        }
    };

    useEffect(() => {
        fetchJobs();
        fetchSavedJobs();
    }, [isAuthenticated, user, filters]);

    const handlePageChange = (newPage) => {
        fetchJobs(newPage);
    };

    const handleSaveToggle = (jobId, isSaved) => {
        setSavedJobIds(prev => {
            const newSet = new Set(prev);
            if (isSaved) {
                newSet.add(jobId);
            } else {
                newSet.delete(jobId);
            }
            return newSet;
        });
    };

    if (loading && jobs.length === 0) {
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
            <div className="text-center py-8">
                <h3 className="text-lg font-medium text-gray-700 mb-2">No jobs found</h3>
                <p className="text-gray-500">Try adjusting your search filters</p>
            </div>
        );
    }

    return (
        <div>
            <div className="space-y-4">
                {jobs.map((job) => (
                    <JobCard
                        key={job._id}
                        job={job}
                        isSaved={savedJobIds.has(job._id)}
                        onSaveToggle={handleSaveToggle}
                    />
                ))}
            </div>

            {pagination.totalPages > 1 && (
                <div className="flex justify-center mt-8">
                    <div className="flex space-x-1">
                        <button
                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                            disabled={pagination.currentPage === 1}
                            className={`px-4 py-2 rounded ${pagination.currentPage === 1
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            Previous
                        </button>

                        {[...Array(pagination.totalPages).keys()].map((page) => (
                            <button
                                key={page + 1}
                                onClick={() => handlePageChange(page + 1)}
                                className={`px-4 py-2 rounded ${pagination.currentPage === page + 1
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                {page + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                            disabled={pagination.currentPage === pagination.totalPages}
                            className={`px-4 py-2 rounded ${pagination.currentPage === pagination.totalPages
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobList;
