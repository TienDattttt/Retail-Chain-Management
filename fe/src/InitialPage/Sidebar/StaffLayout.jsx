import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Header from './Header';
import { selectUser, selectIsAuthenticated } from '../../core/redux/authSlice';

const StaffLayout = ({ children }) => {
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  // Redirect if not staff (role 3)
  if (!user || user.role !== 3) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="main-wrapper">
      <Header />
      
      {/* Main Content */}
      <div className="page-wrapper">
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  );
};

StaffLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default StaffLayout;