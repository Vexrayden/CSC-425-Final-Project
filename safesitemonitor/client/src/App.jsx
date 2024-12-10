import React from 'react';
import { useNavigate } from 'react-router-dom';
import './app.css';

const App = () => {
  const navigate = useNavigate();

  console.log('App component is rendering');

  const goToLoginPage = () => {
    console.log('Navigating to /login');
    navigate('/login'); // Navigate to the Login page
  };

  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to Safe Site Monitoring!</p>
      <button onClick={goToLoginPage}>Go to Login Page</button>
    </div>
  );
};

export default App;


