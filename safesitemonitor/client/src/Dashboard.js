import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const navigate = useNavigate(); // Initialize useNavigate
    const [data, setData] = useState(null);

    // Fetch protected data on component load
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:3000/api/protected-route', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setData(response.data); // Set data to display on the page
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    // Handle navigation to Emails component
    const handleNavigate = () => {
        navigate('/Emails'); // Navigate to Email.js for data collection
    };

    const logout = () => {
      localStorage.removeItem('token');
      navigate('/login');
  };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Dashboard</h1>
            {data ? (
                <>
                    <h2>Welcome to the Dashboard!</h2>
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
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Dashboard;
