import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token'); // Clear invalid token
          setUser(null);
          setError('Token expired or invalid');
          navigate('/login'); // Redirect to login
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.user) {
          setUser({
            userId: data.user.id,
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

  return (
    <UserContext.Provider value={{ user, setUser, loading, error }}>
      {/* Render a loading spinner or nothing if the app is still loading */}
      {loading ? <p>Loading...</p> : children}
    </UserContext.Provider>
  );
};

export default UserProvider;
