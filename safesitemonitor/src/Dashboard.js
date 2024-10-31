import React from 'react';
import { useNavigate } from 'react-router-dom';



const Dashboard = () => {
    const navigate = useNavigate(); // Initialize useNavigate
  
    // Function to handle navigation
    const handleNavigate = () => {
      navigate('/Emails'); // goes to Email.js file for data collection
    };
  
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Welcome to the Dashboard!</h1>
        <p>Thank you for using our application. Click the button below to access your emails.</p>
        <button 
          onClick={handleNavigate} 
          style={{ 
            marginTop: '20px', 
            padding: '10px 20px', 
            fontSize: '16px', 
            cursor: 'pointer' 
          }}
        >
          Go to Emails
        </button>
      </div>
    );
  };
  
  export default Dashboard;