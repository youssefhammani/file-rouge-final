// src/hooks/useJobs.js
import {
    useState,
    useCallback
} from 'react';
import {
    getAllJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    saveJob,
    unsaveJob,
    getSavedJobs
} from '../services/jobService';

export const useJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [job, setJob] = useState(null);
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1
    });

    const fetchJobs = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);

        try {
            const response = await getAllJobs(params);
            setJobs(response.data);
            setPagination({
                currentPage: response.pagination.currentPage,
                totalPages: response.pagination.totalPages
            });
            return response;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch jobs');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchJobById = useCallback(async (id) => {
        setLoading(true);
        setError(null);

        try {
            const response = await getJobById(id);
            setJob(response.data);
            return response;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch job details');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const addJob = useCallback(async (jobData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await createJob(jobData);
            setJobs(prev => [response.data, ...prev]);
            return response;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create job');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const editJob = useCallback(async (id, jobData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await updateJob(id, jobData);
            setJobs(prev =>
                prev.map(job => job._id === id ? response.data : job)
            );
            if (job && job._id === id) {
                setJob(response.data);
            }
            return response;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update job');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [job]);

    const removeJob = useCallback(async (id) => {
        setLoading(true);
        setError(null);

        try {
            const response = await deleteJob(id);
            setJobs(prev => prev.filter(job => job._id !== id));
            return response;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete job');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const toggleSaveJob = useCallback(async (id, isSaved) => {
        setLoading(true);
        setError(null);

        try {
            let response;
            if (isSaved) {
                response = await unsaveJob(id);
                setSavedJobs(prev => prev.filter(job => job._id !== id));
            } else {
                response = await saveJob(id);
                // Fetch the job details if not already in savedJobs
                const jobDetails = await getJobById(id);
                setSavedJobs(prev => [...prev, jobDetails.data]);
            }
            return response;
        } catch (err) {
            setError(err.response?.data?.message || `Failed to ${isSaved ? 'unsave' : 'save'} job`);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchSavedJobs = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await getSavedJobs();
            setSavedJobs(response.data);
            return response;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch saved jobs');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        jobs,
        job,
        savedJobs,
        loading,
        error,
        pagination,
        fetchJobs,
        fetchJobById,
        addJob,
        editJob,
        removeJob,
        toggleSaveJob,
        fetchSavedJobs
    };
};