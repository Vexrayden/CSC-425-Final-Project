const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user'); // Import your User schema/model
const router = express.Router();

// Secret key for JWT
const JWT_SECRET = 'Here_Key'; //secret key for me

// Middleware to authenticate the token
const authenticateToken = (req, res, next) => {
  // Get token from Authorization header
  const token = req.headers['authorization']?.split(' ')[1]; // Authorization: Bearer <token>
  
  if (!token) {
    return res.status(401).json({ message: 'Token is required' });
  }

  // Verify token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    // Attach decoded user information to the request object
    req.user = decoded;
    next();
  });
};

// Generate a JWT token for a user
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, username: user.username },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// Register a new user
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 8);

    // Create a new user
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    // Generate a token for the newly registered user
    const token = generateToken(user);

    // Respond with the user ID and token
    res.status(201).json({
      message: 'User registered successfully',
      userId: user._id,
      token,
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'Invalid username or password' });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate a token for the authenticated user
    const token = generateToken(user);

    // Respond with the token and user ID
    res.json({
      message: 'Login successful',
      userId: user._id,
      token,
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Example of a protected route that requires authentication
router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route, and you are authenticated!' });
});

module.exports = router;


