import { render, screen } from '@testing-library/react';
import { UserContext } from './context/UserContext'; // Import UserContext
import { BrowserRouter as Router } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import React from 'react'; // Add this line to your test files


// Mock user data
const mockUser = {
  username: 'JohnDoe',
  profileImage: 'https://example.com/profile.jpg',
};

describe('ProtectedRoute Component', () => {
  test('redirects to login when user is not authenticated', () => {
    render(
      <Router>
        <UserContext.Provider value={{ user: null }}>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </UserContext.Provider>
      </Router>
    );

    // Check if the component redirects to the login page
    expect(screen.queryByText('Protected Content')).toBeNull(); // Ensure the children are not rendered
  });

  test('renders children when user is authenticated', () => {
    render(
      <Router>
        <UserContext.Provider value={{ user: mockUser }}>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </UserContext.Provider>
      </Router>
    );

    // Ensure the children are rendered
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
