// src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import JobList from '../components/jobs/JobList';
import { getAllJobs } from '../services/jobService';
import { useAuth } from '../hooks/useAuth';

const HomePage = () => {
    const { isAuthenticated, user } = useAuth();
    const [featuredJobs, setFeaturedJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedJobs = async () => {
            try {
                const response = await getAllJobs({ limit: 4 });
                setFeaturedJobs(response.data);
            } catch (error) {
                console.error('Error fetching featured jobs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedJobs();
    }, []);

    return (
        <Layout>
            {/* Hero section */}
            <section className="bg-blue-600 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Find Your Dream Job Today
                    </h1>
                    <p className="text-xl mb-8 max-w-3xl mx-auto">
                        Connect with top employers and discover opportunities that match your skills and career goals.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            to="/jobs"
                            className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-blue-50 transition"
                        >
                            Browse Jobs
                        </Link>
                        {isAuthenticated ? (
                            user.role === 'company' ? (
                                <Link
                                    to="/post-job"
                                    className="bg-blue-700 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-800 transition"
                                >
                                    Post a Job
                                </Link>
                            ) : (
                                <Link
                                    to="/profile"
                                    className="bg-blue-700 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-800 transition"
                                >
                                    Update Profile
                                </Link>
                            )
                        ) : (
                            <Link
                                to="/register"
                                className="bg-blue-700 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-800 transition"
                            >
                                Create Account
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            {/* Featured jobs section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold">Featured Jobs</h2>
                        <Link to="/jobs" className="text-blue-600 hover:text-blue-800">
                            View all jobs →
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <div>
                            <JobList jobs={featuredJobs} />
                        </div>
                    )}
                </div>
            </section>

            {/* How it works section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-center mb-12">How It Works</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Search Jobs</h3>
                            <p className="text-gray-600">
                                Browse through thousands of job listings tailored to your skills and preferences.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Apply Online</h3>
                            <p className="text-gray-600">
                                Apply to jobs with just a few clicks and track your application status in real-time.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Get Hired</h3>
                            <p className="text-gray-600">
                                Connect with employers directly and land your dream job with ease.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to action section */}
            <section className="py-16 bg-gray-800 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Start Your Career Journey?</h2>
                    <p className="text-xl mb-8 max-w-3xl mx-auto">
                        Join thousands of job seekers who have found their perfect job match on our platform.
                    </p>
                    <div className="flex justify-center">
                        <Link
                            to={isAuthenticated ? '/jobs' : '/register'}
                            className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition"
                        >
                            {isAuthenticated ? 'Find Jobs Now' : 'Get Started'}
                        </Link>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default HomePage;
