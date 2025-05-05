// src/pages/PostJobPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const PostJobPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        jobType: 'full-time',
        requiredSkills: '',
        salary: '',
        deadlineDate: '',
    });

    const {
        title,
        description,
        location,
        jobType,
        requiredSkills,
        salary,
        deadlineDate
    } = formData;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Format the data for API
            const jobData = {
                ...formData,
                // Convert salary to number if not empty
                salary: salary ? Number(salary) : undefined,
                // Convert requiredSkills to array
                requiredSkills: requiredSkills
                    ? requiredSkills.split(',').map(skill => skill.trim())
                    : [],
            };

            await axios.post('/api/jobs', jobData);
            toast.success('Job posted successfully');
            navigate('/company/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error posting job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Post a New Job</h1>

                <div className="bg-white rounded-lg shadow p-6">
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                    Job Title*
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={title}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. Frontend Developer"
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Job Description*
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows="8"
                                    value={description}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Provide a detailed description of the job, responsibilities, qualifications, etc."
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                                        Location*
                                    </label>
                                    <input
                                        type="text"
                                        id="location"
                                        name="location"
                                        value={location}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g. San Francisco, CA or Remote"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">
                                        Job Type*
                                    </label>
                                    <select
                                        id="jobType"
                                        name="jobType"
                                        value={jobType}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="full-time">Full Time</option>
                                        <option value="part-time">Part Time</option>
                                        <option value="contract">Contract</option>
                                        <option value="internship">Internship</option>
                                        <option value="remote">Remote</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="requiredSkills" className="block text-sm font-medium text-gray-700 mb-1">
                                    Required Skills (comma separated)
                                </label>
                                <input
                                    type="text"
                                    id="requiredSkills"
                                    name="requiredSkills"
                                    value={requiredSkills}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. JavaScript, React, Node.js"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
                                        Annual Salary (USD)
                                    </label>
                                    <input
                                        type="number"
                                        id="salary"
                                        name="salary"
                                        value={salary}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g. 80000"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="deadlineDate" className="block text-sm font-medium text-gray-700 mb-1">
                                        Application Deadline
                                    </label>
                                    <input
                                        type="date"
                                        id="deadlineDate"
                                        name="deadlineDate"
                                        value={deadlineDate}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={() => navigate('/company/dashboard')}
                                    className="text-gray-700 hover:text-gray-900"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`bg-blue-600 text-white px-6 py-2 rounded font-medium ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
                                        }`}
                                >
                                    {loading ? 'Posting...' : 'Post Job'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PostJobPage;
