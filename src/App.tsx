import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HomePage } from './pages/HomePage';
import { ConferenceDetailPage } from './pages/ConferenceDetailPage';
import { ResourceLibraryPage } from './pages/ResourceLibraryPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminConferencesPage } from './pages/AdminConferencesPage';
import { AdminAddEventPage } from './pages/AdminAddEventPage';
import { AdminResourcesPage } from './pages/AdminResourcesPage';
import { AdminCategoriesPage } from './pages/AdminCategoriesPage';

// Protected Admin Route wrapper
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brutal-cream font-mono text-xs font-bold gap-3">
        <div className="w-8 h-8 border-4 border-brutal-black border-t-brutal-yellow animate-spin" />
        <span>Verifying admin permissions...</span>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Protected User Route wrapper
const ProtectedUserRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brutal-cream font-mono text-xs font-bold gap-3">
        <div className="w-8 h-8 border-4 border-brutal-black border-t-brutal-yellow animate-spin" />
        <span>Syncing academic profile...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/conference/:id" element={<ConferenceDetailPage />} />
          <Route path="/resources" element={<ResourceLibraryPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected User Profile Route */}
          <Route
            path="/profile"
            element={
              <ProtectedUserRoute>
                <ProfilePage />
              </ProtectedUserRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminDashboardPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/conferences"
            element={
              <ProtectedAdminRoute>
                <AdminConferencesPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/conferences/new"
            element={
              <ProtectedAdminRoute>
                <AdminAddEventPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/conferences/edit/:id"
            element={
              <ProtectedAdminRoute>
                <AdminAddEventPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <ProtectedAdminRoute>
                <AdminCategoriesPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/resources"
            element={
              <ProtectedAdminRoute>
                <AdminResourcesPage />
              </ProtectedAdminRoute>
            }
          />

          {/* Fallback 404 Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
