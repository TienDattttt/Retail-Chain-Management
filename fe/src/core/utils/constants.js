// Import các constants từ environment config
import {
  API_ENDPOINTS,
  HTTP_STATUS,
  USER_ROLES,
  PRODUCT_STATUS,
  INVOICE_STATUS,
  PAYMENT_METHODS,
  PAGINATION,
  DATE_FORMATS,
  STORAGE_KEYS,
} from '../config/environment';

// Re-export để sử dụng ở nơi khác
export {
  API_ENDPOINTS,
  HTTP_STATUS,
  USER_ROLES,
  PRODUCT_STATUS,
  INVOICE_STATUS,
  PAYMENT_METHODS,
  PAGINATION,
  DATE_FORMATS,
  STORAGE_KEYS,
};

// UI Constants
export const UI_CONSTANTS = {
  // Loading states
  LOADING_STATES: {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error',
  },
  
  // Toast types
  TOAST_TYPES: {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
  },
  
  // Modal sizes
  MODAL_SIZES: {
    SMALL: 'sm',
    MEDIUM: 'md',
    LARGE: 'lg',
    EXTRA_LARGE: 'xl',
  },
  
  // Table page sizes
  TABLE_PAGE_SIZES: [10, 20, 50, 100],
  
  // File upload
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  
  // Debounce delays
  SEARCH_DEBOUNCE_DELAY: 300,
  AUTO_SAVE_DELAY: 1000,
};

// Validation Constants
export const VALIDATION = {
  // Field lengths
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 50,
  MAX_NAME_LENGTH: 200,
  MAX_CODE_LENGTH: 50,
  MAX_DESCRIPTION_LENGTH: 500,
  
  // Patterns
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_PATTERN: /^[0-9+\-\s()]+$/,
  BARCODE_PATTERN: /^[0-9A-Za-z\-_]+$/,
  
  // Number ranges
  MIN_PRICE: 0,
  MAX_PRICE: 999999999.99,
  MIN_QUANTITY: 0,
  MAX_QUANTITY: 999999,
};

// Error Messages
export const ERROR_MESSAGES = {
  // Network errors
  NETWORK_ERROR: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.',
  TIMEOUT_ERROR: 'Yêu cầu quá thời gian chờ. Vui lòng thử lại.',
  
  // Authentication errors
  INVALID_CREDENTIALS: 'Tên đăng nhập hoặc mật khẩu không đúng.',
  TOKEN_EXPIRED: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  ACCESS_DENIED: 'Bạn không có quyền truy cập chức năng này.',
  
  // Validation errors
  REQUIRED_FIELD: 'Trường này là bắt buộc.',
  INVALID_EMAIL: 'Email không hợp lệ.',
  INVALID_PHONE: 'Số điện thoại không hợp lệ.',
  PASSWORD_TOO_SHORT: `Mật khẩu phải có ít nhất ${VALIDATION.MIN_PASSWORD_LENGTH} ký tự.`,
  INVALID_PRICE: 'Giá phải là số dương.',
  INVALID_QUANTITY: 'Số lượng phải là số nguyên dương.',
  
  // File upload errors
  FILE_TOO_LARGE: `Kích thước file không được vượt quá ${UI_CONSTANTS.MAX_FILE_SIZE / 1024 / 1024}MB.`,
  INVALID_FILE_TYPE: 'Loại file không được hỗ trợ.',
  
  // Generic errors
  SOMETHING_WENT_WRONG: 'Có lỗi xảy ra. Vui lòng thử lại.',
  DATA_NOT_FOUND: 'Không tìm thấy dữ liệu.',
  OPERATION_FAILED: 'Thao tác không thành công.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  // CRUD operations
  CREATE_SUCCESS: 'Tạo mới thành công!',
  UPDATE_SUCCESS: 'Cập nhật thành công!',
  DELETE_SUCCESS: 'Xóa thành công!',
  
  // Authentication
  LOGIN_SUCCESS: 'Đăng nhập thành công!',
  LOGOUT_SUCCESS: 'Đăng xuất thành công!',
  
  // File operations
  UPLOAD_SUCCESS: 'Tải lên thành công!',
  EXPORT_SUCCESS: 'Xuất dữ liệu thành công!',
  
  // Generic
  OPERATION_SUCCESS: 'Thao tác thành công!',
  SAVE_SUCCESS: 'Lưu thành công!',
};

// Menu Items Configuration
export const MENU_ITEMS = [
  {
    key: 'dashboard',
    title: 'Dashboard',
    icon: 'home',
    path: '/',
    roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.STAFF],
  },
  {
    key: 'products',
    title: 'Sản phẩm',
    icon: 'package',
    roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.STAFF],
    children: [
      {
        key: 'product-list',
        title: 'Danh sách sản phẩm',
        path: '/product-list',
      },
      {
        key: 'add-product',
        title: 'Thêm sản phẩm',
        path: '/add-product',
        roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER],
      },
      {
        key: 'category-list',
        title: 'Danh mục',
        path: '/category-list',
      },
    ],
  },
  {
    key: 'sales',
    title: 'Bán hàng',
    icon: 'shopping-cart',
    roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.STAFF],
    children: [
      {
        key: 'pos',
        title: 'POS Bán hàng',
        path: '/pos',
      },
      {
        key: 'sales-list',
        title: 'Danh sách hóa đơn',
        path: '/sales-list',
      },
      {
        key: 'quotation-list',
        title: 'Báo giá',
        path: '/quotation-list',
      },
    ],
  },
  {
    key: 'purchases',
    title: 'Mua hàng',
    icon: 'truck',
    roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER],
    children: [
      {
        key: 'purchase-list',
        title: 'Đơn mua hàng',
        path: '/purchase-list',
      },
      {
        key: 'suppliers',
        title: 'Nhà cung cấp',
        path: '/suppliers',
      },
    ],
  },
  {
    key: 'inventory',
    title: 'Kho hàng',
    icon: 'archive',
    roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.STAFF],
    children: [
      {
        key: 'manage-stocks',
        title: 'Quản lý tồn kho',
        path: '/manage-stocks',
      },
      {
        key: 'stock-transfer',
        title: 'Chuyển kho',
        path: '/stock-transfer',
      },
      {
        key: 'stock-adjustment',
        title: 'Kiểm kê',
        path: '/stock-adjustment',
      },
    ],
  },
  {
    key: 'customers',
    title: 'Khách hàng',
    icon: 'users',
    path: '/customers',
    roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.STAFF],
  },
  {
    key: 'reports',
    title: 'Báo cáo',
    icon: 'bar-chart-2',
    roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER],
    children: [
      {
        key: 'sales-report',
        title: 'Báo cáo bán hàng',
        path: '/sales-report',
      },
      {
        key: 'inventory-report',
        title: 'Báo cáo tồn kho',
        path: '/inventory-report',
      },
      {
        key: 'customer-report',
        title: 'Báo cáo khách hàng',
        path: '/customer-report',
      },
    ],
  },
  {
    key: 'settings',
    title: 'Cài đặt',
    icon: 'settings',
    roles: [USER_ROLES.ADMIN],
    children: [
      {
        key: 'users',
        title: 'Quản lý người dùng',
        path: '/users',
      },
      {
        key: 'roles-permissions',
        title: 'Phân quyền',
        path: '/roles-permissions',
      },
      {
        key: 'general-settings',
        title: 'Cài đặt chung',
        path: '/general-settings',
      },
    ],
  },
];

export default {
  UI_CONSTANTS,
  VALIDATION,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  MENU_ITEMS,
};