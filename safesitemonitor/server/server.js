const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const apiRoutes = require('./routes/api'); // Import API routes
const authRoutes = require('./routes/auth'); // Import Auth routes

const app = express();
const port = 3000;

// MongoDB connection string
const uri = 'mongodb+srv://Sslaughter:ButterflyDBuserp%402@customers.4y2v8.mongodb.net/?retryWrites=true&w=majority&appName=Customers';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware setup
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3001',  // Allow only requests from Vite frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'] // Allow headers for content type and auth token
}));

// Mount API routes
app.use('/api', apiRoutes);  // All routes in api.js will be prefixed with /api
app.use('/auth', authRoutes); // Same for auth routes

// Default route for root path to check server status
app.get('/', (req, res) => {
  res.send("Server is running!");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



