const axios = require('axios');

// Test script to verify database functionality
async function testChatApp() {
  console.log('🧪 Testing Chat Application...\n');

  try {
    // Test 1: Check if backend is running
    console.log('1️⃣  Testing backend connectivity...');
    const healthResponse = await axios.get('http://localhost:5000/health');
    console.log('✅ Backend is running:', healthResponse.data);

    // Test 2: Check if frontend is running
    console.log('\n2️⃣  Testing frontend connectivity...');
    const frontendResponse = await axios.get('http://localhost:3000');
    console.log('✅ Frontend is running (Status:', frontendResponse.status, ')');

    // Test 3: Try to register a test user
    console.log('\n3️⃣  Testing user registration...');
    try {
      const registerResponse = await axios.post('http://localhost:5000/api/auth/register', {
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpass123'
      });
      console.log('✅ User registered successfully');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('ℹ️  User already exists (this is expected)');
      } else {
        console.log('❌ User registration failed:', error.message);
      }
    }

    // Test 4: Try to login
    console.log('\n4️⃣  Testing user login...');
    try {
      const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'test@example.com',
        password: 'testpass123'
      });
      console.log('✅ Login successful');
      const token = loginResponse.data.token;
      console.log('🔑 Token received:', token ? 'Yes' : 'No');
    } catch (error) {
      console.log('❌ Login failed:', error.response?.data?.message || error.message);
    }

    // Test 5: Query database for users (this is what you requested)
    console.log('\n5️⃣  Querying database for users...');
    try {
      const usersResponse = await axios.get('http://localhost:5000/api/users');
      console.log('✅ Users query successful');
      console.log('📊 Users in database:', usersResponse.data.length);
      usersResponse.data.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.username} (${user.email}) - Online: ${user.isOnline}`);
      });
    } catch (error) {
      console.log('❌ Users query failed:', error.response?.data?.message || error.message);
    }

    // Test 6: Query database for messages (this is what you requested)
    console.log('\n6️⃣  Querying database for messages...');
    try {
      const messagesResponse = await axios.get('http://localhost:5000/api/messages');
      console.log('✅ Messages query successful');
      console.log('📨 Messages in database:', messagesResponse.data.length);
      messagesResponse.data.forEach((message, index) => {
        console.log(`   ${index + 1}. [${new Date(message.timestamp).toLocaleTimeString()}] ${message.user}: ${message.text}`);
      });
    } catch (error) {
      console.log('❌ Messages query failed:', error.response?.data?.message || error.message);
    }

    console.log('\n🎉 Chat Application Test Complete!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure both backend (port 5000) and frontend (port 3000) are running');
    }
  }
}

testChatApp();
