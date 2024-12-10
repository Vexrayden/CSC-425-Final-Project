const request = require('supertest');
const express = require('express');
const router = require('../path/to/your/router');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock authentication middleware
jest.mock('./auth', () => ({
  authenticateToken: (req, res, next) => {
    req.user = { userId: '123' };  // Mock a user object in the request
    next();
  }
}));

// Set up the Express app with the router
const app = express();
app.use(express.json());
app.use(router);

describe('Protected routes', () => {
  let mockUser;

  beforeEach(async () => {
    // Mock user for database interaction
    mockUser = new User({
      id: '123',
      username: 'johnDoe',
      accounts: [],
    });
    await mockUser.save();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe('/protected-route', () => {
    it('should return a success message when authenticated', async () => {
      const res = await request(app)
        .get('/protected-route')
        .set('Authorization', `Bearer mocktoken`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('This is a protected route, and you are authenticated!');
    });

    it('should return a 401 status when not authenticated', async () => {
      const res = await request(app).get('/protected-route');
      
      expect(res.status).toBe(401); // Unauthorized
      expect(res.body.message).toBe('Token not provided or invalid.');
    });
  });

  describe('/current-user', () => {
    it('should return user data when authenticated', async () => {
      const res = await request(app)
        .get('/current-user')
        .set('Authorization', `Bearer mocktoken`);

      expect(res.status).toBe(200);
      expect(res.body.user.username).toBe(mockUser.username);
    });

    it('should return a 404 status if user is not found', async () => {
      mockUser = null; // Simulate no user found

      const res = await request(app)
        .get('/current-user')
        .set('Authorization', `Bearer mocktoken`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('User not found');
    });

    it('should return a 500 status on server error', async () => {
      jest.spyOn(User, 'findOne').mockRejectedValue(new Error('Server error'));
      
      const res = await request(app)
        .get('/current-user')
        .set('Authorization', `Bearer mocktoken`);

      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Server error. Please try again later.');
    });
  });

  describe('/user/:userId/accounts', () => {
    it('should add an external account when valid', async () => {
      const res = await request(app)
        .post(`/user/${mockUser.id}/accounts`)
        .set('Authorization', `Bearer mocktoken`)
        .send({
          email: 'test@example.com',
          password: 'password123',
          service: 'gmail',
        });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('External account added successfully!');
    });

    it('should return 403 if user tries to add account for another user', async () => {
      const res = await request(app)
        .post(`/user/${mockUser.id}/accounts`)
        .set('Authorization', `Bearer mocktoken`)
        .send({
          email: 'test@example.com',
          password: 'password123',
          service: 'gmail',
        });

      expect(res.status).toBe(403);
      expect(res.body.message).toBe('Unauthorized access');
    });

    it('should return 400 if the account already exists', async () => {
      // Mock existing account in user
      mockUser.accounts.push({ service: 'gmail', email: 'test@example.com', password: 'hashedpassword' });
      await mockUser.save();

      const res = await request(app)
        .post(`/user/${mockUser.id}/accounts`)
        .set('Authorization', `Bearer mocktoken`)
        .send({
          email: 'test@example.com',
          password: 'password123',
          service: 'gmail',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Account with this email already exists');
    });

    it('should return a 500 status on server error', async () => {
      jest.spyOn(User, 'findOne').mockRejectedValue(new Error('Server error'));

      const res = await request(app)
        .post(`/user/${mockUser.id}/accounts`)
        .set('Authorization', `Bearer mocktoken`)
        .send({
          email: 'test@example.com',
          password: 'password123',
          service: 'gmail',
        });

      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Server error. Please try again later.');
    });
  });
});
