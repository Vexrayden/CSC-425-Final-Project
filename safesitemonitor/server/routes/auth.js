const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

// Registration Route
router.post('/register', async (req, res) => {
  // Registration logic here...
});

// Login Route
router.post('/login', async (req, res) => {
  // Login logic here...
});

module.exports = router;
