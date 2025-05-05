// src/components/applications/JobApplicationForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const JobApplicationForm = ({ jobId, onSuccess }) => {
    const [formData, setFormData] = useState({
        resumeLink: '',
        coverLetter: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post(`/api/applications/jobs/${jobId}/apply`, formData);
            toast.success('Application submitted successfully');
            if (onSuccess) onSuccess();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error submitting application');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Apply for this Job</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="resumeLink">
                        Resume Link (Google Drive, Dropbox, etc.)
                    </label>
                    <input
                        type="url"
                        id="resumeLink"
                        name="resumeLink"
                        value={formD>ata.resumeLink}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://drive.google.com/..."
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="coverLetter">
                        Cover Letter
                    </label>
                    <textarea
                        id="coverLetter"
                        name="coverLetter"
                        value={formData.coverLetter}
                        onChange={handleChange}
                        rows="6"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Introduce yourself and explain why you are a good fit for this position..."
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-blue-600 text-white px-4 py-2 rounded font-medium ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
                        }`}
                >
                    {loading ? 'Submitting...' : 'Submit Application'}
                </button>
            </form>
        </div>
    );
};

export default JobApplicationForm;
