const express = require('express');
const authenticateToken  = require('./auth'); // Ensure this middleware is correct
const User = require('../models/user'); // Import your User model
const router = express.Router();
const bcrypt = require('bcryptjs');

// Protected route example
router.get('/protected-route', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route, and you are authenticated!' });
});

// Fetch current user
router.get('/current-user', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ id: req.user.userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Add external accounts for a user
router.post('/user/:userId/accounts', authenticateToken, async (req, res) => {
  const { userId } = req.params;
  const { email, password, service } = req.body;

  try {
    if (req.user.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const user = await User.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingAccount = user.accounts.find(account => account.email === email);
    if (existingAccount) {
      return res.status(400).json({ message: 'Account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.accounts.push({ service, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'External account added successfully!', accounts: user.accounts });
  } catch (error) {
    console.error('Error adding external account:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

module.exports = router;

