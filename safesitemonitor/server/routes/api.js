const express = require('express');
const authenticateToken = require('./auth'); // Corrected import from the same directory
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

// Route to update external accounts for a logged-in user
router.patch('/user/:userId/accounts/:accountId', authenticateToken, async (req, res) => {
  const { userId, accountId } = req.params;
  const { email, password, service } = req.body;

  try {
    // Ensure the user making the request is the same as the user in the URL
    if (req.user.userId !== userId) {
      return res.status(403).json({ message: 'You are not authorized to perform this action' });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the account by accountId
    const account = user.accounts.id(accountId);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Update the account fields
    if (email) account.email = email;
    if (password) account.password = password;
    if (service) account.service = service;

    await user.save();
    res.status(200).json({ message: 'External account updated successfully!', user });
  } catch (error) {
    console.error('Error updating external account:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Route to delete an external account for the logged-in user
router.delete('/user/:userId/accounts/:accountId', authenticateToken, async (req, res) => {
  const { userId, accountId } = req.params;

  try {
    // Ensure the user making the request is the same as the user in the URL
    if (req.user.userId !== userId) {
      return res.status(403).json({ message: 'You are not authorized to perform this action' });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the account by accountId and remove it
    const account = user.accounts.id(accountId);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    account.remove(); // Remove the account from the user's array
    await user.save();

    res.status(200).json({ message: 'External account deleted successfully!', user });
  } catch (error) {
    console.error('Error deleting external account:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Test Route (Public)
router.get('/data', (req, res) => {
  const data = { message: 'This is a public API endpoint.' };
  res.json(data);
});

module.exports = router;
