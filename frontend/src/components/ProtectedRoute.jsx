import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Component for protecting routes based on authentication and role
const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, userRole, loading } = useContext(AuthContext);

  // Show loading state while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  // Check if user is authenticated and has the required role
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles is provided, check if user has the required role
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on role
    if (userRole === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (userRole === 'instructor') {
      return <Navigate to="/instructor/dashboard" replace />;
    } else if (userRole === 'student') {
      return <Navigate to="/student/dashboard" replace />;
    } else {
      // Fallback to login if role is unknown
      return <Navigate to="/login" replace />;
    }
  }

  // If all checks pass, render the protected route
  return <Outlet />;
};

export default ProtectedRoute;