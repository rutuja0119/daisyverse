require('dotenv').config();
const jwt = require('jsonwebtoken');

// Test the authentication middleware logic
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTQ5OWJkODQ2M2VkYzRmZGY1MTc2NjYiLCJlbWFpbCI6ImFkbWluQGRhaXN5dmVyc2UuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzY2NDM2NTk5LCJleHAiOjE3NjY1MjI5OTl9.z9DHdPWHTKTURGnpU7xELwT9WQxsChNDYhP2cz14TxQ';

// Check JWT_SECRET
const jwtSecret = process.env.JWT_SECRET;
console.log('JWT_SECRET from env:', jwtSecret);

if (!jwtSecret) {
  console.log('❌ JWT_SECRET is not set in environment variables');
  process.exit(1);
}

// Test token verification
jwt.verify(token, jwtSecret, (err, user) => {
  if (err) {
    console.log('❌ Token verification failed:', err.message);
    return;
  }
  
  console.log('✅ Token verification successful');
  console.log('User data:', user);
  
  // Check role
  if (user.role !== 'admin') {
    console.log('❌ User role is not admin:', user.role);
  } else {
    console.log('✅ User role is admin');
  }
});