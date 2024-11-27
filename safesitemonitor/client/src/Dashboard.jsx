import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './sidebar'; // Import Sidebar component

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [accounts, setAccounts] = useState([]);  // State to store saved accounts
  const [showAccounts, setShowAccounts] = useState(false);  // State to toggle accounts visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);  // State for sidebar open/close

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('/api/protected-route', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response && error.response.status === 401) {
          alert('Session expired. Please log in again.');
          navigate('/login');
        }
      }
    };
    fetchData();
  }, [navigate]);

  // Fetch the saved accounts from the API
  const fetchAccounts = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('/api/accounts', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setAccounts(response.data);  // Set the accounts data
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  // Toggle the display of the accounts section
  const toggleAccountsSection = () => {
    if (!showAccounts) {
      fetchAccounts();  // Fetch accounts only when the section is shown for the first time
    }
    setShowAccounts(!showAccounts);
  };

  // Toggle Sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState); // Toggle the sidebar visibility
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content */}
      <div
        style={{
          flex: 1,
          padding: '20px',
          marginLeft: isSidebarOpen ? '250px' : '80px', // Adjust content margin based on sidebar visibility
          transition: 'margin-left 0.3s',
        }}
      >
        <h1>Dashboard</h1>
        {data ? (
          <>
            <h2>Here is the hub for safesitemonitor users!</h2>
            <p>Thank you for using our application. Click below to view your saved accounts.</p>

            {/* Button to toggle the display of saved accounts */}
            <button
              onClick={toggleAccountsSection}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                fontSize: '16px',
                cursor: 'pointer',
                backgroundColor: '#4CAF50',
                color: 'white',
              }}
            >
              {showAccounts ? 'Hide Saved Accounts' : 'Show Saved Accounts'}
            </button>

            {/* Scrollable section for saved accounts */}
            {showAccounts && (
              <div
                style={{
                  marginTop: '20px',
                  maxHeight: '200px',  // Limit the height for scrolling
                  overflowY: 'scroll', // Enable vertical scrolling
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  backgroundColor: '#f9f9f9',
                }}
              >
                <h3>Saved Accounts:</h3>
                {accounts.length > 0 ? (
                  <ul>
                    {accounts.map((account, index) => (
                      <li key={index}>{account.email}</li>  // Adjust this based on the structure of the saved account
                    ))}
                  </ul>
                ) : (
                  <p>No accounts saved yet.</p>
                )}
              </div>
            )}
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;




