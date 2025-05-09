// src/pages/JobsPage.jsx
import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import JobList from '../components/jobs/JobList';

const JobsPage = () => {
    const [filters, setFilters] = useState({
        search: '',
        location: '',
        jobType: '',
        skills: '',
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <Layout>
            <div className="container mx-auto py-8 px-4">
                <h1 className="text-3xl font-bold mb-8">Browse Jobs</h1>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label htmlFor="search" className="block text-gray-700 font-medium mb-2">
                                    Search
                                </label>
                                <input
                                    type="text"
                                    id="search"
                                    name="search"
                                    value={filters.search}
                                    onChange={handleFilterChange}
                                    placeholder="Job title, keywords, or company"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={filters.location}
                                    onChange={handleFilterChange}
                                    placeholder="City, state, or remote"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="jobType" className="block text-gray-700 font-medium mb-2">
                                    Job Type
                                </label>
                                <select
                                    id="jobType"
                                    name="jobType"
                                    value={filters.jobType}
                                    onChange={handleFilterChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Types</option>
                                    <option value="full-time">Full-time</option>
                                    <option value="part-time">Part-time</option>
                                    <option value="contract">Contract</option>
                                    <option value="internship">Internship</option>
                                    <option value="remote">Remote</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="skills" className="block text-gray-700 font-medium mb-2">
                                    Skills
                                </label>
                                <input
                                    type="text"
                                    id="skills"
                                    name="skills"
                                    value={filters.skills}
                                    onChange={handleFilterChange}
                                    placeholder="e.g. JavaScript, React, Node.js"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </form>
                </div>

                {/* Job listings */}
                <JobList filters={filters} />
            </div>
        </Layout>
    );
};

export default JobsPage;
