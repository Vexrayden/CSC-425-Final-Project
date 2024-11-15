import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

// Example authentication function (can be expanded)
const isAuthenticated = () => {
  // Check if a token exists in localStorage or sessionStorage
  const token = localStorage.getItem('token');
  return !!token; // returns true if token exists
};

const ProtectedRoute = ({ children, fallback = "/login" }) => {
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  
  useEffect(() => {
    // Simulate an async check for authentication (e.g., checking token validity)
    const checkAuth = () => {
      setIsAuthChecked(true);  // Set the state once the authentication check is done
    };
    checkAuth();
  }, []);

  // Wait for the auth check to complete
  if (!isAuthChecked) {
    return <div>Loading...</div>;  // You can show a loading spinner or something here
  }

  // If not authenticated, redirect to login (or custom fallback)
  if (!isAuthenticated()) {
    return <Navigate to={fallback} replace />;
  }

  return children; // Render protected route children if authenticated
};

export default ProtectedRoute;
