import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Verifying authorization...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific roles are required and user does not have them
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to their respective authorized root dashboard
    return <Navigate to={getDefaultDashboardForRole(user.role)} replace />;
  }

  return <>{children}</>;
};

export const getDefaultDashboardForRole = (role: UserRole): string => {
  switch (role) {
    case 'PLATFORM_SUPER_ADMIN':
      return '/super-admin/dashboard';
    case 'SOCIETY_ADMIN':
      return '/admin/dashboard';
    case 'COMMITTEE_MEMBER':
      return '/committee/dashboard';
    case 'FLAT_OWNER':
      return '/resident/owner/dashboard';
    case 'TENANT':
      return '/resident/tenant/dashboard';
    case 'SECURITY_GUARD':
      return '/guard/gate';
    case 'MAINTENANCE_STAFF':
      return '/staff/tasks';
    default:
      return '/login';
  }
};
