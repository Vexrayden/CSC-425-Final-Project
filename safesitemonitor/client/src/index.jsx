import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Login from './Login';
import Dashboard from './Dashboard';
import Emails from './Emails';
import Profile from './Profile';
import NotFound from './NotFound';
import ProtectedRoute from './ProtectedRoute';
import UserProvider from './context/UserContext'; // Import UserProvider for global state management
import './index.css';
import reportWebVitals from './reportWebVitals';

// Create root element for rendering the app
const root = createRoot(document.getElementById('root'));

// Rendering the application
root.render(
  <React.StrictMode>
    <UserProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<App />} />

          {/* Login Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/emails"
            element={
              <ProtectedRoute>
                <Emails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Fallback Route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </UserProvider>
  </React.StrictMode>
);

// performance statiscitcs tracking
reportWebVitals();

