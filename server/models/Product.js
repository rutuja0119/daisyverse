const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['necklace', 'earrings', 'bracelet', 'ring', 'other']
  },
  images: [{
    type: String,
    required: true
  }],
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  // New fields for comprehensive product management
  size: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 1
  },
  features: {
    returnPolicy: {
      type: String,
      default: '30 days return policy'
    },
    shipping: {
      type: String,
      default: 'Free shipping on orders over $100'
    },
    material: {
      type: String,
      trim: true
    },
    careInstructions: {
      type: String,
      trim: true
    }
  },
  specifications: {
    dimensions: {
      length: String,
      width: String,
      height: String,
      weight: String
    },
    materials: [String],
    origin: String,
    warranty: String
  },
  pricing: {
    originalPrice: {
      type: Number,
      min: 0
    },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  availability: {
    type: String,
    enum: ['in_stock', 'out_of_stock', 'preorder', 'coming_soon'],
    default: 'in_stock'
  },
  tags: [String],
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema);