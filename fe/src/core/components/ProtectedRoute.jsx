import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { selectIsAuthenticated, selectAuthLoading, selectUser, initializeAuth } from '../redux/authSlice';
import { UI_CONSTANTS, USER_ROLES } from '../utils/constants';
import { all_routes } from '../../Router/all_routes';

/**
 * ProtectedRoute Component
 * Protects routes that require authentication and/or specific roles
 */
const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  redirectTo = all_routes.signin,
  fallback = null 
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const user = useSelector(selectUser);

  // Initialize auth state on mount
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  // Show loading spinner while checking authentication
  if (loading === UI_CONSTANTS.LOADING_STATES.LOADING) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role-based access if required
  if (requiredRole !== null && user) {
    const hasRequiredRole = checkUserRole(user.role, requiredRole);
    
    if (!hasRequiredRole) {
      // Show access denied page or fallback
      if (fallback) {
        return fallback;
      }
      
      return (
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card mt-5">
                <div className="card-body text-center">
                  <div className="mb-4">
                    <i className="fas fa-lock fa-3x text-warning"></i>
                  </div>
                  <h4 className="card-title">Access Denied</h4>
                  <p className="card-text">
                    You don&apos;t have permission to access this page.
                  </p>
                  <p className="text-muted">
                    Required role: {getRoleName(requiredRole)} | Your role: {getRoleName(user.role)}
                  </p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => window.history.back()}
                  >
                    Go Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  // User is authenticated and has required role
  return children;
};

/**
 * Check if user has required role
 * @param {number} userRole - User's role
 * @param {number} requiredRole - Required role
 * @returns {boolean} True if user has required role
 */
const checkUserRole = (userRole, requiredRole) => {
  if (!userRole) return false;
  
  // Admin (role 1) has access to everything
  if (userRole === USER_ROLES.ADMIN) return true;
  
  // Check if user role is sufficient (lower number = higher permission)
  return userRole <= requiredRole;
};

/**
 * Get role name from role number
 * @param {number} role - Role number
 * @returns {string} Role name
 */
const getRoleName = (role) => {
  switch (role) {
    case USER_ROLES.ADMIN:
      return 'Admin';
    case USER_ROLES.MANAGER:
      return 'Manager';
    case USER_ROLES.STAFF:
      return 'Staff';
    default:
      return 'Unknown';
  }
};

/**
 * Higher-order component for protecting routes
 * @param {React.Component} Component - Component to protect
 * @param {number} requiredRole - Required role (optional)
 * @returns {React.Component} Protected component
 */
export const withAuth = (Component, requiredRole = null) => {
  const WrappedComponent = (props) => (
    <ProtectedRoute requiredRole={requiredRole}>
      <Component {...props} />
    </ProtectedRoute>
  );
  WrappedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

/**
 * Admin-only route protection
 */
export const AdminRoute = ({ children, ...props }) => (
  <ProtectedRoute requiredRole={USER_ROLES.ADMIN} {...props}>
    {children}
  </ProtectedRoute>
);

/**
 * Manager-level route protection (Manager and Admin)
 */
export const ManagerRoute = ({ children, ...props }) => (
  <ProtectedRoute requiredRole={USER_ROLES.MANAGER} {...props}>
    {children}
  </ProtectedRoute>
);

/**
 * Staff-level route protection (Staff, Manager, and Admin)
 */
export const StaffRoute = ({ children, ...props }) => (
  <ProtectedRoute requiredRole={USER_ROLES.STAFF} {...props}>
    {children}
  </ProtectedRoute>
);

// PropTypes
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.number,
  redirectTo: PropTypes.string,
  fallback: PropTypes.node,
};

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

ManagerRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

StaffRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;