// src/components/jobs/JobFilter.js
import React from 'react';

const JobFilter = ({ filters, onFilterChange, onSearch }) => {
    const jobTypes = [
        { value: '', label: 'All Types' },
        { value: 'full-time', label: 'Full Time' },
        { value: 'part-time', label: 'Part Time' },
        { value: 'contract', label: 'Contract' },
        { value: 'internship', label: 'Internship' },
        { value: 'remote', label: 'Remote' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        onFilterChange({ [name]: value });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
            <form onSubmit={onSearch}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                            Search
                        </label>
                        <input
                            type="text"
                            id="search"
                            name="search"
                            value={filters.search}
                            onChange={handleChange}
                            placeholder="Job title, keywords..."
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                            Location
                        </label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={filters.location}
                            onChange={handleChange}
                            placeholder="City, state, or remote"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">
                            Job Type
                        </label>
                        <select
                            id="jobType"
                            name="jobType"
                            value={filters.jobType}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {jobTypes.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                            Skills (comma separated)
                        </label>
                        <input
                            type="text"
                            id="skills"
                            name="skills"
                            value={filters.skills}
                            onChange={handleChange}
                            placeholder="e.g. JavaScript, React"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <button
                        type="submit"
                        className="w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Search Jobs
                    </button>
                </div>
            </form>
        </div>
    );
};

export default JobFilter;
