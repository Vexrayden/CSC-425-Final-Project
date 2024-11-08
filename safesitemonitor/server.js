const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');

// Import User model
const User = require('./models/user'); // Make sure the path to user.js is correct

const app = express();
const port = process.env.PORT || 3000;
const JWT_SECRET = "Here_Key"; // Your secret login key

// MongoDB connection string
const uri = 'mongodb+srv://Sslaughter:ButterflyDBuserp%402@customers.4y2v8.mongodb.net/?retryWrites=true&w=majority&appName=Customers';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected!'))
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware setup
app.use(express.json());
app.use(cors());

// Register Route
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the username already exists
    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Check if the email already exists
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save the new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Account created successfully!' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Username' });
        }

        // Compare hashed passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Password' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

        // Send token in response
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// Test route
app.get('/api/data', (req, res) => {
  const data = { message: 'My API endpoint.' };
  res.json(data);
});

// Default route for root path to check server status
app.get('/', (req, res) => {
  res.send("Server is running!");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

