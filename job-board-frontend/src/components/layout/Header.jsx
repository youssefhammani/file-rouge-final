// src/components/layout/Header.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <header className="bg-blue-600 text-white">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold">
                    JobBoard
                </Link>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white focus:outline-none"
                    onClick={toggleMobileMenu}
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                        ></path>
                    </svg>
                </button>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-4 items-center">
                    <Link to="/jobs" className="hover:text-blue-200">
                        Browse Jobs
                    </Link>

                    {isAuthenticated ? (
                        <>
                            {user.role === 'company' ? (
                                <>
                                    <Link to="/post-job" className="hover:text-blue-200">
                                        Post Job
                                    </Link>
                                    <Link to="/my-jobs" className="hover:text-blue-200">
                                        My Jobs
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/saved-jobs" className="hover:text-blue-200">
                                        Saved Jobs
                                    </Link>
                                    <Link to="/applications" className="hover:text-blue-200">
                                        My Applications
                                    </Link>
                                </>
                            )}
                            <Link to="/profile" className="hover:text-blue-200">
                                Profile
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="hover:text-blue-200"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </nav>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-blue-700 py-2">
                    <div className="container mx-auto px-4 flex flex-col space-y-2">
                        <Link
                            to="/jobs"
                            className="text-white py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Browse Jobs
                        </Link>

                        {isAuthenticated ? (
                            <>
                                {user.role === 'company' ? (
                                    <>
                                        <Link
                                            to="/post-job"
                                            className="text-white py-2"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Post Job
                                        </Link>
                                        <Link
                                            to="/my-jobs"
                                            className="text-white py-2"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            My Jobs
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/saved-jobs"
                                            className="text-white py-2"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Saved Jobs
                                        </Link>
                                        <Link
                                            to="/applications"
                                            className="text-white py-2"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            My Applications
                                        </Link>
                                    </>
                                )}
                                <Link
                                    to="/profile"
                                    className="text-white py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="text-white py-2 text-left w-full"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-white py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="text-white py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
