// Simple test script for authentication endpoints
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';

async function testSignup() {
  console.log('\n=== Testing Signup ===');
  try {
    const response = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
        companyName: 'Test Company'
      })
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    return data.token;
  } catch (error) {
    console.error('Signup error:', error.message);
  }
}

async function testLogin() {
  console.log('\n=== Testing Login ===');
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    return data.token;
  } catch (error) {
    console.error('Login error:', error.message);
  }
}

async function testGetCurrentUser(token) {
  console.log('\n=== Testing Get Current User ===');
  try {
    const response = await fetch(`${BASE_URL}/auth/me`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Get current user error:', error.message);
  }
}

async function testInvalidToken() {
  console.log('\n=== Testing Invalid Token ===');
  try {
    const response = await fetch(`${BASE_URL}/auth/me`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer invalid-token'
      }
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Invalid token test error:', error.message);
  }
}

async function runTests() {
  console.log('Starting authentication tests...');
  
  // Test signup
  const signupToken = await testSignup();
  
  // Wait a bit
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Test login
  const loginToken = await testLogin();
  
  // Wait a bit
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Test get current user with valid token
  if (loginToken) {
    await testGetCurrentUser(loginToken);
  }
  
  // Wait a bit
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Test invalid token
  await testInvalidToken();
  
  console.log('\n=== Tests Complete ===');
}

runTests();
