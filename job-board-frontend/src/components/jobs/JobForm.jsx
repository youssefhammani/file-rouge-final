// src/components/jobs/JobForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createJob, getJobById, updateJob } from '../../services/jobService';

const JobForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        jobType: 'full-time',
        salary: '',
        requiredSkills: [],
        deadlineDate: '',
        isActive: true
    });
    const [skillInput, setSkillInput] = useState('');

    useEffect(() => {
        // If id exists, fetch job data for editing
        if (id) {
            const fetchJob = async () => {
                try {
                    const response = await getJobById(id);
                    const job = response.data;

                    // Format date for input field if it exists
                    let deadlineDate = '';
                    if (job.deadlineDate) {
                        const date = new Date(job.deadlineDate);
                        deadlineDate = date.toISOString().split('T')[0];
                    }

                    setFormData({
                        title: job.title || '',
                        description: job.description || '',
                        location: job.location || '',
                        jobType: job.jobType || 'full-time',
                        salary: job.salary || '',
                        requiredSkills: job.requiredSkills || [],
                        deadlineDate,
                        isActive: job.isActive !== undefined ? job.isActive : true
                    });
                } catch (error) {
                    console.error('Error fetching job:', error);
                    setError('Failed to load job data. Please try again later.');
                }
            };

            fetchJob();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSkillInputChange = (e) => {
        setSkillInput(e.target.value);
    };

    const addSkill = () => {
        if (skillInput.trim() !== '' && !formData.requiredSkills.includes(skillInput.trim())) {
            setFormData(prev => ({
                ...prev,
                requiredSkills: [...prev.requiredSkills, skillInput.trim()]
            }));
            setSkillInput('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setFormData(prev => ({
            ...prev,
            requiredSkills: prev.requiredSkills.filter(skill => skill !== skillToRemove)
        }));
    };

    const handleSkillKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkill();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Prepare data - convert salary to number if provided
            const jobData = {
                ...formData,
                salary: formData.salary ? Number(formData.salary) : undefined
            };

            if (id) {
                await updateJob(id, jobData);
            } else {
                await createJob(jobData);
            }

            navigate('/my-jobs');
        } catch (error) {
            console.error('Error saving job:', error);
            setError(error.response?.data?.message || 'Failed to save job. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold mb-6">
                    {id ? 'Edit Job Posting' : 'Create New Job Posting'}
                </h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                            Job Title*
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                            Job Description*
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="6"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        ></textarea>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
                            Location*
                        </label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label htmlFor="jobType" className="block text-gray-700 font-medium mb-2">
                                Job Type*
                            </label>
                            <select
                                id="jobType"
                                name="jobType"
                                value={formData.jobType}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="full-time">Full-time</option>
                                <option value="part-time">Part-time</option>
                                <option value="contract">Contract</option>
                                <option value="internship">Internship</option>
                                <option value="remote">Remote</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="salary" className="block text-gray-700 font-medium mb-2">
                                Annual Salary (USD)
                            </label>
                            <input
                                type="number"
                                id="salary"
                                name="salary"
                                value={formData.salary}
                                onChange={handleChange}
                                placeholder="Optional"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="deadlineDate" className="block text-gray-700 font-medium mb-2">
                            Application Deadline
                        </label>
                        <input
                            type="date"
                            id="deadlineDate"
                            name="deadlineDate"
                            value={formData.deadlineDate}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">
                            Required Skills
                        </label>
                        <div className="flex">
                            <input
                                type="text"
                                value={skillInput}
                                onChange={handleSkillInputChange}
                                onKeyDown={handleSkillKeyDown}
                                placeholder="Add a skill and press Enter"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={addSkill}
                                className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
                            >
                                Add
                            </button>
                        </div>
                        {formData.requiredSkills.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {formData.requiredSkills.map((skill) => (
                                    <div
                                        key={skill}
                                        className="bg-gray-100 px-3 py-1 rounded-full flex items-center"
                                    >
                                        <span className="text-gray-800">{skill}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeSkill(skill)}
                                            className="ml-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="isActive"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="isActive" className="ml-2 block text-gray-700">
                                Job is active and visible to candidates
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => navigate('/my-jobs')}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
                        >
                            {loading ? 'Saving...' : id ? 'Update Job' : 'Post Job'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JobForm;
