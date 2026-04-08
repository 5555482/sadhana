import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';

// Layout components
import { AppLayout } from '../components/layout/AppLayout.tsx';
import { AuthLayout } from '../components/layout/AuthLayout.tsx';

// Page components
import { HomePage } from '../pages/HomePage.tsx';
import { LoginPage } from '../pages/auth/LoginPage.tsx';
import { RegisterPage } from '../pages/auth/RegisterPage.tsx';
import { PasswordResetPage } from '../pages/auth/PasswordResetPage.tsx';
import { UserPracticesPage } from '../pages/practices/UserPracticesPage.tsx';
import { ChartsPage } from '../pages/charts/ChartsPage.tsx';
import { YatrasPage } from '../pages/yatras/YatrasPage.tsx';
import { SettingsPage } from '../pages/settings/SettingsPage.tsx';
import { HelpPage } from '../pages/HelpPage.tsx';
import { NotFoundPage } from '../pages/NotFoundPage.tsx';

// Protected Route component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public Route component (redirects to home if already authenticated)
interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <AuthLayout>
              <RegisterPage />
            </AuthLayout>
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <PublicRoute>
            <AuthLayout>
              <PasswordResetPage />
            </AuthLayout>
          </PublicRoute>
        }
      />
      <Route
        path="/help"
        element={<HelpPage />}
      />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout>
              <HomePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/practices"
        element={
          <ProtectedRoute>
            <AppLayout>
              <UserPracticesPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/charts"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ChartsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/yatras"
        element={
          <ProtectedRoute>
            <AppLayout>
              <YatrasPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings/*"
        element={
          <ProtectedRoute>
            <AppLayout>
              <SettingsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* 404 route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};