const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing MongoDB connection...');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');

if (!process.env.MONGODB_URI) {
  console.log('❌ MONGODB_URI is not set in environment variables');
  process.exit(1);
}

// Test connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000, // 10 seconds timeout
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
  
  // Test a simple query
  const User = require('./models/User');
  return User.findOne({ email: 'admin@daisyverse.com' });
})
.then(user => {
  if (user) {
    console.log('✅ Found admin user:', user.email);
    console.log('User ID:', user._id);
    console.log('Role:', user.role);
  } else {
    console.log('❌ Admin user not found');
  }
})
.catch(error => {
  console.log('❌ MongoDB connection error:', error.message);
  console.log('Error details:', error);
})
.finally(() => {
  mongoose.connection.close();
});