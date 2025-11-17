import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../api/authService';
import { UI_CONSTANTS } from '../utils/constants';

// Async thunks for authentication actions
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Registration failed';
      return rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return true;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Logout failed';
      return rejectWithValue(message);
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.refreshToken();
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Token refresh failed';
      return rejectWithValue(message);
    }
  }
);

export const getUserProfile = createAsyncThunk(
  'auth/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getProfile();
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to get profile';
      return rejectWithValue(message);
    }
  }
);

// Initial state
const initialState = {
  user: authService.getCurrentUser(),
  token: authService.getToken(),
  isAuthenticated: authService.isAuthenticated(),
  loading: UI_CONSTANTS.LOADING_STATES.IDLE,
  error: null,
  loginAttempts: 0,
  lastLoginAttempt: null,
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Clear auth state (for manual logout)
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = UI_CONSTANTS.LOADING_STATES.IDLE;
      state.error = null;
      state.loginAttempts = 0;
      state.lastLoginAttempt = null;
    },
    
    // Update user profile
    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
    
    // Reset login attempts
    resetLoginAttempts: (state) => {
      state.loginAttempts = 0;
      state.lastLoginAttempt = null;
    },
    
    // Initialize auth state from localStorage
    initializeAuth: (state) => {
      state.user = authService.getCurrentUser();
      state.token = authService.getToken();
      state.isAuthenticated = authService.isAuthenticated();
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = UI_CONSTANTS.LOADING_STATES.LOADING;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = UI_CONSTANTS.LOADING_STATES.SUCCESS;
        state.user = {
          userId: action.payload.userId,
          userName: action.payload.userName,
          givenName: action.payload.givenName,
          role: action.payload.role,
          active: action.payload.active,
          branch: action.payload.branch || null,
        };
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        state.loginAttempts = 0;
        state.lastLoginAttempt = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = UI_CONSTANTS.LOADING_STATES.ERROR;
        state.error = action.payload;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loginAttempts += 1;
        state.lastLoginAttempt = new Date().toISOString();
      })
      
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = UI_CONSTANTS.LOADING_STATES.LOADING;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = UI_CONSTANTS.LOADING_STATES.SUCCESS;
        state.user = {
          userId: action.payload.userId,
          userName: action.payload.userName,
          givenName: action.payload.givenName,
          role: action.payload.role,
          active: action.payload.active,
        };
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = UI_CONSTANTS.LOADING_STATES.ERROR;
        state.error = action.payload;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      
      // Logout cases
      .addCase(logoutUser.pending, (state) => {
        state.loading = UI_CONSTANTS.LOADING_STATES.LOADING;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = UI_CONSTANTS.LOADING_STATES.IDLE;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
        state.loginAttempts = 0;
        state.lastLoginAttempt = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = UI_CONSTANTS.LOADING_STATES.ERROR;
        state.error = action.payload;
        // Still clear auth data even if logout API fails
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      
      // Refresh token cases
      .addCase(refreshToken.pending, (state) => {
        state.loading = UI_CONSTANTS.LOADING_STATES.LOADING;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = UI_CONSTANTS.LOADING_STATES.SUCCESS;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = UI_CONSTANTS.LOADING_STATES.ERROR;
        state.error = action.payload;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      
      // Get profile cases
      .addCase(getUserProfile.pending, (state) => {
        state.loading = UI_CONSTANTS.LOADING_STATES.LOADING;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = UI_CONSTANTS.LOADING_STATES.SUCCESS;
        state.user = { ...state.user, ...action.payload };
        state.error = null;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = UI_CONSTANTS.LOADING_STATES.ERROR;
        state.error = action.payload;
      });
  },
});

// Export actions
export const {
  clearError,
  clearAuth,
  updateUserProfile,
  resetLoginAttempts,
  initializeAuth,
} = authSlice.actions;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectUserRole = (state) => state.auth.user?.role;
export const selectIsAdmin = (state) => state.auth.user?.role === 1;
export const selectIsManager = (state) => state.auth.user?.role === 1 || state.auth.user?.role === 2;
export const selectIsStaff = (state) => state.auth.user?.role <= 3;

// Export reducer
export default authSlice.reducer;