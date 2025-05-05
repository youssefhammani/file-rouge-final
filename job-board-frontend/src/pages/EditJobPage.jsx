// src/pages/EditJobPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const EditJobPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        jobType: 'full-time',
        requiredSkills: '',
        salary: '',
        deadlineDate: '',
        isActive: true,
    });

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await axios.get(`/api/jobs/${id}`);
                const job = res.data.data;

                // Format data for form
                setFormData({
                    title: job.title,
                    description: job.description,
                    location: job.location,
                    jobType: job.jobType,
                    requiredSkills: job.requiredSkills ? job.requiredSkills.join(', ') : '',
                    salary: job.salary || '',
                    deadlineDate: job.deadlineDate ? format(new Date(job.deadlineDate), 'yyyy-MM-dd') : '',
                    isActive: job.isActive,
                });
            } catch (err) {
                setError('Error fetching job details');
                toast.error('Failed to load job details');
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [id]);

    const {
        title,
        description,
        location,
        jobType,
        requiredSkills,
        salary,
        deadlineDate,
        isActive
    } = formData;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

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

            await axios.put(`/api/jobs/${id}`, jobData);
            toast.success('Job updated successfully');
            navigate('/company/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error updating job');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
                    {error}
                </div>
                <button
                    onClick={() => navigate('/company/dashboard')}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Edit Job</h1>

                <div className="bg-white rounded-lg shadow p-6">
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            <div className="flex items-center mb-4">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    name="isActive"
                                    checked={isActive}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                                    Active job listing (visible to candidates)
                                </label>
                            </div>

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
                                    disabled={submitting}
                                    className={`bg-blue-600 text-white px-6 py-2 rounded font-medium ${submitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
                                        }`}
                                >
                                    {submitting ? 'Updating...' : 'Update Job'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditJobPage;
