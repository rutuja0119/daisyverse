# Daisy Verse Backend Server

## Setup Instructions

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following environment variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

4. Start the server:
   ```bash
   npm run dev  # For development with nodemon
   npm start    # For production
   ```

## API Endpoints

### Products
- `GET /api/products` - Get all products (with optional filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (requires auth)

### Health Check
- `GET /api/health` - Check server health
- `GET /` - Welcome message

## Features
- MongoDB connection with Mongoose
- JWT authentication
- Product management
- User authentication
- CORS enabled
- Error handling
- Environment configuration