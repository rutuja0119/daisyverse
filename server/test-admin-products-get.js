const http = require('http');

// Admin token (you'll need to get this from a successful login)
const ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTQ5OWJkODQ2M2VkYzRmZGY1MTc2NjYiLCJlbWFpbCI6ImFkbWluQGRhaXN5dmVyc2UuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzY2NDM1Njc1LCJleHAiOjE3NjY1MjIwNzV9.rhtjPwCQt_vYuXZ769Q6v4RibTjqJ5hZEnX9J1_X_EE';

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

req.end();