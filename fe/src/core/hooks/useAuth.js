import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import {
  selectAuth,
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectUserRole,
  selectIsAdmin,
  selectIsManager,
  selectIsStaff,
  loginUser,
  logoutUser,
  registerUser,
  clearError,
  initializeAuth,
} from '../redux/authSlice';
import { all_routes } from '../../Router/all_routes';
import { USER_ROLES } from '../utils/constants';

/**
 * Custom hook for authentication management
 * Provides authentication state and methods
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Selectors
  const auth = useSelector(selectAuth);
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const userRole = useSelector(selectUserRole);
  const isAdmin = useSelector(selectIsAdmin);
  const isManager = useSelector(selectIsManager);
  const isStaff = useSelector(selectIsStaff);

  // Initialize auth state on mount
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  // Login function
  const login = useCallback(async (credentials) => {
    try {
      const result = await dispatch(loginUser(credentials)).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate(all_routes.signin);
    } catch (error) {
      console.error('Logout failed:', error);
      // Force navigation even if logout fails
      navigate(all_routes.signin);
    }
  }, [dispatch, navigate]);

  // Register function
  const register = useCallback(async (userData) => {
    try {
      const result = await dispatch(registerUser(userData)).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  // Clear error function
  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Check if user has specific role
  const hasRole = useCallback((requiredRole) => {
    if (!user || !user.role) return false;
    
    // Admin has all permissions
    if (user.role === USER_ROLES.ADMIN) return true;
    
    // Check if user role is sufficient (lower number = higher permission)
    return user.role <= requiredRole;
  }, [user]);

  // Check if user can access admin features
  const canAccessAdmin = useCallback(() => {
    return hasRole(USER_ROLES.ADMIN);
  }, [hasRole]);

  // Check if user can access manager features
  const canAccessManager = useCallback(() => {
    return hasRole(USER_ROLES.MANAGER);
  }, [hasRole]);

  // Check if user can access staff features
  const canAccessStaff = useCallback(() => {
    return hasRole(USER_ROLES.STAFF);
  }, [hasRole]);

  // Get user display name
  const getUserDisplayName = useCallback(() => {
    if (!user) return '';
    return user.givenName || user.userName || '';
  }, [user]);

  // Get user role display name
  const getUserRoleDisplayName = useCallback(() => {
    if (!user || !user.role) return '';
    
    switch (user.role) {
      case USER_ROLES.ADMIN:
        return 'Admin';
      case USER_ROLES.MANAGER:
        return 'Manager';
      case USER_ROLES.STAFF:
        return 'Staff';
      default:
        return 'User';
    }
  }, [user]);

  // Check if user is active
  const isUserActive = useCallback(() => {
    return user?.active === true;
  }, [user]);

  // Redirect to login if not authenticated
  const requireAuth = useCallback((redirectTo = all_routes.signin) => {
    if (!isAuthenticated) {
      navigate(redirectTo);
      return false;
    }
    return true;
  }, [isAuthenticated, navigate]);

  // Redirect to login if user doesn't have required role
  const requireRole = useCallback((requiredRole, redirectTo = all_routes.signin) => {
    if (!requireAuth(redirectTo)) return false;
    
    if (!hasRole(requiredRole)) {
      // Could redirect to access denied page instead
      console.warn(`Access denied. Required role: ${requiredRole}, User role: ${user?.role}`);
      return false;
    }
    
    return true;
  }, [requireAuth, hasRole, user]);

  return {
    // State
    auth,
    user,
    isAuthenticated,
    loading,
    error,
    userRole,
    isAdmin,
    isManager,
    isStaff,

    // Actions
    login,
    logout,
    register,
    clearAuthError,

    // Utilities
    hasRole,
    canAccessAdmin,
    canAccessManager,
    canAccessStaff,
    getUserDisplayName,
    getUserRoleDisplayName,
    isUserActive,
    requireAuth,
    requireRole,
  };
};

export default useAuth;