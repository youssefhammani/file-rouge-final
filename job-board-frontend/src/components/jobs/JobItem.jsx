// src/components/jobs/JobItem.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/auth/AuthContext.jsx';

const JobItem = ({ job }) => {
    const { isAuthenticated, user } = useContext(AuthContext);

    const {
        _id,
        title,
        companyId,
        location,
        jobType,
        salary,
        requiredSkills,
        postedDate,
    } = job;

    const handleSaveJob = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to save jobs');
            return;
        }

        try {
            await axios.post(`/api/users/jobs/${_id}/save`);
            toast.success('Job saved successfully');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error saving job');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex justify-between">
                <div className="flex">
                    {companyId.logo ? (
                        <img
                            src={companyId.logo}
                            alt={companyId.companyName}
                            className="w-16 h-16 object-contain mr-4"
                        />
                    ) : (
                        <div className="w-16 h-16 bg-gray-200 flex items-center justify-center text-gray-500 mr-4 rounded">
                            {companyId.companyName?.charAt(0) || 'C'}
                        </div>
                    )}
                    <div>
                        <Link to={`/jobs/${_id}`} className="text-xl font-semibold text-blue-600 hover:underline">
                            {title}
                        </Link>
                        <div className="text-gray-600">{companyId.companyName}</div>
                        <div className="text-gray-500 mt-2">{location}</div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {jobType.replace('-', ' ')}
                    </div>
                    {salary && (
                        <div className="mt-2 font-medium">
                            ${salary.toLocaleString('en-US')}/year
                        </div>
                    )}
                    <div className="text-gray-500 text-sm mt-2">
                        Posted {format(new Date(postedDate), 'MMM d, yyyy')}
                    </div>
                </div>
            </div>

            {requiredSkills && requiredSkills.length > 0 && (
                <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                        {requiredSkills.map((skill, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-4 flex justify-between">
                <Link
                    to={`/jobs/${_id}`}
                    className="inline-flex items-center text-blue-600 hover:underline"
                >
                    View Details
                </Link>

                {isAuthenticated && user.role === 'candidate' && (
                    <button
                        onClick={handleSaveJob}
                        className="text-gray-500 hover:text-blue-600 flex items-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                            />
                        </svg>
                        Save
                    </button>
                )}
            </div>
        </div>
    );
};

export default JobItem;
