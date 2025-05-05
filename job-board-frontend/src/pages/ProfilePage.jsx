// src/pages/ProfilePage.js
import React, { useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/auth/AuthContext';

const ProfilePage = () => {
    const { user, updateProfile, loading: authLoading } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        // Company fields
        companyName: '',
        description: '',
        location: '',
        website: '',
        // Candidate fields
        skills: '',
        resume: '',
    });

    // Set form data when user is loaded
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                companyName: user.companyName || '',
                description: user.description || '',
                location: user.location || '',
                website: user.website || '',
                skills: user.skills ? user.skills.join(', ') : '',
                resume: user.resume || '',
            });
        }
    }, [user]);

    const {
        name,
        email,
        companyName,
        description,
        location,
        website,
        skills,
        resume
    } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Format skills as an array
            const profileData = { ...formData };
            if (user.role === 'candidate' && skills) {
                // Split skills by commas and trim whitespace
                profileData.skills = skills.split(',').map(skill => skill.trim());
            }

            await updateProfile(profileData);
            toast.success('Profile updated successfully');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

                <div className="bg-white rounded-lg shadow p-6">
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                            {user?.role === 'company' ? 'Contact Name' : 'Full Name'}
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={name}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={email}
                                            disabled
                                            className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                                        />
                                        <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
                                    </div>
                                </div>
                            </div>

                            {user?.role === 'company' && (
                                <div>
                                    <h2 className="text-xl font-semibold mb-4">Company Information</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                                                Company Name
                                            </label>
                                            <input
                                                type="text"
                                                id="companyName"
                                                name="companyName"
                                                value={companyName}
                                                onChange={handleChange}
                                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                                Company Description
                                            </label>
                                            <textarea
                                                id="description"
                                                name="description"
                                                rows="4"
                                                value={description}
                                                onChange={handleChange}
                                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            ></textarea>
                                        </div>
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            <div>
                                                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Location
                                                </label>
                                                <input
                                                    type="text"
                                                    id="location"
                                                    name="location"
                                                    value={location}
                                                    onChange={handleChange}
                                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Website
                                                </label>
                                                <input
                                                    type="url"
                                                    id="website"
                                                    name="website"
                                                    value={website}
                                                    onChange={handleChange}
                                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {user?.role === 'candidate' && (
                                <div>
                                    <h2 className="text-xl font-semibold mb-4">Job Seeker Information</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                                                Skills (comma separated)
                                            </label>
                                            <input
                                                type="text"
                                                id="skills"
                                                name="skills"
                                                value={skills}
                                                onChange={handleChange}
                                                placeholder="e.g. JavaScript, React, Node.js"
                                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
                                                Resume Link (Google Drive, Dropbox, etc.)
                                            </label>
                                            <input
                                                type="url"
                                                id="resume"
                                                name="resume"
                                                value={resume}
                                                onChange={handleChange}
                                                placeholder="https://drive.google.com/..."
                                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded font-medium ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
                                        }`}
                                >
                                    {loading ? 'Updating...' : 'Update Profile'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
