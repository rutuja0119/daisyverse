const express = require('express');
const app = express();

// Load all routes to see what's registered
const { router: adminRoutes } = require('./routes/admin');
const adminProductRoutes = require('./routes/admin-products');

console.log('Admin routes:');
adminRoutes.stack.forEach((middleware, index) => {
  if (middleware.route) {
    console.log(`  ${middleware.route.stack[0].method.toUpperCase()} /api/admin${middleware.route.path}`);
  }
});

console.log('\nAdmin product routes:');
adminProductRoutes.stack.forEach((middleware, index) => {
  if (middleware.route) {
    console.log(`  ${middleware.route.stack[0].method.toUpperCase()} /api/admin${middleware.route.path}`);
  }
});