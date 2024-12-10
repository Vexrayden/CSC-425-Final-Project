import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import UserProvider from '../context/UserContext';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock necessary dependencies
global.fetch = jest.fn();
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('UserProvider', () => {
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should render loading state initially', () => {
    localStorage.setItem('token', 'fakeToken');
    fetch.mockResolvedValueOnce({ ok: true, json: jest.fn().mockResolvedValue({ user: { id: 1, username: 'test', email: 'test@test.com' } }) });

    render(
      <Router>
        <UserProvider>
          <div>Test Child</div>
        </UserProvider>
      </Router>
    );

    // Verify loading state
    expect(screen.queryByText('Test Child')).toBeNull();  // Child should not be rendered until user is loaded
  });

  it('should handle error if no token is found', async () => {
    localStorage.removeItem('token');  // No token in localStorage

    render(
      <Router>
        <UserProvider>
          <div>Test Child</div>
        </UserProvider>
      </Router>
    );

    // Wait for loading to finish
    await waitFor(() => expect(screen.queryByText('Test Child')).toBeInTheDocument());

    // Check if an error state is handled (you could extend this to check for actual UI feedback if present)
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should fetch user and redirect to dashboard on success', async () => {
    localStorage.setItem('token', 'fakeToken');
    fetch.mockResolvedValueOnce({ ok: true, json: jest.fn().mockResolvedValue({ user: { id: 1, username: 'test', email: 'test@test.com' } }) });

    render(
      <Router>
        <UserProvider>
          <div>Test Child</div>
        </UserProvider>
      </Router>
    );

    // Wait for the fetch to complete
    await waitFor(() => expect(screen.queryByText('Test Child')).toBeInTheDocument());

    // Check that the user context is populated and redirected to the dashboard
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('should handle token expiry error and redirect to login', async () => {
    localStorage.setItem('token', 'fakeToken');
    fetch.mockResolvedValueOnce({ status: 401, ok: false });

    render(
      <Router>
        <UserProvider>
          <div>Test Child</div>
        </UserProvider>
      </Router>
    );

    // Wait for the fetch to complete
    await waitFor(() => expect(screen.queryByText('Test Child')).toBeInTheDocument());

    // Check that the user is redirected to the login page
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('should handle fetch error', async () => {
    localStorage.setItem('token', 'fakeToken');
    fetch.mockRejectedValueOnce(new Error('Fetch error'));

    render(
      <Router>
        <UserProvider>
          <div>Test Child</div>
        </UserProvider>
      </Router>
    );

    // Wait for loading to finish
    await waitFor(() => expect(screen.queryByText('Test Child')).toBeInTheDocument());

    // Here, you can also check the error handling behavior within your component
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });
});
