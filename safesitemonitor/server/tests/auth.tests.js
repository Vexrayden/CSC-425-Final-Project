const request = require('supertest');
const app = require('../server'); // Import your Express app
const User = require('../models/user'); // Assuming you have a User model

describe('POST /api/auth/login', () => {
  let user;

  beforeAll(async () => {
    // Create a test user
    user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'testpassword', // Ensure this password is hashed in your model
    });
  });

  afterAll(async () => {
    // Clean up test data (delete the user)
    await User.deleteMany();
  });

  it('should login a user and return a JWT token', async () => {
    const response = await request(app) // Call your Express app here
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'testpassword',
      });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined(); // Expecting a JWT token
    expect(response.body.message).toBe('Login successful');
  });

  it('should return an error for invalid login credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'wrongpassword',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid username or password');
  });
});
