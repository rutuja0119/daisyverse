const axios = require('axios');

async function testAdminLogin() {
  try {
    console.log('Testing admin login...');
    const response = await axios.post('http://localhost:5000/api/admin/login', {
      email: 'admin@daisyverse.com',
      password: 'admin123'
    });
    
    console.log('✅ Admin login successful');
    console.log('Response data:', response.data);
    
    // Store the token
    const token = response.data.token;
    console.log('Token:', token);
    
    // Test the admin products endpoint with the new token
    console.log('\nTesting admin products with new token...');
    const productsResponse = await axios.get('http://localhost:5000/api/admin/products', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Admin products request successful');
    console.log('Products count:', productsResponse.data.products.length);
    
  } catch (error) {
    console.log('❌ Admin login failed');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
}

testAdminLogin();