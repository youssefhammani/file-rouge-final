// src/components/jobs/JobList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JobItem from './JobItem.jsx';
import JobFilter from './JobFilter.jsx';
import Spinner from '../layout/Spinner.jsx';
import Pagination from '../layout/Pagination.jsx';

const JobList = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        location: '',
        jobType: '',
        skills: '',
    });
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        total: 0,
    });

    useEffect(() => {
        fetchJobs();
    }, [filters.location, filters.jobType, filters.skills, pagination.currentPage]);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: pagination.currentPage,
                limit: 10,
            });

            if (filters.search) queryParams.append('search', filters.search);
            if (filters.location) queryParams.append('location', filters.location);
            if (filters.jobType) queryParams.append('jobType', filters.jobType);
            if (filters.skills) queryParams.append('skills', filters.skills);

            const res = await axios.get(`/api/jobs?${queryParams}`);
            setJobs(res.data.data);
            setPagination({
                currentPage: res.data.pagination.currentPage,
                totalPages: res.data.pagination.totalPages,
                total: res.data.total,
            });
        } catch (err) {
            setError('Error fetching jobs. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters({ ...filters, ...newFilters });
        setPagination({ ...pagination, currentPage: 1 });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPagination({ ...pagination, currentPage: 1 });
        fetchJobs();
    };

    const handlePageChange = (page) => {
        setPagination({ ...pagination, currentPage: page });
    };

    if (loading) return <Spinner />;

    return (
        <div className="container mx-auto px-4 py-8">
            <JobFilter
                filters={filters}
                onFilterChange={handleFilterChange}
                onSearch={handleSearch}
            />

            <div className="mt-4 mb-6">
                <h2 className="text-xl font-semibold">
                    {pagination.total} Jobs Found
                </h2>
            </div>

            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
                    {error}
                </div>
            )}

            {jobs.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500 text-lg">No jobs found matching your criteria.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {jobs.map((job) => (
                        <JobItem key={job._id} job={job} />
                    ))}
                </div>
            )}

            {pagination.totalPages > 1 && (
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
};

export default JobList;
