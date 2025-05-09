// src/components/applications/ApplicationForm.jsx
import { useState } from 'react';
import { applyForJob } from '../../services/jobService';

const ApplicationForm = ({ jobId, onSuccess }) => {
    const [formData, setFormData] = useState({
        coverLetter: '',
        resumeLink: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await applyForJob(jobId, formData);
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Error applying for job:', error);
            setError(error.response?.data?.message || 'Failed to submit application. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="mb-4">
                <label htmlFor="resumeLink" className="block text-gray-700 font-medium mb-2">
                    Resume Link*
                </label>
                <input
                    type="url"
                    id="resumeLink"
                    name="resumeLink"
                    value={formData.resumeLink}
                    onChange={handleChange}
                    placeholder="https://drive.google.com/your-resume"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <p className="text-sm text-gray-500 mt-1">
                    Please provide a link to your resume (Google Drive, Dropbox, etc.)
                </p>
            </div>

            <div className="mb-6">
                <label htmlFor="coverLetter" className="block text-gray-700 font-medium mb-2">
                    Cover Letter
                </label>
                <textarea
                    id="coverLetter"
                    name="coverLetter"
                    value={formData.coverLetter}
                    onChange={handleChange}
                    rows="6"
                    placeholder="Introduce yourself and explain why you're a good fit for this position..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
            </div>

            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={() => onSuccess ? onSuccess() : null}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
                >
                    {loading ? 'Submitting...' : 'Submit Application'}
                </button>
            </div>
        </form>
    );
};

export default ApplicationForm;
