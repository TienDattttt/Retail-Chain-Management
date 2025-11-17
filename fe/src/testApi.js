// Simple API test script
import axios from 'axios';

const testApi = async () => {
  try {
    console.log('🔍 Testing API connection to http://localhost:8081/api...');
    
    // Test basic connection
    const response = await axios.get('http://localhost:8081/api/status');
    console.log('✅ API connection successful:', response.data);
    
    return true;
  } catch (error) {
    console.error('❌ API connection failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('Backend server is not running on http://localhost:8081');
    } else if (error.response) {
      console.error('Server responded with error:', error.response.status, error.response.data);
    }
    
    return false;
  }
};

// Run test if this file is executed directly
if (typeof window === 'undefined') {
  testApi();
}

export default testApi;