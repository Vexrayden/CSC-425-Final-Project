const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // User schema for MongoDB
const router = express.Router();

// Generate a JWT token for the user
const generateToken = (user) => {
    return jwt.sign({ userId: user._id, username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });
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

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({ username, email, password: hashedPassword });
        await user.save();

        // Generate a JWT token for the newly created user
        const token = generateToken(user);

        // Respond with the user data and token
        res.status(201).json({ message: 'User created successfully', user, token });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // Compare the provided password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // Generate a JWT token for the user
        const token = generateToken(user);

        // Respond with the token
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// Get all users (admin route)
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a user by ID
router.patch('/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['username', 'email', 'password'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ error: 'Invalid updates!' });
    }

    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a user by ID
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add an account to a user
router.post('/:id/accounts', async (req, res) => {
    const { service, email, password } = req.body;
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.accounts.push({ service, email, password });
        await user.save();

        res.status(201).json({ message: 'Account added successfully', accounts: user.accounts });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all accounts for a user
router.get('/:id/accounts', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user.accounts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update an account for a user
router.patch('/:id/accounts/:accountId', async (req, res) => {
    try {
        const { service, email, password } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const account = user.accounts.id(req.params.accountId);
        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }

        if (service) account.service = service;
        if (email) account.email = email;
        if (password) account.password = password;

        await user.save();
        res.status(200).json({ message: 'Account updated successfully', account });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete an account for a user
router.delete('/:id/accounts/:accountId', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const account = user.accounts.id(req.params.accountId);

        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }

        account.remove();
        await user.save();

        res.status(200).json({ message: 'Account deleted successfully', accounts: user.accounts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;