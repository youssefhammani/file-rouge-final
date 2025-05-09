// src/pages/ProfilePage.jsx
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import CandidateProfile from '../components/profile/CandidateProfile';
import CompanyProfile from '../components/profile/CompanyProfile';
import { useAuth } from '../hooks/useAuth';
import { getCurrentUser } from '../services/authService';

const ProfilePage = () => {
    const { isAuthenticated, user, updateUserData } = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            if (isAuthenticated) {
                try {
                    const response = await getCurrentUser();
                    setUserData(response.user);
                    // Update stored user data with the latest from the server
                    updateUserData(response.user);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [isAuthenticated, updateUserData]);

    // Redirect if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (loading) {
        return (
            <Layout>
                <div className="container mx-auto py-8 px-4 flex justify-center items-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto py-8 px-4">
                <h1 className="text-3xl font-bold mb-8">My Profile</h1>

                {userData && (
                    userData.role === 'candidate' ? (
                        <CandidateProfile userData={userData} />
                    ) : (
                        <CompanyProfile userData={userData} />
                    )
                )}
            </div>
        </Layout>
    );
};

export default ProfilePage;
