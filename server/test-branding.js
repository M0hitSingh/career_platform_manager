import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Test credentials (use existing account or create new one)
const testEmail = 'test@example.com';
const testPassword = 'password123';

let authToken = '';
let companyId = '';

async function testBrandingEndpoints() {
  try {
    console.log('🧪 Testing Company Branding API Endpoints\n');

    // Step 1: Login
    console.log('1️⃣ Logging in...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: testEmail,
      password: testPassword
    });
    
    authToken = loginResponse.data.token;
    companyId = loginResponse.data.user.companyId;
    console.log('✅ Login successful');
    console.log(`   Company ID: ${companyId}\n`);

    // Step 2: Update branding colors
    console.log('2️⃣ Updating branding colors...');
    const brandingResponse = await axios.patch(
      `${API_URL}/companies/${companyId}/branding`,
      {
        primaryColor: '#FF5733',
        secondaryColor: '#33FF57',
        buttonColor: '#3357FF',
        textColor: '#000000',
        backgroundColor: '#FFFFFF'
      },
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    
    console.log('✅ Branding updated successfully');
    console.log('   Updated branding:', brandingResponse.data.branding);
    console.log('');

    // Step 3: Update logo
    console.log('3️⃣ Updating company logo...');
    const logoResponse = await axios.post(
      `${API_URL}/companies/${companyId}/logo`,
      {
        logo: 'https://example.com/logo.png'
      },
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    
    console.log('✅ Logo updated successfully');
    console.log(`   Logo URL: ${logoResponse.data.logo}\n`);

    // Step 4: Test authorization (try to update another company's branding)
    console.log('4️⃣ Testing authorization (should fail)...');
    try {
      await axios.patch(
        `${API_URL}/companies/000000000000000000000000/branding`,
        { primaryColor: '#FF0000' },
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );
      console.log('❌ Authorization test failed - should have been denied');
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log('✅ Authorization working correctly - access denied');
      } else {
        console.log('⚠️ Unexpected error:', error.message);
      }
    }
    console.log('');

    // Step 5: Test invalid hex color
    console.log('5️⃣ Testing invalid hex color validation...');
    try {
      await axios.patch(
        `${API_URL}/companies/${companyId}/branding`,
        { primaryColor: 'invalid-color' },
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );
      console.log('❌ Validation test failed - should have rejected invalid color');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Validation working correctly - invalid color rejected');
      } else {
        console.log('⚠️ Unexpected error:', error.message);
      }
    }

    console.log('\n✨ All tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Run tests
testBrandingEndpoints();
