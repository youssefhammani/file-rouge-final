// src/pages/HomePage.js
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/auth/AuthContext';

const HomePage = () => {
    const { isAuthenticated, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalJobs: 0,
        totalCompanies: 0,
        featuredJobs: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Get total jobs count
                const jobsRes = await axios.get('/api/jobs?limit=1');

                // Get featured jobs
                const featuredRes = await axios.get('/api/jobs?limit=3');

                setStats({
                    totalJobs: jobsRes.data.total,
                    totalCompanies: Math.floor(jobsRes.data.total / 3), // Approximate for demo
                    featuredJobs: featuredRes.data.data
                });
            } catch (err) {
                console.error('Error fetching stats:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        const searchTerm = e.target.search.value;
        navigate(`/jobs?search=${searchTerm}`);
    };

    const jobCategories = [
        { name: 'Technology', icon: '💻', count: 120 },
        { name: 'Finance', icon: '💰', count: 85 },
        { name: 'Healthcare', icon: '🏥', count: 74 },
        { name: 'Education', icon: '🎓', count: 62 },
        { name: 'Marketing', icon: '📊', count: 91 },
        { name: 'Design', icon: '🎨', count: 67 },
    ];

    return (
        <div>
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Find Your Dream Job Today
                    </h1>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Connect with top employers and discover opportunities that match your skills and career goals.
                    </p>

                    <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-8">
                        <div className="flex flex-col md:flex-row gap-2">
                            <input
                                type="text"
                                name="search"
                                placeholder="Job title, keywords, or company"
                                className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
                            >
                                Search Jobs
                            </button>
                        </div>
                    </form>

                    {!loading && (
                        <div className="flex flex-wrap justify-center gap-8 mt-10">
                            <div className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur-sm">
                                <div className="text-3xl font-bold">{stats.totalJobs}+</div>
                                <div className="text-sm mt-1">Jobs Available</div>
                            </div>
                            <div className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur-sm">
                                <div className="text-3xl font-bold">{stats.totalCompanies}+</div>
                                <div className="text-sm mt-1">Companies</div>
                            </div>
                            <div className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur-sm">
                                <div className="text-3xl font-bold">1000+</div>
                                <div className="text-sm mt-1">Successful Matches</div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Popular Job Categories</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {jobCategories.map((category, index) => (
                            <Link
                                key={index}
                                to={`/jobs?category=${category.name}`}
                                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-center">
                                    <div className="text-3xl mr-4">{category.icon}</div>
                                    <div>
                                        <h3 className="text-xl font-semibold">{category.name}</h3>
                                        <p className="text-blue-600">{category.count} jobs</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <Link
                            to="/jobs"
                            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
                        >
                            Browse All Categories
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Jobs Section */}
            {!loading && stats.featuredJobs.length > 0 && (
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12">Featured Jobs</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {stats.featuredJobs.map(job => (
                                <div key={job._id} className="bg-white rounded-lg shadow border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center">
                                                {job.companyId.logo ? (
                                                    <img
                                                        src={job.companyId.logo}
                                                        alt={job.companyId.companyName}
                                                        className="w-12 h-12 object-contain mr-4"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 bg-gray-200 flex items-center justify-center text-gray-500 mr-4 rounded">
                                                        {job.companyId.companyName?.charAt(0) || 'C'}
                                                    </div>
                                                )}
                                                <div>
                                                    <h3 className="font-semibold text-lg">
                                                        <Link to={`/jobs/${job._id}`} className="hover:text-blue-600">
                                                            {job.title}
                                                        </Link>
                                                    </h3>
                                                    <p className="text-gray-600 text-sm">{job.companyId.companyName}</p>
                                                </div>
                                            </div>
                                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                                {job.jobType.replace('-', ' ')}
                                            </span>
                                        </div>

                                        <div className="mt-4 text-gray-500 text-sm">
                                            <div className="flex items-center mb-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {job.location}
                                            </div>
                                            {job.salary && (
                                                <div className="flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    ${job.salary.toLocaleString('en-US')}/year
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-4 pt-4 border-t">
                                            <Link
                                                to={`/jobs/${job._id}`}
                                                className="text-blue-600 hover:underline text-sm font-medium"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-10">
                            <Link
                                to="/jobs"
                                className="inline-block border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50"
                            >
                                View All Jobs
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="py-16 bg-gray-900 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-6">Ready to Take the Next Step in Your Career?</h2>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Join thousands of candidates who have found their dream jobs through our platform.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {isAuthenticated ? (
                            <Link
                                to="/jobs"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium"
                            >
                                Explore Jobs
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/register"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium"
                                >
                                    Sign Up
                                </Link>
                                <Link
                                    to="/login"
                                    className="border border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-medium transition-colors"
                                >
                                    Log In
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
