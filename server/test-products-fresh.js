const http = require('http');

// Fresh admin token from the latest login
const ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTQ5OWJkODQ2M2VkYzRmZGY1MTc2NjYiLCJlbWFpbCI6ImFkbWluQGRhaXN5dmVyc2UuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzY2NjIwODY1LCJleHAiOjE3NjY3MDcyNjV9.czuIzPlSe2BCECkoq_K0fQ3uG_alXm1-PPszgMAYE-8';

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/admin/products',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${ADMIN_TOKEN}`
  }
};

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('Products found:', response.products ? response.products.length : 0);
      if (response.products && response.products.length > 0) {
        console.log('First product:', response.products[0].name);
      }
      console.log('Full response:', JSON.stringify(response, null, 2));
    } catch (error) {
      console.log('Response (raw):', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.end();