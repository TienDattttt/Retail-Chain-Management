# Design Document

## Overview

Thiết kế tích hợp frontend React template với backend Spring Boot để tạo thành hệ thống Retail Management System hoàn chỉnh. Hệ thống sẽ cho phép quản lý sản phẩm, khách hàng, hóa đơn, tồn kho và báo cáo thông qua giao diện web hiện đại.

## Architecture

### High-Level Architecture

```
┌─────────────────┐    HTTP/REST APIs    ┌─────────────────┐
│   React Frontend│ ◄─────────────────► │ Spring Boot     │
│   (Port 3000)   │                     │ Backend         │
│                 │                     │ (Port 8080)     │
└─────────────────┘                     └─────────────────┘
                                                │
                                                ▼
                                        ┌─────────────────┐
                                        │ SQL Server      │
                                        │ Database        │
                                        └─────────────────┘
```

### Technology Stack

**Frontend:**
- React 18 với functional components và hooks
- React Router DOM 6 cho routing
- Axios cho HTTP client
- Bootstrap 5 + custom SCSS cho styling
- Antd components cho UI elements
- Chart.js/ApexCharts cho biểu đồ

**Backend:**
- Spring Boot 3.4.5 với Java 17
- Spring Security với JWT authentication
- Spring Data JPA với Hibernate
- SQL Server database
- Cloudinary cho upload ảnh
- MoMo payment integration

## Components and Interfaces

### Frontend Components Structure

```
src/
├── core/
│   ├── api/                    # API service layer
│   │   ├── apiClient.js        # Axios configuration
│   │   ├── authService.js      # Authentication APIs
│   │   ├── productService.js   # Product APIs
│   │   ├── customerService.js  # Customer APIs
│   │   ├── invoiceService.js   # Invoice APIs
│   │   └── reportService.js    # Report APIs
│   ├── redux/                  # State management
│   │   ├── store.js           # Redux store
│   │   ├── authSlice.js       # Auth state
│   │   ├── productSlice.js    # Product state
│   │   └── uiSlice.js         # UI state
│   └── utils/                  # Utility functions
│       ├── constants.js       # API endpoints, constants
│       ├── helpers.js         # Helper functions
│       └── validators.js      # Form validation
├── feature-module/
│   ├── auth/                  # Authentication pages
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── products/              # Product management
│   │   ├── ProductList.jsx
│   │   ├── AddProduct.jsx
│   │   ├── EditProduct.jsx
│   │   └── ProductDetails.jsx
│   ├── customers/             # Customer management
│   │   ├── CustomerList.jsx
│   │   └── AddCustomer.jsx
│   ├── sales/                 # Sales management
│   │   ├── InvoiceList.jsx
│   │   ├── CreateInvoice.jsx
│   │   └── POS.jsx
│   ├── inventory/             # Inventory management
│   │   ├── StockList.jsx
│   │   └── StockTransfer.jsx
│   ├── reports/               # Reports and analytics
│   │   ├── Dashboard.jsx
│   │   ├── SalesReport.jsx
│   │   └── InventoryReport.jsx
│   └── components/            # Shared components
│       ├── DataTable.jsx
│       ├── SearchBox.jsx
│       ├── ImageUpload.jsx
│       └── DateRangePicker.jsx
└── InitialPage/
    ├── Header.jsx             # Top navigation
    ├── Sidebar.jsx            # Side navigation
    └── Layout.jsx             # Main layout wrapper
```

### API Integration Layer

#### API Client Configuration

```javascript
// core/api/apiClient.js
const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor để thêm JWT token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor để handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);
```

#### Service Layer Pattern

```javascript
// core/api/productService.js
export const productService = {
  getAll: () => apiClient.get('/products'),
  getById: (id) => apiClient.get(`/products/${id}`),
  create: (data) => apiClient.post('/products/upsert', data),
  update: (data) => apiClient.post('/products/upsert', data),
  delete: (id) => apiClient.post('/products/upsert', { id, status: 'Deleted' }),
  search: (keyword) => apiClient.get(`/products/search?q=${keyword}`),
  uploadImage: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post(`/products/${id}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};
