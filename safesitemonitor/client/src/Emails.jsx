import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import EmailForm from './EmailForm'; // Ensure this path is correct
import { UserContext } from './context/UserContext'; // Import UserContext

const Emails = () => {
    const navigate = useNavigate(); // Initialize the navigate function
    const { user } = useContext(UserContext); // Access user context for user data

    // useEffect to handle navigation if user is not available
    useEffect(() => {
        if (!user) {
            navigate('/login'); // Redirect to login if no user is found
        }
    }, [user, navigate]); // Re-run the effect when 'user' or 'navigate' changes

    // If the user is not found, the component won't render (due to the redirect in useEffect)
    if (!user) return null;

    const { userId, authToken } = user; // Extract userId and authToken from context

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



