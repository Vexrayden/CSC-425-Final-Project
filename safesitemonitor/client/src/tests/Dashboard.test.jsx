import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Dashboard from './Dashboard';

// Mock axios
const mock = new MockAdapter(axios);

describe('Dashboard Component', () => {
  afterEach(() => {
    mock.reset();
  });

  it('renders the dashboard with a loading message initially', () => {
    render(
      <Router>
        <Dashboard />
      </Router>
    );

    // Verify loading state is rendered
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('fetches and displays data on successful fetch', async () => {
    // Mock API response for protected route
    mock.onGet('/api/protected-route').reply(200, { message: 'Welcome to the dashboard' });

    render(
      <Router>
        <Dashboard />
      </Router>
    );

    // Wait for the data to load
    await waitFor(() => {
      expect(screen.getByText(/Here is the hub for safesitemonitor users!/i)).toBeInTheDocument();
    });
  });

  it('redirects to login on 401 error', async () => {
    // Mock API response for unauthorized access
    mock.onGet('/api/protected-route').reply(401);

    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <Router>
        <Dashboard />
      </Router>
    );

    // Wait for the alert to be called and verify redirection
    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Session expired. Please log in again.');
    });

    alertMock.mockRestore();
  });

  it('toggles sidebar visibility', () => {
    render(
      <Router>
        <Dashboard />
      </Router>
    );

    // Sidebar is initially closed (check margin)
    const content = screen.getByText(/Dashboard/i).parentElement;
    expect(content).toHaveStyle('margin-left: 80px');

    // Simulate sidebar toggle
    fireEvent.click(screen.getByText(/toggle sidebar/i));

    // Sidebar is open (check updated margin)
    expect(content).toHaveStyle('margin-left: 250px');
  });

  it('toggles saved accounts section visibility', async () => {
    // Mock API response for accounts
    const accountsMock = [{ email: 'user1@example.com' }, { email: 'user2@example.com' }];
    mock.onGet('/api/accounts').reply(200, accountsMock);

    render(
      <Router>
        <Dashboard />
      </Router>
    );

    // Click on "Show Saved Accounts" button
    const toggleButton = screen.getByText(/show saved accounts/i);
    fireEvent.click(toggleButton);

    // Wait for accounts to be displayed
    await waitFor(() => {
      expect(screen.getByText(/user1@example.com/i)).toBeInTheDocument();
      expect(screen.getByText(/user2@example.com/i)).toBeInTheDocument();
    });

    // Click on "Hide Saved Accounts" button
    fireEvent.click(toggleButton);

    // Verify accounts section is hidden
    expect(screen.queryByText(/user1@example.com/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/user2@example.com/i)).not.toBeInTheDocument();
  });
});
