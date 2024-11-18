import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Axios for making HTTP requests

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState(''); // Takes username inputs
  const [email, setEmail] = useState(''); // Takes email inputs
  const [password, setPassword] = useState(''); // Takes password inputs
  const [showRegister, setShowRegister] = useState(false); // Toggle register form

  // loginAttempt function
  const loginAttempt = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/login', {
        username,
        password,
      });

      if (response.data && response.data.token) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
        alert('Login successful!');
        navigate('/Dashboard'); // Navigate to protected route
      } else {
        alert('Failed to retrieve token. Please try again.');
      }
    } catch (error) {
      console.error(error);
      alert('Invalid credentials, try again.');
    }
  };

  // Register function with API call
  const createAccount = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/register', {
        username,
        email,
        password,
      });

      alert('Account created successfully!');
      setShowRegister(false); // Hide register form
      setUsername('');
      setPassword('');
      setEmail('');
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 400) {
        alert('User already exists');
      } else {
        alert('Error creating account. Please try again.');
      }
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
              Email:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
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
          <button type="button" onClick={() => setShowRegister(false)}>
            Cancel
          </button>
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
          <button type="button" onClick={() => setShowRegister(true)}>
            Create Account
          </button>
        </form>
      )}
    </div>
  );
};

export default Login;
