const axios = require('axios');

// Test the admin products endpoint
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTQ5OWJkODQ2M2VkYzRmZGY1MTc2NjYiLCJlbWFpbCI6ImFkbWluQGRhaXN5dmVyc2UuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzY2NDM2NTk5LCJleHAiOjE3NjY1MjI5OTl9.z9DHdPWHTKTURGnpU7xELwT9WQxsChNDYhP2cz14TxQ';

async function testAdminProductsEndpoint() {
  try {
    console.log('Testing GET /api/admin/products...');
    const response = await axios.get('http://localhost:5000/api/admin/products', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ GET request successful');
    console.log('Response data:', response.data);
    
  } catch (error) {
    console.log('❌ GET request failed');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
  
  // Test POST request with sample data
  console.log('\nTesting POST /api/admin/products...');
  
  const formData = new FormData();
  const productData = {
    name: 'Test Product',
    description: 'Test description',
    price: 99.99,
    category: 'necklace',
    size: 'medium',
    color: 'gold',
    quantity: 10,
    stock: 10,
    images: [],
    features: {
      returnPolicy: '30-day return',
      shipping: 'Free shipping',
      material: 'Gold plated',
      careInstructions: 'Handle with care'
    },
    specifications: {
      dimensions: {
        length: '45cm',
        width: '2cm',
        height: '0.5cm',
        weight: '25g'
      },
      materials: ['Gold plated brass'],
      origin: 'India',
      warranty: '1-year warranty'
    },
    pricing: {
      originalPrice: 149.99,
      discountPercentage: 33,
      currency: 'USD'
    },
    availability: 'in_stock',
    tags: ['test', 'product'],
    sku: 'TEST-001'
  };
  
  formData.append('productData', JSON.stringify(productData));
  
  try {
    const response = await axios.post('http://localhost:5000/api/admin/products', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    
    console.log('✅ POST request successful');
    console.log('Response data:', response.data);
    
  } catch (error) {
    console.log('❌ POST request failed');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
}

testAdminProductsEndpoint();