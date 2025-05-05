// src/components/layout/Navbar.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/auth/AuthContext';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const authLinks = (
        <ul className="flex space-x-4">
            {user && user.role === 'candidate' && (
                <>
                    <li>
                        <Link to="/jobs" className="hover:text-blue-500">
                            Find Jobs
                        </Link>
                    </li>
                    <li>
                        <Link to="/saved-jobs" className="hover:text-blue-500">
                            Saved Jobs
                        </Link>
                    </li>
                    <li>
                        <Link to="/my-applications" className="hover:text-blue-500">
                            My Applications
                        </Link>
                    </li>
                </>
            )}
            {user && user.role === 'company' && (
                <>
                    <li>
                        <Link to="/company/dashboard" className="hover:text-blue-500">
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link to="/company/jobs/post" className="hover:text-blue-500">
                            Post Job
                        </Link>
                    </li>
                </>
            )}
            <li>
                <Link to="/profile" className="hover:text-blue-500">
                    Profile
                </Link>
            </li>
            <li>
                <button onClick={handleLogout} className="hover:text-blue-500">
                    Logout
                </button>
            </li>
        </ul>
    );

    const guestLinks = (
        <ul className="flex space-x-4">
            <li>
                <Link to="/jobs" className="hover:text-blue-500">
                    Find Jobs
                </Link>
            </li>
            <li>
                <Link to="/login" className="hover:text-blue-500">
                    Login
                </Link>
            </li>
            <li>
                <Link
                    to="/register"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Register
                </Link>
            </li>
        </ul>
    );

    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-blue-600">
                    JobBoard
                </Link>
                <div>{isAuthenticated ? authLinks : guestLinks}</div>
            </div>
        </nav>
    );
};

export default Navbar;
