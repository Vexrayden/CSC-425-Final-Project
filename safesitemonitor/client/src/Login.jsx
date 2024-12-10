import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Axios for making HTTP requests
import { UserContext } from './context/UserContext'; // Import UserContext


const Login = () => {
  const { setUser } = useContext(UserContext); // Get setUser from context
  const navigate = useNavigate();

  const [username, setUsername] = useState(''); // Takes username inputs
  const [email, setEmail] = useState(''); // Takes email inputs (for registration)
  const [password, setPassword] = useState(''); // Takes password inputs
  const [showRegister, setShowRegister] = useState(false); // Toggle register form

  // loginAttempt function
  const loginAttempt = async (e) => {
    e.preventDefault();

    // Trim the username and password to remove any accidental extra spaces
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        username: trimmedUsername,
        password: trimmedPassword,
      });

      console.log('Login Response:', response.data);

      if (response.data && response.data.token) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);

        // Set the user data in context
        setUser({
          userId: response.data.userId,
          username: trimmedUsername, // Username from form input
          token: response.data.token,
        });

        alert('Login successful!');
        navigate('/Dashboard'); // Navigate to protected route
      } else {
        alert('Failed to retrieve user data. Please try again.');
      }
    } catch (error) {
      console.error('Login Error:', error);
      if (error.response) {
        alert(error.response.data.message || 'Error with login');
      } else {
        alert('Network error or server unreachable');
      }
    }
  };

  // Register function with API call
  const createAccount = async (e) => {
    e.preventDefault();
    try {
      const trimmedUsername = username.trim();
      const trimmedPassword = password.trim();
      const trimmedEmail = email.trim();

      const response = await axios.post('http://localhost:3000/api/auth/register', {
        username: trimmedUsername,
        email: trimmedEmail,
        password: trimmedPassword,
      });

      alert('Account created successfully!');
      setShowRegister(false); // Hide register form
      setUsername(''); // Clear form fields
      setPassword('');
      setEmail('');
    } catch (error) {
      console.error('Registration Error:', error);
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
                autoComplete="username"
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
                autoComplete="email"
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
                autoComplete="new-password"
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
                autoComplete="username"
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
                autoComplete="current-password"
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

