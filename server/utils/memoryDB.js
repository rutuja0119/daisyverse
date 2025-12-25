// Simple in-memory database for development
class MemoryDB {
  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.nextUserId = 1;
    this.nextProductId = 1;
  }

  // User methods
  async findUserByEmail(email) {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async findUserById(id) {
    return this.users.get(id) || null;
  }

  async createUser(userData) {
    const user = {
      id: this.nextUserId++,
      name: userData.name,
      email: userData.email,
      password: userData.password, // In real app, this should be hashed
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(user.id, user);
    return user;
  }

  // Product methods
  async getAllProducts() {
    return Array.from(this.products.values());
  }

  async findProductById(id) {
    return this.products.get(id) || null;
  }

  async createProduct(productData) {
    const product = {
      id: this.nextProductId++,
      name: productData.name,
      description: productData.description,
      price: productData.price,
      category: productData.category,
      image: productData.image,
      stock: productData.stock || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.products.set(product.id, product);
    return product;
  }

  async updateProduct(id, productData) {
    const product = this.products.get(id);
    if (!product) return null;
    
    const updatedProduct = {
      ...product,
      ...productData,
      id: product.id, // Keep original ID
      updatedAt: new Date()
    };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id) {
    const product = this.products.get(id);
    if (!product) return false;
    
    this.products.delete(id);
    return true;
  }
}

module.exports = new MemoryDB();