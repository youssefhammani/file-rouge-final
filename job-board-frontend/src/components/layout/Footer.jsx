// src/components/layout/Footer.jsx
const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between">
                    <div className="mb-6 md:mb-0">
                        <h2 className="text-xl font-bold mb-4">JobBoard</h2>
                        <p className="text-gray-400">
                            Find your dream job or the perfect candidate.
                        </p>
                    </div>

                    <div className="mb-6 md:mb-0">
                        <h3 className="text-lg font-bold mb-2">For Job Seekers</h3>
                        <ul className="text-gray-400">
                            <li className="mb-1"><a href="/jobs" className="hover:text-white">Browse Jobs</a></li>
                            <li className="mb-1"><a href="/saved-jobs" className="hover:text-white">Saved Jobs</a></li>
                            <li className="mb-1"><a href="/applications" className="hover:text-white">My Applications</a></li>
                        </ul>
                    </div>

                    <div className="mb-6 md:mb-0">
                        <h3 className="text-lg font-bold mb-2">For Employers</h3>
                        <ul className="text-gray-400">
                            <li className="mb-1"><a href="/post-job" className="hover:text-white">Post a Job</a></li>
                            <li className="mb-1"><a href="/my-jobs" className="hover:text-white">Manage Jobs</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-2">Legal</h3>
                        <ul className="text-gray-400">
                            <li className="mb-1"><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
                            <li className="mb-1"><a href="/terms" className="hover:text-white">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} JobBoard. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
