import { DATE_FORMATS, STORAGE_KEYS } from './constants';

/**
 * Format số tiền theo định dạng Việt Nam
 * @param {number} amount - Số tiền
 * @param {string} currency - Đơn vị tiền tệ (mặc định: VND)
 * @returns {string} Chuỗi số tiền đã format
 */
export const formatCurrency = (amount, currency = 'VND') => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0 ₫';
  }
  
  const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: currency === 'VND' ? 'VND' : currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  return formatter.format(amount);
};

/**
 * Format số với dấu phẩy phân cách hàng nghìn
 * @param {number} number - Số cần format
 * @returns {string} Chuỗi số đã format
 */
export const formatNumber = (number) => {
  if (number === null || number === undefined || isNaN(number)) {
    return '0';
  }
  
  return new Intl.NumberFormat('vi-VN').format(number);
};

/**
 * Format ngày tháng
 * @param {string|Date} date - Ngày cần format
 * @param {string} format - Định dạng (mặc định: DD/MM/YYYY)
 * @returns {string} Chuỗi ngày đã format
 */
export const formatDate = (date, format = DATE_FORMATS.DISPLAY) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const seconds = String(dateObj.getSeconds()).padStart(2, '0');
  
  switch (format) {
    case DATE_FORMATS.DISPLAY:
      return `${day}/${month}/${year}`;
    case DATE_FORMATS.DISPLAY_WITH_TIME:
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    case DATE_FORMATS.API:
      return `${year}-${month}-${day}`;
    case DATE_FORMATS.API_WITH_TIME:
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    default:
      return `${day}/${month}/${year}`;
  }
};

/**
 * Tính thời gian tương đối (vd: 2 giờ trước)
 * @param {string|Date} date - Ngày cần tính
 * @returns {string} Chuỗi thời gian tương đối
 */
export const getRelativeTime = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const dateObj = new Date(date);
  const diffInSeconds = Math.floor((now - dateObj) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Vừa xong';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} phút trước`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} giờ trước`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ngày trước`;
  } else {
    return formatDate(date);
  }
};

/**
 * Tạo ID ngẫu nhiên
 * @param {number} length - Độ dài ID (mặc định: 8)
 * @returns {string} ID ngẫu nhiên
 */
export const generateId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Tạo mã code tự động (vd: SP001, HD001)
 * @param {string} prefix - Tiền tố
 * @param {number} number - Số thứ tự
 * @param {number} length - Độ dài số (mặc định: 3)
 * @returns {string} Mã code
 */
export const generateCode = (prefix, number, length = 3) => {
  const paddedNumber = String(number).padStart(length, '0');
  return `${prefix}${paddedNumber}`;
};

/**
 * Debounce function
 * @param {Function} func - Function cần debounce
 * @param {number} delay - Thời gian delay (ms)
 * @returns {Function} Function đã được debounce
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Throttle function
 * @param {Function} func - Function cần throttle
 * @param {number} delay - Thời gian delay (ms)
 * @returns {Function} Function đã được throttle
 */
export const throttle = (func, delay) => {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      return func.apply(null, args);
    }
  };
};

/**
 * Deep clone object
 * @param {any} obj - Object cần clone
 * @returns {any} Object đã được clone
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    Object.keys(obj).forEach(key => {
      clonedObj[key] = deepClone(obj[key]);
    });
    return clonedObj;
  }
};

/**
 * Kiểm tra object rỗng
 * @param {object} obj - Object cần kiểm tra
 * @returns {boolean} True nếu object rỗng
 */
export const isEmpty = (obj) => {
  if (obj === null || obj === undefined) return true;
  if (typeof obj === 'string') return obj.trim().length === 0;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
};

/**
 * Capitalize first letter
 * @param {string} str - Chuỗi cần capitalize
 * @returns {string} Chuỗi đã capitalize
 */
export const capitalize = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Truncate text
 * @param {string} text - Text cần truncate
 * @param {number} maxLength - Độ dài tối đa
 * @returns {string} Text đã truncate
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || typeof text !== 'string') return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Validate email
 * @param {string} email - Email cần validate
 * @returns {boolean} True nếu email hợp lệ
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (Vietnam format)
 * @param {string} phone - Phone number cần validate
 * @returns {boolean} True nếu phone hợp lệ
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Format phone number
 * @param {string} phone - Phone number cần format
 * @returns {string} Phone number đã format
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10 && cleaned.startsWith('0')) {
    return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  } else if (cleaned.length === 11 && cleaned.startsWith('84')) {
    return '+84 ' + cleaned.substring(2).replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
  }
  
  return phone;
};

/**
 * Get file size in human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Human readable file size
 */
export const getFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Download file from URL
 * @param {string} url - File URL
 * @param {string} filename - File name
 */
export const downloadFile = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return true;
  }
};

/**
 * Get user from localStorage
 * @returns {object|null} User object or null
 */
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Get token from localStorage
 * @returns {string|null} Token or null
 */
export const getToken = () => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

/**
 * Check if user has specific role
 * @param {number} requiredRole - Required role
 * @param {object} user - User object (optional, will get from localStorage if not provided)
 * @returns {boolean} True if user has required role
 */
export const hasRole = (requiredRole, user = null) => {
  const currentUser = user || getCurrentUser();
  if (!currentUser || !currentUser.role) return false;
  
  // Admin có tất cả quyền
  if (currentUser.role === 1) return true;
  
  return currentUser.role <= requiredRole;
};

/**
 * Calculate percentage
 * @param {number} value - Current value
 * @param {number} total - Total value
 * @returns {number} Percentage
 */
export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Generate color from string (for avatars, charts, etc.)
 * @param {string} str - Input string
 * @returns {string} Hex color
 */
export const stringToColor = (str) => {
  if (!str) return '#000000';
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  
  return color;
};

export default {
  formatCurrency,
  formatNumber,
  formatDate,
  getRelativeTime,
  generateId,
  generateCode,
  debounce,
  throttle,
  deepClone,
  isEmpty,
  capitalize,
  truncateText,
  isValidEmail,
  isValidPhone,
  formatPhone,
  getFileSize,
  downloadFile,
  copyToClipboard,
  getCurrentUser,
  getToken,
  hasRole,
  calculatePercentage,
  stringToColor,
};