console.log('Current working directory:', process.cwd());
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('JWT_SECRET from process.env:', process.env.JWT_SECRET);
console.log('MONGODB_URI from process.env:', process.env.MONGODB_URI);

// Test if dotenv is working
require('dotenv').config();
console.log('After dotenv.config():');
console.log('JWT_SECRET from process.env:', process.env.JWT_SECRET);
console.log('MONGODB_URI from process.env:', process.env.MONGODB_URI);