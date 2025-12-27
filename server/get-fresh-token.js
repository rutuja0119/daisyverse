const http = require('http');

const testData = JSON.stringify({
  email: 'admin@daisyverse.com',
  password: 'admin123'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/admin/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': testData.length
  }
};

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    const response = JSON.parse(data);
    console.log('New Token:', response.token);
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(testData);
req.end();