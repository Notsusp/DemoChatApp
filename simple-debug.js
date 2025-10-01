const axios = require('axios');

// Simple test to debug the authentication issue
async function debugAuth() {
  console.log('🔍 Debugging Authentication Issue...\n');

  try {
    // Test 1: Try to register a new user first
    console.log('1️⃣  Testing user registration...');
    try {
      const registerResponse = await axios.post('http://localhost:5000/api/auth/register', {
        username: 'debuguser',
        email: 'debug@example.com',
        password: 'debugpass123'
      });
      console.log('✅ User registered successfully');
      console.log('🔑 Registration token:', registerResponse.data.token ? 'Received' : 'Missing');
    } catch (error) {
      console.log('❌ Registration failed:', error.response?.data?.message || error.message);
    }

    // Test 2: Try to login with the new user
    console.log('\n2️⃣  Testing login with registered user...');
    try {
      const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'debug@example.com',
        password: 'debugpass123'
      });
      console.log('✅ Login successful');
      const token = loginResponse.data.token;
      console.log('🔑 Token received');

      // Test 3: Use the token to query users
      if (token) {
        console.log('\n3️⃣  Testing authenticated user query...');
        const usersResponse = await axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Users query successful');
        console.log('📊 Users found:', usersResponse.data.length);
      }

    } catch (error) {
      console.log('❌ Login failed:', error.response?.data?.message || error.message);
    }

    // Test 4: Try the demo user again
    console.log('\n4️⃣  Testing demo user login...');
    try {
      const demoLoginResponse = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'user1@example.com',
        password: 'demo-password'
      });
      console.log('✅ Demo login successful');
    } catch (error) {
      console.log('❌ Demo login failed:', error.response?.data?.message || error.message);

      // Let's check what happens if we try to find the demo user
      console.log('\n5️⃣  Checking if demo user exists...');
      try {
        const existingUserResponse = await axios.post('http://localhost:5000/api/auth/login', {
          email: 'user1@example.com',
          password: 'demo-password'
        });
      } catch (findError) {
        console.log('ℹ️  Demo user status:', findError.response?.status);
      }
    }

  } catch (error) {
    console.error('❌ Debug test failed:', error.message);
  }
}

debugAuth();
