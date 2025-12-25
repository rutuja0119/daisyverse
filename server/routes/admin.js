const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find admin user
    const user = await User.findOne({ email, role: 'admin' });
    if (!user) {
      return res.status(401).json({ message: 'Admin access denied' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate admin token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Admin login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin Register (for initial setup - should be protected in production)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if admin exists
    const existingAdmin = await User.findOne({ email, role: 'admin' });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }
    
    // Create admin user
    const admin = new User({ name, email, password, role: 'admin' });
    await admin.save();
    
    // Generate token
    const token = jwt.sign(
      { userId: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      message: 'Admin created successfully',
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get admin profile
router.get('/profile', authenticateAdminToken, async (req, res) => {
  try {
    const admin = await User.findById(req.user.userId).select('-password');
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Middleware to authenticate admin token
function authenticateAdminToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    req.user = user;
    next();
  });
}

module.exports = { router, authenticateAdminToken };