// Test script to verify frontend authentication works
// This simulates what the frontend would do

console.log('Checking localStorage tokens...');
console.log('admin-token:', localStorage.getItem('admin-token'));
console.log('daisy-token:', localStorage.getItem('daisy-token'));

// Simulate the apiClient logic
const token = localStorage.getItem('admin-token') || localStorage.getItem('daisy-token');
console.log('Token that would be used:', token);

if (token) {
  console.log('✅ Token found - authentication should work');
} else {
  console.log('❌ No token found - need to login first');
}