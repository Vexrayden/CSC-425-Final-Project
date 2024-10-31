const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const userRoutes = require('./routes/users'); // Import user routes
const accountRoutes = require('./routes/accounts'); // Import account routes

const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection string
const uri = 'mongodb+srv://Sslaughter:ButterflyDBuserp%402@customers.4y2v8.mongodb.net/?retryWrites=true&w=majority&appName=Customers';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected!'))
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware setup
app.use(bodyParser.json());
app.use(cors());

// Define a test API route
app.get('/api/data', (req, res) => {
    const data = { message: 'My API endpoint.' };
    res.json(data);
});

// Use user and account routes
app.use('/api/users', userRoutes);      // For user routes
app.use('/api/accounts', accountRoutes); // For account routes

// Default route for root path to check server status
app.get('/', (req, res) => {
    res.send("Server is running!");
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});