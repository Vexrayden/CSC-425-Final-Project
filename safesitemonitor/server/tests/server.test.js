const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Import your server

// Mock MongoDB connection
jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  return {
    ...actualMongoose,
    connect: jest.fn().mockResolvedValue('MongoDB connected!'),
    connection: { on: jest.fn() }, // Mock connection events like error
  };
});

describe('Server Tests', () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should connect to MongoDB', async () => {
    const mockConnect = require('mongoose').connect;

    // Ensure `mongoose.connect` was called exactly once during app initialization
    expect(mockConnect).toHaveBeenCalledTimes(1);
  });

  it('should start the server and respond to a GET request', async () => {
    const res = await request(app).get('/'); // Send a GET request to the root route
    expect(res.status).toBe(200);
    expect(res.text).toBe('Server is running!');
  });

  it('should use CORS middleware', async () => {
    const res = await request(app)
      .options('/api') // Simulate a preflight OPTIONS request
      .set('Origin', 'http://localhost:3001'); // Allowed origin as per your CORS config
    expect(res.status).toBe(204); // CORS preflight requests typically return 204
    expect(res.header['access-control-allow-origin']).toBe('http://localhost:3001');
  });
  

  it('should mount API routes correctly', async () => {
    const res = await request(app).get('/api');
    expect(res.status).toBe(404); // Assuming your /api endpoint is not directly accessible
  });

  it('should serve static files in production', async () => {
    process.env.NODE_ENV = 'production'; // Set environment to production
    const res = await request(app).get('/index.html'); // Trying to access a static file
    console.log('Static file response:', res.status);  // Add this to see the actual response status
    expect(res.status).toBe(200); // Assuming the static file exists
  });
  

  it('should return 404 for non-existing routes', async () => {
    const res = await request(app).get('/non-existing-route');
    expect(res.status).toBe(404); // No route should match this
  });
});
