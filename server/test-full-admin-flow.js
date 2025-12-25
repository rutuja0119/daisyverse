const http = require('http');

console.log('🧪 Testing Admin Product Creation Flow...\n');

// Step 1: Login as admin
const loginData = JSON.stringify({
  email: 'admin@daisyverse.com',
  password: 'admin123'
});

const loginOptions = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/admin/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': loginData.length
  }
};

const loginReq = http.request(loginOptions, (res) => {
  console.log(`Step 1 - Login Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      if (response.token) {
        console.log('✅ Admin login successful');
        console.log(`   Token: ${response.token.substring(0, 50)}...`);
        testProductCreation(response.token);
      } else {
        console.log('❌ Login failed:', response.message);
      }
    } catch (error) {
      console.log('❌ Login response error:', data);
    }
  });
});

loginReq.on('error', (error) => {
  console.error('❌ Login request error:', error);
});

loginReq.write(loginData);
loginReq.end();

function testProductCreation(token) {
  const FormData = require('form-data');
  
  const productData = {
    name: 'Test Product - Gold Earrings',
    description: 'Beautiful gold earrings perfect for any occasion. Made with high-quality materials.',
    price: 89.99,
    category: 'earrings',
    size: 'medium',
    color: 'gold',
    quantity: 10,
    stock: 10,
    features: {
      returnPolicy: '30-day return policy',
      shipping: 'Free shipping on orders over $50',
      material: '18K gold plated brass',
      careInstructions: 'Avoid contact with water and chemicals'
    },
    specifications: {
      dimensions: {
        length: '3cm',
        width: '1cm',
        height: '0.5cm',
        weight: '15g'
      },
      materials: ['Gold plated brass', 'Hypoallergenic posts'],
      origin: 'India',
      warranty: '1-year warranty'
    },
    pricing: {
      originalPrice: 119.99,
      discountPercentage: 25,
      currency: 'USD'
    },
    availability: 'in_stock',
    tags: ['gold', 'earrings', 'elegant', 'gift'],
    sku: ''
  };
  
  const form = new FormData();
  form.append('productData', JSON.stringify(productData));
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/products',
    method: 'POST',
    headers: {
      ...form.getHeaders(),
      'Authorization': `Bearer ${token}`
    }
  };
  
  const req = http.request(options, (res) => {
    console.log(`\nStep 2 - Product Creation Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        if (res.statusCode === 201) {
          console.log('✅ Product created successfully!');
          console.log(`   Product ID: ${response.product._id}`);
          console.log(`   Name: ${response.product.name}`);
          console.log(`   SKU: ${response.product.sku}`);
          console.log(`   Price: $${response.product.price}`);
        } else {
          console.log('❌ Product creation failed:', response.message);
        }
      } catch (error) {
        console.log('❌ Response parsing error:', data);
      }
    });
  });
  
  req.on('error', (error) => {
    console.error('❌ Product creation request error:', error);
  });
  
  form.pipe(req);
}