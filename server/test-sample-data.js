// Test script to verify sample data function works
const sampleProductData = {
  name: 'Elegant Gold Plated Necklace',
  description: 'A stunning gold-plated necklace featuring intricate floral patterns. Perfect for special occasions and everyday elegance. Made with high-quality materials and expert craftsmanship.',
  price: 149.99,
  category: 'necklace',
  size: 'medium',
  color: 'gold',
  quantity: 15,
  stock: 15,
  images: [],
  features: {
    returnPolicy: '30-day return policy with original packaging',
    shipping: 'Free shipping on orders over $100. Express delivery available.',
    material: '18K gold plated brass with anti-tarnish coating',
    careInstructions: 'Avoid contact with water, perfumes, and harsh chemicals. Store in a dry place.'
  },
  specifications: {
    dimensions: {
      length: '45cm',
      width: '2cm',
      height: '0.5cm',
      weight: '25g'
    },
    materials: ['Gold plated brass', 'Anti-tarnish coating', 'Lobster clasp'],
    origin: 'India',
    warranty: '1-year warranty against manufacturing defects'
  },
  pricing: {
    originalPrice: 199.99,
    discountPercentage: 25,
    currency: 'USD'
  },
  availability: 'in_stock',
  tags: ['gold', 'necklace', 'elegant', 'gift', 'jewelry'],
  sku: ''
};

console.log('Sample data structure:');
console.log(JSON.stringify(sampleProductData, null, 2));
console.log('\nSample data includes:');
console.log('- Product name and description');
console.log('- Price with discount (25% off $199.99 = $149.99)');
console.log('- Category, size, color, quantity, and stock');
console.log('- Detailed features (return policy, shipping, material, care)');
console.log('- Specifications with dimensions and materials');
console.log('- Pricing with original price and discount');
console.log('- Tags for better categorization');
console.log('- Empty SKU (will be auto-generated on submit)');