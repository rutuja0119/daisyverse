const http = require('http');
const FormData = require('form-data');
const fs = require('fs');

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
  port: 3000,
  path: '/api/admin/products',
  method: 'POST',
  headers: form.getHeaders()
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