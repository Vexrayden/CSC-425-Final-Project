const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid'); // Import uuid for generating unique IDs
const User = require('../models/user'); // User schema
const router = express.Router();

// my secret key
const JWT_SECRET = 'Here_Key_fortest';

// Generate JWT Token
const generateToken = (user) => jwt.sign(
  { userId: user.id, username: user.username }, // Use the unique `id` field
  JWT_SECRET,
  { expiresIn: '1h' }
);

// Middleware: Authenticate Token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract Bearer token
  if (!token) return res.status(401).json({ message: 'Token required' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = decoded; // Attach decoded user data to request
    next();
  });
};

// Register a new user
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check for existing user with same username or email
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate unique ID for user
    const userId = uuidv4();

    // Create and save user
    const user = new User({
      id: userId, // Add the generated unique ID
      username,
      email,
      password: hashedPassword,
      accounts: [], // Initialize with an empty array for external accounts
    });

    await user.save();

    const token = generateToken(user); // Generate JWT for new user
    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// login for user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const token = generateToken(user); // Generate JWT
    // Send both token and userId in the response
    res.json({ message: 'Login successful', token, userId: user.id });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});


// Get current authenticated user
router.get('/current-user', authenticateToken, async (req, res) => {
  try {
    // Find user by custom `id` field
    const user = await User.findOne({ id: req.user.userId }); // Use `id` from the token
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });  // Ensure user object is returned
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});


module.exports = router;








