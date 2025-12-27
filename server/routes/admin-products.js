const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateAdminToken } = require('./admin');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/products';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// GET all products for admin (with filters and pagination)
router.get('/products', authenticateAdminToken, async (req, res) => {
  try {
    const { 
      category, 
      availability, 
      search, 
      page = 1, 
      limit = 20, 
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    const query = {};
    
    if (category) query.category = category;
    if (availability) query.availability = availability;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } }
      ];
    }
    
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const products = await Product.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sortOptions);
    
    const total = await Product.countDocuments(query);
    
    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      hasMore: page * limit < total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single product for admin
router.get('/products/:id', authenticateAdminToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create new product with image upload
router.post('/products', authenticateAdminToken, upload.array('images', 10), async (req, res) => {
  try {
    const productData = JSON.parse(req.body.productData);
    
    // Handle image uploads
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map(file => `/uploads/products/${file.filename}`);
    }
    
    // Generate SKU if not provided
    if (!productData.sku) {
      const timestamp = Date.now().toString().slice(-6);
      productData.sku = `PRD-${timestamp}`;
    }
    
    // Set default values
    // Note: Removed automatic availability override for consistency with PUT endpoint
    // The availability field should be set by the user, not automatically based on stock
    productData.isActive = productData.isActive !== false;
    
    const product = new Product(productData);
    await product.save();
    
    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    // Clean up uploaded files if there's an error
    if (req.files) {
      req.files.forEach(file => {
        fs.unlink(file.path, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    }
    res.status(400).json({ message: error.message });
  }
});

// PUT update product with image upload
router.put('/products/:id', authenticateAdminToken, upload.array('images', 10), async (req, res) => {
  try {
    const productData = JSON.parse(req.body.productData);
    
    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/products/${file.filename}`);
      
      // If keeping existing images, merge them
      if (productData.keepExistingImages && productData.existingImages) {
        productData.images = [...productData.existingImages, ...newImages];
      } else {
        productData.images = newImages;
      }
    }
    
    // Note: Removed automatic availability override to allow manual control
    // The availability field should be set by the user, not automatically based on stock
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      productData,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    // Clean up uploaded files if there's an error
    if (req.files) {
      req.files.forEach(file => {
        fs.unlink(file.path, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    }
    res.status(400).json({ message: error.message });
  }
});

// DELETE product
router.delete('/products/:id', authenticateAdminToken, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Clean up uploaded images
    if (product.images && product.images.length > 0) {
      product.images.forEach(imagePath => {
        const fullPath = path.join(__dirname, '..', imagePath);
        fs.unlink(fullPath, (err) => {
          if (err) console.error('Error deleting image file:', err);
        });
      });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET product categories
router.get('/categories', authenticateAdminToken, async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET product statistics
router.get('/stats', authenticateAdminToken, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    const lowStockProducts = await Product.countDocuments({ stock: { $lt: 5 }, isActive: true });
    const outOfStockProducts = await Product.countDocuments({ stock: 0, isActive: true });
    
    const categoryStats = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    const availabilityStats = await Product.aggregate([
      { $group: { _id: '$availability', count: { $sum: 1 } } }
    ]);
    
    res.json({
      totalProducts,
      activeProducts,
      lowStockProducts,
      outOfStockProducts,
      categoryStats,
      availabilityStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Bulk update product status
router.patch('/products/bulk-status', authenticateAdminToken, async (req, res) => {
  try {
    const { productIds, status } = req.body;
    
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ message: 'Product IDs array is required' });
    }
    
    const updateData = {};
    if (status === 'activate') {
      updateData.isActive = true;
    } else if (status === 'deactivate') {
      updateData.isActive = false;
    } else if (status === 'out_of_stock') {
      updateData.availability = 'out_of_stock';
    }
    
    const result = await Product.updateMany(
      { _id: { $in: productIds } },
      updateData
    );
    
    res.json({
      message: `Updated ${result.modifiedCount} products`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;