import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import App from '../App';
import Login from '../Login';
import Dashboard from '../Dashboard';
import Emails from '../Emails';
import Profile from '../Profile';
import NotFound from '../NotFound';
import ProtectedRoute from '../ProtectedRoute';
import UserProvider from '../context/UserContext';

// Mock the components for basic rendering
jest.mock('../App', () => jest.fn(() => <div>Home Page</div>));
jest.mock('../Login', () => jest.fn(() => <div>Login Page</div>));
jest.mock('../Dashboard', () => jest.fn(() => <div>Dashboard Page</div>));
jest.mock('../Emails', () => jest.fn(() => <div>Emails Page</div>));
jest.mock('../Profile', () => jest.fn(() => <div>Profile Page</div>));
jest.mock('../NotFound', () => jest.fn(() => <div>404 Not Found</div>));
jest.mock('../ProtectedRoute', () =>
  jest.fn(({ children }) => <div>Protected: {children}</div>)
);

describe('Main Application', () => {
  it('renders without crashing', () => {
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);

    expect(() => {
      createRoot(root).render(
        <React.StrictMode>
          <MemoryRouter>
            <UserProvider>
              <App />
            </UserProvider>
          </MemoryRouter>
        </React.StrictMode>
      );
    }).not.toThrow();
  });

  it('renders the correct components based on routes', () => {
    const testCases = [
      { path: '/', expectedText: 'Home Page' },
      { path: '/login', expectedText: 'Login Page' },
      { path: '/dashboard', expectedText: 'Protected: Dashboard Page' },
      { path: '/emails', expectedText: 'Protected: Emails Page' },
      { path: '/profile', expectedText: 'Protected: Profile Page' },
      { path: '/random', expectedText: '404 Not Found' }, // Fallback route
    ];

    testCases.forEach(({ path, expectedText }) => {
      render(
        <MemoryRouter initialEntries={[path]}>
          <UserProvider>
            <App />
          </UserProvider>
        </MemoryRouter>
      );

      expect(screen.getByText(expectedText)).toBeInTheDocument();
    });
  });
});
