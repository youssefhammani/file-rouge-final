// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';

// Import pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import JobsPage from './pages/JobsPage';
import JobDetailPage from './pages/JobDetailPage';
import ProfilePage from './pages/ProfilePage';
import PostJobPage from './pages/PostJobPage';
import EditJobPage from './pages/EditJobPage';
import SavedJobsPage from './pages/SavedJobsPage';
import ApplicationsPage from './pages/ApplicationsPage';
import CompanyJobsPage from './pages/CompanyJobsPage';
import AboutPage from './pages/AboutPage';

// Protected Route component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/jobs" element={<JobsPage />} />
      <Route path="/jobs/:id" element={<JobDetailPage />} />
      <Route path="/about" element={<AboutPage />} />

      {/* Protected routes */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/post-job"
        element={
          <ProtectedRoute allowedRoles={['company']}>
            <PostJobPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-job/:id"
        element={
          <ProtectedRoute allowedRoles={['company']}>
            <EditJobPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-jobs"
        element={
          <ProtectedRoute allowedRoles={['company']}>
            <CompanyJobsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/saved-jobs"
        element={
          <ProtectedRoute allowedRoles={['candidate']}>
            <SavedJobsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/applications"
        element={
          <ProtectedRoute>
            <ApplicationsPage />
          </ProtectedRoute>
        }
      />

      {/* 404 route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;
