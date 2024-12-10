import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import EmailForm from './EmailForm'; // Ensure this path is correct
import { UserContext } from './context/UserContext'; // Import UserContext

const Emails = () => {
  const navigate = useNavigate(); // Initialize the navigate function
  const { user } = useContext(UserContext); // Access user context for user data

  useEffect(() => {
    if (!user) {
      navigate('/login'); // Redirect to login if no user is found
    }
  }, [user, navigate]);

  if (!user) return <p>Loading...</p>;

  const { userId, token: authToken } = user; // Extract userId and token from context

  const goBackToDashboard = () => {
    navigate('/dashboard'); // Navigate to the dashboard route
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Store Your Active Emails Here</h1>
      <EmailForm userId={userId} authToken={authToken} /> {/* Pass user data to EmailForm */}

      <button onClick={goBackToDashboard} style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: 'lightblue' }}>
        Go Back to Dashboard
      </button>
    </div>
  );
};

export default Emails;