const jwt = require('jsonwebtoken');

// Token from our successful test
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTQ5OWJkODQ2M2VkYzRmZGY1MTc2NjYiLCJlbWFpbCI6ImFkbWluQGRhaXN5dmVyc2UuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzY2NDM2NTk5LCJleHAiOjE3NjY1MjI5OTl9.z9DHdPWHTKTURGnpU7xELwT9WQxsChNDYhP2cz14TxQ';

try {
  // Decode without verification to see the payload
  const decoded = jwt.decode(token);
  console.log('Decoded JWT payload:');
  console.log(JSON.stringify(decoded, null, 2));
  
  // Check if role field exists and is correct
  if (decoded.role === 'admin') {
    console.log('✅ Token contains admin role');
  } else {
    console.log('❌ Token does not contain admin role:', decoded.role);
  }
  
} catch (error) {
  console.error('Error decoding token:', error);
}