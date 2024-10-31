import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserList from './UserList.js';

const App = () => {
  const navigate = useNavigate();

  const goToLoginPage = () => {
    navigate('/login'); // Navigate to the Login page
  };

  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the homepage!</p>
      <button onClick={goToLoginPage}>Go to Login Page</button>
      
      <h2>User List</h2>
      <UserList /> {/* Include the UserList component here */}
    </div>
  );
};

export default App;