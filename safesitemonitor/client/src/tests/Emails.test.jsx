import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { UserContext } from './context/UserContext'; // Import UserContext
import Emails from '../Emails';
import EmailForm from '../EmailForm';

jest.mock('../EmailForm', () => jest.fn(() => <div>Email Form</div>));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Emails Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked = jest.mocked || jest.fn(); // Ensure jest.mocked is available if not already.
    useNavigate.mockReturnValue(mockNavigate);
  });
  

  it('redirects to /login if user is not authenticated', () => {
    render(
      <UserContext.Provider value={{ user: null }}>
        <MemoryRouter>
          <Emails />
        </MemoryRouter>
      </UserContext.Provider>
    );

    // Verify redirection occurs
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('renders EmailForm and user information when user is authenticated', () => {
    const mockUser = { userId: '12345', token: 'test-token' };

    render(
      <UserContext.Provider value={{ user: mockUser }}>
        <MemoryRouter>
          <Emails />
        </MemoryRouter>
      </UserContext.Provider>
    );

    // Verify EmailForm renders
    expect(screen.getByText('Email Form')).toBeInTheDocument();

    // Verify user-related heading renders
    expect(screen.getByText('Store Your Active Emails Here')).toBeInTheDocument();

    // Ensure the "Go Back to Dashboard" button is present
    expect(screen.getByText('Go Back to Dashboard')).toBeInTheDocument();
  });

  it('navigates to /dashboard when "Go Back to Dashboard" button is clicked', () => {
    const mockUser = { userId: '12345', token: 'test-token' };

    render(
      <UserContext.Provider value={{ user: mockUser }}>
        <MemoryRouter>
          <Emails />
        </MemoryRouter>
      </UserContext.Provider>
    );

    const button = screen.getByText('Go Back to Dashboard');
    fireEvent.click(button);

    // Verify navigation occurs
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('shows loading state when user data is undefined', () => {
    render(
      <UserContext.Provider value={{ user: undefined }}>
        <MemoryRouter>
          <Emails />
        </MemoryRouter>
      </UserContext.Provider>
    );

    // Verify "Loading..." text appears
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
