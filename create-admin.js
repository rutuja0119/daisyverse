const mongoose = require('mongoose');
const User = require('./server/models/User');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  try {
    await mongoose.connect('mongodb://localhost:27017/daisyverse');
    
    const existingAdmin = await User.findOne({ email: 'admin@daisyverse.com', role: 'admin' });
    if (existingAdmin) {
      console.log('Admin already exists');
      return;
    }
    
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      name: 'Admin User',
      email: 'admin@daisyverse.com',
      password: hashedPassword,
      role: 'admin'
    });
    
    await admin.save();
    console.log('Admin created successfully');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();