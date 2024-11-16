import React from 'react';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const navigate = useNavigate();

  const goToLoginPage = () => {
    console.log('Navigating to /login');
    navigate('/Login'); // Navigate to the Login page
  };

  console.log('App component rendered');

  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the homepage!</p>
      <button onClick={goToLoginPage}>Go to Login Page</button>
    </div>
  );
};

export default App;
