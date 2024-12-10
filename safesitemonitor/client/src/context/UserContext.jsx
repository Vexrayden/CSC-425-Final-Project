import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Use navigate to redirect if needed

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No token found in localStorage.');
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/current-user', {
          headers: { Authorization: `Bearer ${token}` }, // Pass token as Bearer token
        });

        if (response.status === 401 || response.status === 403) {
          // If token is invalid or expired, clear token and redirect to login page
          localStorage.removeItem('token');
          setUser(null);
          setError('Token expired or invalid');
          navigate('/login'); // Redirect to login page
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Assuming the response has the 'user' field containing the user data
        if (data.user) {
          // Update the user state with the returned user object
          setUser({
            userId: data.user.id, // Use the new manually generated 'id'
            username: data.user.username,
            email: data.user.email,
            token: token,
          });
          setError(null);
        } else {
          throw new Error('Invalid response format: "user" not found in response');
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        setError(err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      // Only navigate to /dashboard if we're not already on the dashboard page
      if (window.location.pathname !== '/dashboard') {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);
  

  return (
    <UserContext.Provider value={{ user, setUser, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;