```

### State Management

#### Redux Store Structure

```javascript
// core/redux/store.js
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    products: productSlice.reducer,
    customers: customerSlice.reducer,
    invoices: invoiceSlice.reducer,
    ui: uiSlice.reducer,
  },
});
```

#### Auth State Management

```javascript
// core/redux/authSlice.js
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: false,
  },
  reducers: {
    loginStart: (state) => { state.loading = true; },
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      localStorage.setItem('token', action.payload.token);
    },
    loginFailure: (state) => {
      state.loading = false;
      state.isAuthenticated = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
});
```

## Data Models

### Frontend Data Models

#### Product Model
```javascript
const Product = {
  id: Number,
  code: String,
  name: String,
  categoryId: Number,
  categoryName: String,
  basePrice: Number,
  retailPrice: Number,
  weight: Number,
  unit: String,
  allowsSale: Boolean,
  status: String, // 'Active', 'Inactive', 'Deleted'
  description: String,
  barcode: String,
  imageUrl: String,
  createdDate: String,
  modifiedDate: String,
};
```

#### Invoice Model
```javascript
const Invoice = {
  id: Number,
  code: String,
  purchaseDate: String,
  branchId: Number,
  customerId: Number,
  customerName: String,
  total: Number,
  totalPayment: Number,
  discount: Number,
  discountRatio: Number,
  description: String,
  usingCOD: Boolean,
  status: String,
  createdBy: Number,
  details: [
    {
      productId: Number,
      productName: String,
      quantity: Number,
      unitPrice: Number,
      discount: Number,
    }
  ],
};
```

#### User Model
```javascript
const User = {
  id: Number,
  userName: String,
  givenName: String,
  email: String,
  role: Number, // 1: Admin, 2: Manager, 3: Staff
  branchId: Number,
  branchName: String,
  isActive: Boolean,
  avatarUrl: String,
};
```

### API Response Formats

#### Success Response
```javascript
{
  success: true,
  data: any,
  message: String,
  timestamp: String
}
```

#### Error Response
```javascript
{
  success: false,
  error: {
    code: String,
    message: String,
    details: String
  },
  timestamp: String
}
```

#### Paginated Response
```javascript
{
  success: true,
  data: {
    content: Array,
    totalElements: Number,
    totalPages: Number,
    size: Number,
    number: Number,
    first: Boolean,
    last: Boolean
  }
}
```

## Error Handling

### Frontend Error Handling Strategy

1. **API Error Interceptor**: Tự động handle 401 (redirect to login), 403 (show permission error)
2. **Component Level**: Try-catch blocks với user-friendly error messages
3. **Global Error Boundary**: Catch unhandled React errors
4. **Form Validation**: Client-side validation trước khi gửi API
5. **Loading States**: Show loading indicators cho async operations

### Error Display Components

```javascript
// components/ErrorBoundary.jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

## Testing Strategy

### Frontend Testing Approach

1. **Unit Tests**: Test utility functions, helpers, validators
2. **Component Tests**: Test individual React components với React Testing Library
3. **Integration Tests**: Test API service layer với mock responses
4. **E2E Tests**: Test complete user workflows với Cypress (optional)

### API Testing

1. **Service Layer Tests**: Mock axios responses để test service functions
2. **Error Handling Tests**: Test error scenarios và retry logic
3. **Authentication Tests**: Test token handling và refresh logic

### Test Structure

```
src/
├── __tests__/
│   ├── components/
│   │   ├── ProductList.test.jsx
│   │   └── DataTable.test.jsx
│   ├── services/
│   │   ├── productService.test.js
│   │   └── authService.test.js
│   └── utils/
│       ├── helpers.test.js
│       └── validators.test.js
└── __mocks__/
    ├── apiClient.js
    └── mockData.js
```

## Security Considerations

### Frontend Security Measures

1. **JWT Token Storage**: Store trong localStorage với expiration check
2. **Route Protection**: Protected routes require authentication
3. **Role-based Access**: Hide/show features based on user role
4. **Input Sanitization**: Validate và sanitize user inputs
5. **HTTPS Only**: Force HTTPS trong production
6. **CSP Headers**: Content Security Policy để prevent XSS

### Authentication Flow

```
1. User enters credentials → Login form
2. Frontend calls /api/auth/login → Backend
3. Backend validates → Returns JWT token + user info
4. Frontend stores token → localStorage
5. Frontend sets Authorization header → All subsequent requests
6. Backend validates token → Each protected endpoint
7. Token expires → Frontend redirects to login
```

## Performance Optimization

### Frontend Performance

1. **Code Splitting**: Lazy load routes và components
2. **Memoization**: React.memo cho expensive components
3. **Virtual Scrolling**: Cho large data tables
4. **Image Optimization**: Lazy loading và compression
5. **Bundle Optimization**: Tree shaking và minification

### API Performance

1. **Request Debouncing**: Cho search inputs
2. **Caching**: Cache frequently accessed data
3. **Pagination**: Load data in chunks
4. **Optimistic Updates**: Update UI trước khi API response
5. **Request Cancellation**: Cancel pending requests khi component unmount

## Deployment Architecture

### Development Environment

```
Frontend (localhost:3000) → Backend (localhost:8080) → SQL Server (localhost:1433)
```

### Production Environment

```
Frontend (Nginx) → Backend (Tomcat/Docker) → SQL Server (Cloud/On-premise)
```

### Environment Configuration

```javascript
// src/config/environment.js
const config = {
  development: {
    API_BASE_URL: 'http://localhost:8080/api',
    UPLOAD_URL: 'http://localhost:8080/api/upload',
  },
  production: {
    API_BASE_URL: 'https://api.retailsystem.com/api',
    UPLOAD_URL: 'https://api.retailsystem.com/api/upload',
  },
};

export default config[process.env.NODE_ENV || 'development'];
```