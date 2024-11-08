const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const userRoutes = require('./src/routes/users'); // Import user routes
const accountRoutes = require('./src/routes/accounts'); // Import account routes

const app = express();
const port = process.env.PORT || 3000;

const JWT_SECRET = "Here_Key"; // My secret login key

// MongoDB connection string
const uri = 'mongodb+srv://Sslaughter:ButterflyDBuserp%402@customers.4y2v8.mongodb.net/?retryWrites=true&w=majority&appName=Customers';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected!'))
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware setup
app.use(bodyParser.json());
app.use(cors());

// Define a test API route
app.get('/api/data', (req, res) => {
    const data = { message: 'My API endpoint.' };
    res.json(data);
});

//user login post
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    
    try {
      const hashedPassword = await bcrypt.hash(password, 10); // Hash password
      const newUser = new User({ username, password: hashedPassword });
      await newUser.save();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error registering user' });
    }
  });

// Login that uses registered login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user || !(await bcrypt.compare(password, user.password))) {
     return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Protected route
app.get('/api/protected', (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
     const decoded = jwt.verify(token, JWT_SECRET);
     res.json({ message: 'Access granted', user: decoded });
  } catch (error) {
     res.status(401).json({ message: 'Invalid token' });
  }
});

// Use user and account routes
app.use('/api/users', userRoutes);      // For user routes
app.use('/api/accounts', accountRoutes); // For account routes

// Default route for root path to check server status
app.get('/', (req, res) => {
    res.send("Server is running!");
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});