import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import EmailForm from './EmailForm'; // Ensure this path is correct

const Emails = () => {
    const location = useLocation();
    const navigate = useNavigate(); // Initialize the navigate function
    const { userId, authToken } = location.state || {}; // Retrieve data passed via navigate

    // Function to navigate back to Dashboard
    const goBackToDashboard = () => {
        navigate('/dashboard'); // Navigate to the dashboard route
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Store Your Active Emails Here</h1>
            <EmailForm userId={userId} authToken={authToken} /> {/* Pass user data to EmailForm */}

            {/* Go Back to Dashboard Button */}
            <button
                onClick={goBackToDashboard}
                style={{
                    marginTop: '20px',
                    padding: '10px 20px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    backgroundColor: 'lightblue',
                }}
            >
                Go Back to Dashboard
            </button>
        </div>
    );
};

export default Emails;

