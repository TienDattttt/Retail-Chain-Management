import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import ImageWithBasePath from "../../../core/img/imagewithbasebath";
import { all_routes } from "../../../Router/all_routes";
import { loginUser, clearError, selectAuth, selectIsAuthenticated } from "../../../core/redux/authSlice";
import { UI_CONSTANTS, ERROR_MESSAGES } from "../../../core/utils/constants";

const Signin = () => {
  const route = all_routes;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux state
  const { loading, error } = useSelector(selectAuth);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  // Local state
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.role === 3) {
        navigate('/staff/pos');
      } else {
        navigate(route.dashboard);
      }
    }
  }, [isAuthenticated, navigate, route.dashboard]);

  // Clear errors when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.userName.trim()) {
      errors.userName = ERROR_MESSAGES.REQUIRED_FIELD;
    }
    
    if (!formData.password.trim()) {
      errors.password = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (formData.password.length < 6) {
      errors.password = ERROR_MESSAGES.PASSWORD_TOO_SHORT;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const result = await dispatch(loginUser({
        userName: formData.userName,
        password: formData.password,
      })).unwrap();
      
      // Redirect based on user role
      if (result.role === 3) {
        // Staff - redirect to POS
        navigate('/staff/pos');
      } else {
        // Admin/Manager - redirect to dashboard
        navigate(route.dashboard);
      }
      
    } catch (error) {
      console.error('Login failed:', error);
      // Error is handled by Redux state
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="main-wrapper">
      <div className="account-content">
        <div className="login-wrapper bg-img">
          <div className="login-content">
            <form onSubmit={handleSubmit}>
              <div className="login-userset">
                <div className="login-logo logo-normal">
                  <ImageWithBasePath src="assets/img/logo.png" alt="img" />
                </div>
                <Link to={route.dashboard} className="login-logo logo-white">
                  <ImageWithBasePath src="assets/img/logo-white.png" alt />
                </Link>
                <div className="login-userheading">
                  <h3>Đăng Nhập</h3>
                  <h4>
                    Truy cập Hệ thống Quản lý Bán lẻ bằng tên đăng nhập và mật khẩu của bạn.
                  </h4>
                </div>

                {/* Error Alert */}
                {error && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <strong>Đăng nhập thất bại!</strong> {error}
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => dispatch(clearError())}
                      aria-label="Close"
                    ></button>
                  </div>
                )}

                <div className="form-login mb-3">
                  <label className="form-label">Tên đăng nhập</label>
                  <div className="form-addons">
                    <input 
                      type="text" 
                      name="userName"
                      className={`form-control ${validationErrors.userName ? 'is-invalid' : ''}`}
                      value={formData.userName}
                      onChange={handleInputChange}
                      placeholder="Nhập tên đăng nhập"
                      disabled={loading === UI_CONSTANTS.LOADING_STATES.LOADING}
                    />
                    <ImageWithBasePath
                      src="assets/img/icons/mail.svg"
                      alt="img"
                    />
                    {validationErrors.userName && (
                      <div className="invalid-feedback">
                        {validationErrors.userName}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="form-login mb-3">
                  <label className="form-label">Mật khẩu</label>
                  <div className="pass-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className={`pass-input form-control ${validationErrors.password ? 'is-invalid' : ''}`}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Nhập mật khẩu"
                      disabled={loading === UI_CONSTANTS.LOADING_STATES.LOADING}
                    />
                    <span 
                      className={`fas toggle-password ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}
                      onClick={togglePasswordVisibility}
                      style={{ cursor: 'pointer' }}
                    />
                    {validationErrors.password && (
                      <div className="invalid-feedback">
                        {validationErrors.password}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="form-login authentication-check">
                  <div className="row">
                    <div className="col-12 d-flex align-items-center justify-content-between">
                      <div className="custom-control custom-checkbox">
                        <label className="checkboxs ps-4 mb-0 pb-0 line-height-1">
                          <input 
                            type="checkbox" 
                            name="rememberMe"
                            className="form-control"
                            checked={formData.rememberMe}
                            onChange={handleInputChange}
                            disabled={loading === UI_CONSTANTS.LOADING_STATES.LOADING}
                          />
                          <span className="checkmarks" />
                          Ghi nhớ đăng nhập
                        </label>
                      </div>
                      <div className="text-end">
                        <Link className="forgot-link" to={route.forgotPassword}>
                          Quên mật khẩu?
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="form-login">
                  <button 
                    type="submit" 
                    className="btn btn-login"
                    disabled={loading === UI_CONSTANTS.LOADING_STATES.LOADING}
                  >
                    {loading === UI_CONSTANTS.LOADING_STATES.LOADING ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Đang đăng nhập...
                      </>
                    ) : (
                      'Đăng Nhập'
                    )}
                  </button>
                </div>
                <div className="signinform">
                  <h4>
                    Chưa có tài khoản?
                    <Link to={route.register} className="hover-a">
                      {" "}
                      Đăng ký ngay
                    </Link>
                  </h4>
                </div>
                
                <div className="my-4 d-flex justify-content-center align-items-center copyright-text">
                  <p>Copyright © 2024 Retail Management System. All rights reserved</p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
