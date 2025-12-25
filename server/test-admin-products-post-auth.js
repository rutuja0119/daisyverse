const http = require('http');
const FormData = require('form-data');
const fs = require('fs');

// Admin token (you'll need to get this from a successful login)
const ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTQ5OWJkODQ2M2VkYzRmZGY1MTc2NjYiLCJlbWFpbCI6ImFkbWluQGRhaXN5dmVyc2UuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzY2NDM1Njc1LCJleHAiOjE3NjY1MjIwNzV9.rhtjPwCQt_vYuXZ769Q6v4RibTjqJ5hZEnX9J1_X_EE';

// Test data
const productData = {
  name: 'Test Product',
  description: 'Test description',
  price: 99.99,
  category: 'earrings',
  size: 'medium',
  color: 'gold',
  quantity: 10,
  stock: 10,
  features: {
    returnPolicy: '30 days return policy',
    shipping: 'Free shipping on orders over $100',
    material: 'Gold plated',
    careInstructions: 'Keep away from water'
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
    'Authorization': `Bearer ${ADMIN_TOKEN}`
  }
};

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`Response: ${data}`);
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

form.pipe(req);