require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Test route working' });
});

// Load admin product routes
const adminProductRoutes = require('./routes/admin-products');
app.use('/api/admin', adminProductRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});