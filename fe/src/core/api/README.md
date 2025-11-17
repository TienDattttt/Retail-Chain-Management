# API Integration Infrastructure

## Overview

This directory contains the API integration infrastructure for connecting the React frontend with the Spring Boot backend.

## Files Structure

```
core/
├── api/
│   ├── apiClient.js          # Main axios client with interceptors
│   ├── testConnection.js     # API connection testing utilities
│   └── README.md            # This file
├── config/
│   └── environment.js       # Environment configuration and constants
├── utils/
│   ├── constants.js         # Application constants and enums
│   └── helpers.js           # Utility functions
└── components/
    └── ApiStatus.jsx        # Development API status indicator
```

## Configuration

### Environment Variables (.env)
```
REACT_APP_API_URL=http://localhost:8081/api
REACT_APP_UPLOAD_URL=http://localhost:8081/api/upload
REACT_APP_WEBSOCKET_URL=ws://localhost:8081/ws
```

### Proxy Configuration (setupProxy.js)
- Proxies `/api` requests to `http://localhost:8081`
- Proxies `/ws` WebSocket connections to `http://localhost:8081`
- Includes error handling and logging

## Features

### API Client (apiClient.js)
- ✅ Axios instance with base URL configuration
- ✅ Request interceptor for JWT token injection
- ✅ Response interceptor for error handling
- ✅ Automatic token refresh on 401 errors
- ✅ Development logging
- ✅ Helper functions for FormData and query strings

### Environment Configuration
- ✅ Multi-environment support (development, staging, production)
- ✅ API endpoints constants
- ✅ HTTP status codes
- ✅ User roles and permissions
- ✅ Validation rules and error messages

### Development Tools
- ✅ API connection testing utilities
- ✅ Real-time API status indicator (development only)
- ✅ Proxy configuration for CORS handling
- ✅ Request/response logging

## Usage

### Basic API Call
```javascript
import apiClient from '../core/api/apiClient';

// GET request
const products = await apiClient.get('/products');

// POST request with data
const newProduct = await apiClient.post('/products/upsert', productData);

// File upload
const formData = createFormData({ file: fileObject });
const response = await apiClient.post('/products/1/image', formData);
```

### Using Constants
```javascript
import { API_ENDPOINTS, HTTP_STATUS, USER_ROLES } from '../core/utils/constants';

// API endpoints
const url = API_ENDPOINTS.PRODUCTS.BASE; // '/products'

// Status codes
if (response.status === HTTP_STATUS.OK) { ... }

// User roles
if (hasRole(USER_ROLES.ADMIN)) { ... }
```

### Error Handling
```javascript
try {
  const response = await apiClient.get('/products');
  // Handle success
} catch (error) {
  if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
    // Handle unauthorized
  } else if (error.response?.status === HTTP_STATUS.FORBIDDEN) {
    // Handle forbidden
  } else {
    // Handle other errors
  }
}
```

## Testing

### Connection Test
```javascript
import { runConnectionTests } from '../core/api/testConnection';

// Run all connection tests
const results = await runConnectionTests();
```

### Manual Testing
- Backend running on: http://localhost:8081
- API base URL: http://localhost:8081/api
- Test endpoint: http://localhost:8081/api/products

## Status

✅ **COMPLETED**: API integration infrastructure setup
- API client configuration with axios ✅
- Request/response interceptors for JWT handling ✅
- Environment configuration for different stages ✅
- Proxy setup for development ✅
- Testing utilities ✅
- Development tools ✅

## Next Steps

Ready for Task 2: Implement authentication system
- Authentication service layer
- Login page component
- Redux authentication state
- Route protection