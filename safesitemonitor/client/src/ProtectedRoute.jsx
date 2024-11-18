// ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';

// Function to check if the user is authenticated
const isAuthenticated = () => {
  // Check if a token is stored in localStorage
  const token = localStorage.getItem('token');
  return token ? true : false;
};

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    // If not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }
  return children; // Otherwise, render the protected children
};

export default ProtectedRoute;



