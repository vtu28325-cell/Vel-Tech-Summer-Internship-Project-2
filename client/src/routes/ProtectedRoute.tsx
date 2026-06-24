import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ProtectedRoute wraps private pages. If user is not logged in, redirects to /login.
// Usage in router: <Route element={<ProtectedRoute />}> ... </Route>
const ProtectedRoute: React.FC = () => {
  const { user, isLoading } = useAuth();

  // While checking localStorage, show nothing (prevents flash of login page)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  // If no user is logged in, redirect to login page
  // <Outlet /> renders whatever child route matched — the actual page component
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
