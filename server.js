const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./safesitemonitor/routes/users'); // add user routes

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://Sslaughter:<ButterflyDBuserp@2>@customers.4y2v8.mongodb.net/?retryWrites=true&w=majority&appName=Customers', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware setup
app.use(bodyParser.json());
app.use(cors());

// Define an API route
app.get('/api/data', (req, res) => {
    const data = { message: 'This is an API endpoint.' };
    res.json(data);
  });

// Use user routes
app.use('/api/users', userRoutes); // add user routes

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});