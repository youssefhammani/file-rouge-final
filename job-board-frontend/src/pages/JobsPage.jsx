// src/pages/JobsPage.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import JobList from '../components/jobs/JobList';
import JobFilter from '../components/jobs/JobFilter';
import Spinner from '../components/layout/Spinner';
import { toast } from 'react-toastify';

const JobsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Get query params from URL
    const queryParams = new URLSearchParams(location.search);

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: parseInt(queryParams.get('page')) || 1,
        totalPages: 1,
        totalJobs: 0
    });

    const [filters, setFilters] = useState({
        search: queryParams.get('search') || '',
        location: queryParams.get('location') || '',
        jobType: queryParams.get('jobType') || '',
        skills: queryParams.get('skills') || '',
        sort: queryParams.get('sort') || 'newest'
    });

    useEffect(() => {
        fetchJobs();
    }, [location.search]);

    const fetchJobs = async () => {
        try {
            setLoading(true);

            // Build query string from URL params
            const params = new URLSearchParams(location.search);

            const res = await axios.get(`/api/jobs?${params}`);

            setJobs(res.data.data);
            setPagination({
                currentPage: res.data.page,
                totalPages: res.data.totalPages,
                totalJobs: res.data.total
            });
        } catch (err) {
            setError('Error fetching jobs');
            toast.error('Failed to load jobs');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters({ ...filters, ...newFilters });
    };

    const handleSearch = (e) => {
        e.preventDefault();

        // Build query params
        const params = new URLSearchParams();

        // Only add non-empty filters to the URL
        Object.entries(filters).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            }
        });

        // Reset to page 1 when filtering
        params.set('page', '1');

        // Update URL and trigger re-fetch
        navigate(`/jobs?${params.toString()}`);
    };

    const handlePageChange = (page) => {
        const params = new URLSearchParams(location.search);
        params.set('page', page);
        navigate(`/jobs?${params.toString()}`);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Browse Jobs</h1>

            <JobFilter
                filters={filters}
                onFilterChange={handleFilterChange}
                onSearch={handleSearch}
            />

            {loading ? (
                <Spinner />
            ) : (
                <>
                    <div className="mb-4 flex justify-between items-center">
                        <div className="text-gray-600">
                            Showing {jobs.length} of {pagination.totalJobs} jobs
                        </div>

                        <div>
                            <select
                                value={filters.sort}
                                onChange={(e) => {
                                    const newFilters = { ...filters, sort: e.target.value };
                                    handleFilterChange(newFilters);

                                    // Update URL immediately for sort change
                                    const params = new URLSearchParams(location.search);
                                    params.set('sort', e.target.value);
                                    navigate(`/jobs?${params.toString()}`);
                                }}
                                className="border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="newest">Newest</option>
                                <option value="oldest">Oldest</option>
                                <option value="salary_high">Highest Salary</option>
                                <option value="salary_low">Lowest Salary</option>
                            </select>
                        </div>
                    </div>

                    <JobList
                        jobs={jobs}
                        pagination={pagination}
                        onPageChange={handlePageChange}
                        error={error}
                    />
                </>
            )}
        </div>
    );
};

export default JobsPage;
