// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import PrivateRoute from './components/routing/PrivateRoute.jsx';
import CompanyRoute from './components/routing/CompanyRoute.jsx';
import CandidateRoute from './components/routing/CandidateRoute.jsx';

// Pages
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import JobsPage from './pages/JobsPage.jsx';
import JobDetailsPage from './pages/JobDetailsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import SavedJobsPage from './pages/SavedJobsPage.jsx';
import ApplicationsPage from './pages/ApplicationsPage.jsx';
import CompanyDashboardPage from './pages/CompanyDashboardPage.jsx';
import PostJobPage from './pages/PostJobPage.jsx';
import EditJobPage from './pages/EditJobPage.jsx';
import JobApplicationsPage from './pages/JobApplicationsPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

// Context
import { AuthProvider } from './context/auth/AuthContext.jsx';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col miggn-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/jobs/:id" element={<JobDetailsPage />} />

              {/* Protected Routes */}
              <Route path="/profile" element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              } />

              {/* Candidate Only Routes */}
              <Route path="/saved-jobs" element={
                <CandidateRoute>
                  <SavedJobsPage />
                </CandidateRoute>
              } />
              <Route path="/my-applications" element={
                <CandidateRoute>
                  <ApplicationsPage />
                </CandidateRoute>
              } />

              {/* Company Only Routes */}
              <Route path="/company/dashboard" element={
                <CompanyRoute>
                  <CompanyDashboardPage />
                </CompanyRoute>
              } />
              <Route path="/company/jobs/post" element={
                <CompanyRoute>
                  <PostJobPage />
                </CompanyRoute>
              } />
              <Route path="/company/jobs/edit/:id" element={
                <CompanyRoute>
                  <EditJobPage />
                </CompanyRoute>
              } />
              <Route path="/company/jobs/:id/applications" element={
                <CompanyRoute>
                  <JobApplicationsPage />
                </CompanyRoute>
              } />

              {/* Not Found Route */}
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastContainer position="bottom-right" />
      </Router>
    </AuthProvider>
  );
};

export default App;
