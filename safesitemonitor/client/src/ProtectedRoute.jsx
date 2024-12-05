import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from './context/UserContext'; // Make sure this path is correct

const ProtectedRoute = ({ children }) => {
  // Access the user state from context
  const { user } = useContext(UserContext);

  // If the user is not authenticated (user is null), redirect to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render the protected children
  return children;
};

export default ProtectedRoute;




