import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectUser, selectIsAuthenticated, logoutUser } from '../redux/authSlice';
import { all_routes } from '../../Router/all_routes';
import ImageWithBasePath from '../img/imagewithbasebath';

/**
 * UserProfile Component
 * Displays user information and logout functionality in header
 */
const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  const [showDropdown, setShowDropdown] = useState(false);

  // Don't render if not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate(all_routes.signin);
    } catch (error) {
      console.error('Logout failed:', error);
      // Force navigation even if logout API fails
      navigate(all_routes.signin);
    }
  };

  // Get role display name
  const getRoleDisplayName = (role) => {
    switch (role) {
      case 1:
        return 'Admin';
      case 2:
        return 'Manager';
      case 3:
        return 'Staff';
      default:
        return 'User';
    }
  };

  // Get role badge class
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 1:
        return 'badge bg-danger';
      case 2:
        return 'badge bg-warning';
      case 3:
        return 'badge bg-info';
      default:
        return 'badge bg-secondary';
    }
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (e) => {
    if (!e.target.closest('.user-profile-dropdown')) {
      setShowDropdown(false);
    }
  };

  React.useEffect(() => {
    if (showDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showDropdown]);

  return (
    <div className="dropdown user-profile-dropdown">
      <button
        className="btn btn-link dropdown-toggle d-flex align-items-center"
        type="button"
        onClick={toggleDropdown}
        style={{ textDecoration: 'none', border: 'none' }}
      >
        <div className="avatar avatar-sm me-2">
          {user.avatarUrl ? (
            <ImageWithBasePath
              src={user.avatarUrl}
              alt={user.givenName}
              className="avatar-img rounded-circle"
            />
          ) : (
            <div className="avatar-img rounded-circle bg-primary d-flex align-items-center justify-content-center">
              <span className="text-white fw-bold">
                {user.givenName ? user.givenName.charAt(0).toUpperCase() : user.userName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <div className="d-none d-md-block text-start">
          <div className="fw-semibold text-dark">{user.givenName || user.userName}</div>
          <small className="text-muted">@{user.userName}</small>
        </div>
      </button>

      {showDropdown && (
        <div className="dropdown-menu dropdown-menu-end show" style={{ minWidth: '250px' }}>
          <div className="dropdown-header">
            <div className="d-flex align-items-center">
              <div className="avatar avatar-sm me-3">
                {user.avatarUrl ? (
                  <ImageWithBasePath
                    src={user.avatarUrl}
                    alt={user.givenName}
                    className="avatar-img rounded-circle"
                  />
                ) : (
                  <div className="avatar-img rounded-circle bg-primary d-flex align-items-center justify-content-center">
                    <span className="text-white fw-bold">
                      {user.givenName ? user.givenName.charAt(0).toUpperCase() : user.userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <div className="fw-semibold">{user.givenName || user.userName}</div>
                <small className="text-muted">@{user.userName}</small>
                <div className="mt-1">
                  <span className={getRoleBadgeClass(user.role)}>
                    {getRoleDisplayName(user.role)}
                  </span>
                  {user.active ? (
                    <span className="badge bg-success ms-1">Active</span>
                  ) : (
                    <span className="badge bg-secondary ms-1">Inactive</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="dropdown-divider"></div>
          
          <button
            className="dropdown-item d-flex align-items-center"
            onClick={() => {
              setShowDropdown(false);
              navigate(all_routes.profile);
            }}
          >
            <i className="fas fa-user me-2"></i>
            My Profile
          </button>
          
          <button
            className="dropdown-item d-flex align-items-center"
            onClick={() => {
              setShowDropdown(false);
              // Navigate to settings if available
            }}
          >
            <i className="fas fa-cog me-2"></i>
            Settings
          </button>
          
          <div className="dropdown-divider"></div>
          
          <button
            className="dropdown-item d-flex align-items-center text-danger"
            onClick={handleLogout}
          >
            <i className="fas fa-sign-out-alt me-2"></i>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;