import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../Login';
import { BrowserRouter as Router } from 'react-router-dom'; // For routing context
import { UserContext } from './context/UserContext'; // Import UserContext
import React from 'react'; // Add this line to your test files


describe('Login Component', () => {
  it('should render the login form', () => {
    render(
      <Router>
        <UserContext.Provider value={{ user: null, setUser: jest.fn() }}>
          <Login />
        </UserContext.Provider>
      </Router>
    );

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  it('should handle login attempt', async () => {
    const mockSetUser = jest.fn();

    render(
      <Router>
        <UserContext.Provider value={{ user: null, setUser: mockSetUser }}>
          <Login />
        </UserContext.Provider>
      </Router>
    );

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByText(/login/i);

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } });

    fireEvent.click(loginButton);

    // Add mock login API call logic or wait for results
    await screen.findByText(/login successful/i);
    expect(mockSetUser).toHaveBeenCalledWith(expect.objectContaining({
      username: 'testuser',
    }));
  });
});
