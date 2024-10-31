const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Ensure the model path is correct

// --- User Routes ---

// Create a new user
router.post('/', async (req, res) => {
    try {
        const { username, email, password } = req.body; // Destructure fields from request body
        const user = new User({ username, email, password }); // Create a user with the provided data
        await user.save(); // Save user to the database
        res.status(201).json(user); // Return the created user with a 201 status
    } catch (error) {
        res.status(400).json({ error: error.message }); // Return error if user creation fails
    }
});

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from the database
        res.status(200).json(users); // Return the users with a 200 status
    } catch (error) {
        res.status(500).json({ error: error.message }); // Return error if fetching users fails
    }
});

// Get a user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id); // Find user by ID
        if (!user) {
            return res.status(404).json({ error: 'User not found' }); // Return error if user not found
        }
        res.status(200).json(user); // Return the user found
    } catch (error) {
        res.status(500).json({ error: error.message }); // Return error if fetching user fails
    }
});

// Update a user by ID
router.patch('/:id', async (req, res) => {
    const updates = Object.keys(req.body); // Get the fields to be updated
    const allowedUpdates = ['username', 'email', 'password', 'role']; // Allowed fields
    const isValidOperation = updates.every(update => allowedUpdates.includes(update)); // Validate updates

    if (!isValidOperation) {
        return res.status(400).json({ error: 'Invalid updates!' }); // Return error if updates are invalid
    }

    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); // Update user

        if (!user) {
            return res.status(404).json({ error: 'User not found' }); // Return error if user not found
        }

        res.status(200).json(user); // Return the updated user
    } catch (error) {
        res.status(400).json({ error: error.message }); // Return error if update fails
    }
});

// Delete a user by ID
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id); // Delete user by ID

        if (!user) {
            return res.status(404).json({ error: 'User not found' }); // Return error if user not found
        }

        res.status(200).json({ message: 'User deleted successfully', user }); // Return success message
    } catch (error) {
        res.status(500).json({ error: error.message }); // Return error if deletion fails
    }
});

// --- Account Routes ---

// Example route to get account data
router.get('/accounts', (req, res) => {
    res.send('Account API endpoint'); // Return a simple message for the accounts endpoint
});

// Export the router
module.exports = router;

