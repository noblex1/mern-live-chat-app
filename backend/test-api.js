const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

// Test function to verify API endpoints
async function testAPI() {
  try {
    console.log('🧪 Testing API endpoints...\n');

    // Test 1: Get all users
    console.log('1. Testing GET /auth/users/all');
    try {
      const usersResponse = await axios.get(`${API_BASE}/auth/users/all`);
      console.log('✅ Users endpoint working');
      console.log(`   Found ${usersResponse.data.users.length} users\n`);
    } catch (error) {
      console.log('❌ Users endpoint failed:', error.response?.data?.message || error.message, '\n');
    }

    // Test 2: Get conversations
    console.log('2. Testing GET /messages/conversations');
    try {
      const conversationsResponse = await axios.get(`${API_BASE}/messages/conversations`);
      console.log('✅ Conversations endpoint working');
      console.log(`   Found ${conversationsResponse.data.data.length} conversations\n`);
    } catch (error) {
      console.log('❌ Conversations endpoint failed:', error.response?.data?.message || error.message, '\n');
    }

    // Test 3: Get messages for a specific user (if we have users)
    console.log('3. Testing GET /messages/:userId');
    try {
      const usersResponse = await axios.get(`${API_BASE}/auth/users/all`);
      if (usersResponse.data.users.length > 0) {
        const testUserId = usersResponse.data.users[0]._id;
        const messagesResponse = await axios.get(`${API_BASE}/messages/${testUserId}`);
        console.log('✅ Messages endpoint working');
        console.log(`   Found ${messagesResponse.data.data.messages.length} messages for user ${testUserId}\n`);
      } else {
        console.log('⚠️  No users found to test messages endpoint\n');
      }
    } catch (error) {
      console.log('❌ Messages endpoint failed:', error.response?.data?.message || error.message, '\n');
    }

    console.log('🎉 API testing completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testAPI(); 