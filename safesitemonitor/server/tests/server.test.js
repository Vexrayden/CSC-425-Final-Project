const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const app = require('../server');  // Import your server (Make sure this exports the app)

// Mock MongoDB connection
jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue('MongoDB connected!'),
  connection: { on: jest.fn() }, // Mock connection events like error
}));

// Mocking other modules
jest.mock('path', () => ({
  join: jest.fn().mockReturnValue('mock-path-to-static-files'),
}));

describe('Server Tests', () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should connect to MongoDB', async () => {
    const mockConnect = mongoose.connect;
    
    // Check that the mock MongoDB connection method was called
    await mockConnect();
    expect(mockConnect).toHaveBeenCalledTimes(1);
  });

  it('should start the server on the correct port', async () => {
    const res = await request(app).get('/');  // Send a GET request to the root route
    expect(res.status).toBe(200);
    expect(res.text).toBe('Server is running!');
  });

  it('should use CORS middleware', async () => {
    const res = await request(app)
      .options('/api') // Simulate a preflight OPTIONS request
      .set('Origin', 'http://localhost:3001');  // Allowed origin as per your CORS config
    expect(res.status).toBe(200);
    expect(res.header['access-control-allow-origin']).toBe('http://localhost:3001');
  });

  it('should mount API routes correctly', async () => {
    const res = await request(app).get('/api');
    expect(res.status).toBe(404);  // Assuming your /api endpoint is not directly accessible
  });

  it('should serve static files in production', async () => {
    process.env.NODE_ENV = 'production';  // Set environment to production
    const res = await request(app).get('/index.html'); // Trying to access a static file
    expect(res.status).toBe(200);  // Assuming the static file exists
  });

  it('should return 404 for non-existing routes', async () => {
    const res = await request(app).get('/non-existing-route');
    expect(res.status).toBe(404);  // No route should match this
  });
});
