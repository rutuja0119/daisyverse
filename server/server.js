require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://rutujasalunkhe0410_db_user:L5W3r7VUSkpgIWGZ@daisyverse.vxpodne.mongodb.net/daisyverse';
const LOCAL_MONGODB_URI = process.env.LOCAL_MONGODB_URI || 'mongodb://localhost:27017/daisyverse';

// Try connecting to Atlas first, fallback to local MongoDB
async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Atlas connected successfully');
  } catch (error) {
    console.error('MongoDB Atlas connection error:', error.message);
    console.log('Attempting to connect to local MongoDB...');
    
    try {
      await mongoose.connect(LOCAL_MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Local MongoDB connected successfully');
    } catch (localError) {
      console.error('Local MongoDB connection error:', localError.message);
      console.log('Please ensure MongoDB is running locally or whitelist your IP in MongoDB Atlas');
    }
  }
}

connectToDatabase();

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Daisy Verse API' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Product routes (using cloud MongoDB)
const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);

// User routes (using cloud MongoDB)
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

// Admin routes (using cloud MongoDB)
const { router: adminRoutes } = require('./routes/admin');
app.use('/api/admin', adminRoutes);

// Admin product management routes
const adminProductRoutes = require('./routes/admin-products');
app.use('/api/admin', adminProductRoutes);

// Serve static files for uploaded images
app.use('/uploads', express.static('uploads'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});