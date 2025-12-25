const http = require('http');

// First, let's get a fresh admin token
const loginData = JSON.stringify({
  email: 'admin@daisyverse.com',
  password: 'admin123'
});

const loginOptions = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/admin/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': loginData.length
  }
};

const loginReq = http.request(loginOptions, (res) => {
  console.log(`Login Status Code: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('Login Response:', response);
      
      if (response.token) {
        console.log('\n✅ Got fresh token:', response.token);
        testProductCreation(response.token);
      } else {
        console.log('\n❌ No token received');
      }
    } catch (error) {
      console.log('Login Response (raw):', data);
    }
  });
});

loginReq.on('error', (error) => {
  console.error('Login Error:', error);
});

loginReq.write(loginData);
loginReq.end();

function testProductCreation(token) {
  const FormData = require('form-data');
  
  const productData = {
    name: 'Test Product from Script',
    description: 'This is a test product created via script',
    price: 99.99,
    category: 'earrings',
    size: 'small',
    color: 'silver',
    quantity: 5,
    stock: 5,
    features: {
      returnPolicy: '30 days return',
      shipping: 'Free shipping',
      material: 'Silver plated',
      careInstructions: 'Handle with care'
    }
  };
  
  const form = new FormData();
  form.append('productData', JSON.stringify(productData));
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/products',
    method: 'POST',
    headers: {
      ...form.getHeaders(),
      'Authorization': `Bearer ${token}`
    }
  };
  
  const req = http.request(options, (res) => {
    console.log(`\nProduct Creation Status Code: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Product Creation Response:', data);
    });
  });
  
  req.on('error', (error) => {
    console.error('Product Creation Error:', error);
  });
  
  form.pipe(req);
}