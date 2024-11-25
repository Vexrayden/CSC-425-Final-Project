const express = require('express');
const authenticateToken = require('./auth'); // Import the correct authenticateToken middleware
const User = require('../models/user');
const router = express.Router();

// Example of a protected route
router.get('/protected-route', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route, and you are authenticated!' });
});

// Route to add external accounts for the logged-in user
router.post('/user/:userId/accounts', authenticateToken, async (req, res) => {
  const { userId } = req.params;
  const { email, password, service } = req.body;

  try {
    // Ensure the user making the request is the same as the user in the URL
    if (req.user.userId !== userId) {
      return res.status(403).json({ message: 'You are not authorized to perform this action' });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the account already exists for the provided email
    const existingAccount = user.accounts.find(account => account.email === email);
    if (existingAccount) {
      return res.status(400).json({ message: 'Account with this email already exists' });
    }

    // Add the new account to the user's accounts array
    user.accounts.push({ service, email, password });
    await user.save();

    res.status(201).json({ message: 'External account added successfully!', user });
  } catch (error) {
    console.error('Error adding external account:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

module.exports = router;


