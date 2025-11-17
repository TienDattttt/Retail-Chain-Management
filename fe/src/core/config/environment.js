// Environment configuration cho các môi trường khác nhau

const config = {
  development: {
    API_BASE_URL: 'http://localhost:8080/api',
    UPLOAD_URL: 'http://localhost:8080/api/upload',
    WEBSOCKET_URL: 'ws://localhost:8080/ws',
    DEBUG: true,
    LOG_LEVEL: 'debug',
  },
  
  staging: {
    API_BASE_URL: 'https://staging-api.retailsystem.com/api',
    UPLOAD_URL: 'https://staging-api.retailsystem.com/api/upload',
    WEBSOCKET_URL: 'wss://staging-api.retailsystem.com/ws',
    DEBUG: true,
    LOG_LEVEL: 'info',
  },
  
  production: {
    API_BASE_URL: 'http://localhost:8081/api',
    UPLOAD_URL: 'http://localhost:8081/api/upload',
    WEBSOCKET_URL: 'ws://localhost:8081/ws',
    DEBUG: false,
    LOG_LEVEL: 'error',
  },
};

// Lấy environment hiện tại
const currentEnv = process.env.NODE_ENV || 'development';

// Export config cho environment hiện tại
const currentConfig = config[currentEnv];

// API Endpoints constants
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },
  
  // Products
  PRODUCTS: {
    BASE: '/products',
    SEARCH: '/products/search',
    BARCODE: '/products/barcode',
    CATEGORY: '/products/category',
    ATTRIBUTES: '/products/{id}/attributes',
    INVENTORIES: '/products/{id}/inventories',
    IMAGE: '/products/{id}/image',
    BULK_CREATE: '/products/bulk-create',
    BULK_UPDATE: '/products/bulk-update',
  },
  
  // Categories
  CATEGORIES: {
    BASE: '/categories',
    TREE: '/categories/tree',
  },
  
  // Customers
  CUSTOMERS: {
    BASE: '/customers',
    SEARCH: '/customers/search',
  },
  
  // Suppliers
  SUPPLIERS: {
    BASE: '/suppliers',
    SEARCH: '/suppliers/search',
  },
  
  // Voucher Campaigns
  VOUCHER_CAMPAIGNS: {
    BASE: '/voucher-campaigns',
    GENERATE_VOUCHERS: '/voucher-campaigns/{id}/generate-vouchers',
  },
  
  // Vouchers
  VOUCHERS: {
    BASE: '/vouchers',
    BY_CAMPAIGN: '/vouchers/by-campaign/{campaignId}',
  },
  
  // Branches
  BRANCHES: {
    BASE: '/branches',
  },
  


  // Invoices
  INVOICES: {
    BASE: '/invoices',
    DETAILS: '/invoices/{id}/details',
    PRINT: '/invoices/{id}/print',
  },
  
  // Purchase Orders
  PURCHASE_ORDERS: {
    BASE: '/purchase-orders',
    DETAILS: '/purchase-orders/{id}/details',
  },
  
  // Reports
  REPORTS: {
    DASHBOARD: '/reports/dashboard',
    SALES: '/reports/sales',
    INVENTORY: '/reports/inventory',
    CUSTOMERS: '/reports/customers',
    PRODUCTS: '/reports/products',
  },
  
  // Users
  USERS: {
    BASE: '/users',
    ROLES: '/users/roles',
    PERMISSIONS: '/users/permissions',
  },
  
  // Status
  STATUS: {
    BASE: '/status',
  },
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

// User Roles
export const USER_ROLES = {
  ADMIN: 1,
  MANAGER: 2,
  STAFF: 3,
};

// Product Status
export const PRODUCT_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  DELETED: 'Deleted',
};

// Invoice Status
export const INVOICE_STATUS = {
  DRAFT: 'Draft',
  PENDING: 'Pending',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

// Payment Methods
export const PAYMENT_METHODS = {
  CASH: 'CASH',
  BANK_TRANSFER: 'BANK_TRANSFER',
  MOMO: 'MOMO',
  CREDIT_CARD: 'CREDIT_CARD',
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 0,
  DEFAULT_SIZE: 20,
  MAX_SIZE: 100,
};

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_WITH_TIME: 'DD/MM/YYYY HH:mm',
  API: 'YYYY-MM-DD',
  API_WITH_TIME: 'YYYY-MM-DDTHH:mm:ss',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  REFRESH_TOKEN: 'refreshToken',
  THEME: 'theme',
  LANGUAGE: 'language',
};

export default currentConfig;