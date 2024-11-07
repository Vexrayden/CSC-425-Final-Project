import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Axios for making HTTP requests

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState(''); // Takes username inputs
  const [password, setPassword] = useState(''); // Takes password inputs
  const [showRegister, setShowRegister] = useState(false); // Toggle register form

  const loginAttempt = async (e) => {
    e.preventDefault(); // Prevent page reload
    if (username === 'Samuel' && password === 'Pa$$w0rd') {
      navigate('/Dashboard'); // Navigate to dashboard
    } else {
      alert('Invalid credentials, try again.');
    }
  };

  const createAccount = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/register', {
        username,
        password,
      });
      alert('Account created successfully!');
      setShowRegister(false); // Hide register form
      setUsername('');
      setPassword('');
    } catch (error) {
      console.error(error);
      alert('Error creating account. Please try again.');
    }
  };

  return (
    <div>
      <h1>{showRegister ? 'Create Account' : 'Login Page'}</h1>
      
      {showRegister ? (
        <form onSubmit={createAccount}>
          <div>
            <label>
              Username:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Username"
                required
              />
            </label>
          </div>

          <div>
            <label>
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                required
              />
            </label>
          </div>

          <button type="submit">Register</button>
          <button type="button" onClick={() => setShowRegister(false)}>Cancel</button>
        </form>
      ) : (
        <form onSubmit={loginAttempt}>
          <div>
            <label>
              Username:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Username"
                required
              />
            </label>
          </div>

          <div>
            <label>
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                required
              />
            </label>
          </div>

          <button type="submit">Login</button>
          <button type="button" onClick={() => setShowRegister(true)}>Create Account</button>
        </form>
      )}
    </div>
  );
};

export default Login;