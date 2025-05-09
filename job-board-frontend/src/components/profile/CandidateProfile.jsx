// src/components/profile/CandidateProfile.jsx
import { useState } from 'react';
import { updateProfile } from '../../services/userService';
import { useAuth } from '../../hooks/useAuth';

const CandidateProfile = ({ userData }) => {
    const { updateUserData } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        name: userData.name || '',
        profilePicture: userData.profilePicture || '',
        skills: userData.skills || [],
        resume: userData.resume || '',
    });
    const [skillInput, setSkillInput] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSkillInputChange = (e) => {
        setSkillInput(e.target.value);
    };

    const addSkill = () => {
        if (skillInput.trim() !== '' && !formData.skills.includes(skillInput.trim())) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, skillInput.trim()]
            }));
            setSkillInput('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
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
        setSuccess('');

        try {
            const response = await updateProfile(formData);
            updateUserData(response.data);
            setSuccess('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            setError(error.response?.data?.message || 'Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">Candidate Profile</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                        Full Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="profilePicture" className="block text-gray-700 font-medium mb-2">
                        Profile Picture URL
                    </label>
                    <input
                        type="url"
                        id="profilePicture"
                        name="profilePicture"
                        value={formData.profilePicture}
                        onChange={handleChange}
                        placeholder="https://example.com/your-profile-picture.jpg"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                        Paste a URL to your profile picture (optional)
                    </p>
                </div>

                <div className="mb-4">
                    <label htmlFor="resume" className="block text-gray-700 font-medium mb-2">
                        Resume URL
                    </label>
                    <input
                        type="url"
                        id="resume"
                        name="resume"
                        value={formData.resume}
                        onChange={handleChange}
                        placeholder="https://drive.google.com/your-resume"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                        Link to your resume (Google Drive, Dropbox, etc.)
                    </p>
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">
                        Skills
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
                    {formData.skills.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                            {formData.skills.map((skill) => (
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

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
                >
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
};

export default CandidateProfile;
