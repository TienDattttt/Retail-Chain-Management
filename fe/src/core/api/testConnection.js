import apiClient from './apiClient';

/**
 * Test API connection
 * @returns {Promise<boolean>} True if connection successful
 */
export const testApiConnection = async () => {
  try {
    console.log('🔍 Testing API connection...');
    
    // Test basic connection với endpoint health check hoặc status
    const response = await apiClient.get('/status');
    
    console.log('✅ API connection successful:', response.data);
    return true;
  } catch (error) {
    console.error('❌ API connection failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('Backend server is not running on http://localhost:8080');
    } else if (error.response) {
      console.error('Server responded with error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('No response received from server');
    }
    
    return false;
  }
};

/**
 * Test authentication endpoint
 * @returns {Promise<boolean>} True if auth endpoint accessible
 */
export const testAuthEndpoint = async () => {
  try {
    console.log('🔍 Testing auth endpoint...');
    
    // Test với credentials không hợp lệ để kiểm tra endpoint có hoạt động không
    await apiClient.post('/auth/login', {
      username: 'test',
      password: 'test'
    });
    
    return true;
  } catch (error) {
    // Nếu lỗi 401 (Unauthorized) thì endpoint hoạt động bình thường
    if (error.response && error.response.status === 401) {
      console.log('✅ Auth endpoint is working (401 Unauthorized as expected)');
      return true;
    }
    
    console.error('❌ Auth endpoint test failed:', error.message);
    return false;
  }
};

/**
 * Run all connection tests
 */
export const runConnectionTests = async () => {
  console.log('🚀 Running API connection tests...');
  
  const results = {
    basicConnection: await testApiConnection(),
    authEndpoint: await testAuthEndpoint(),
  };
  
  console.log('📊 Test Results:', results);
  
  const allPassed = Object.values(results).every(result => result === true);
  
  if (allPassed) {
    console.log('🎉 All API tests passed! Backend is ready.');
  } else {
    console.log('⚠️ Some API tests failed. Please check backend server.');
  }
  
  return results;
};

export default {
  testApiConnection,
  testAuthEndpoint,
  runConnectionTests,
};