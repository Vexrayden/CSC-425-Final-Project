import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Login = () => {

  const navigate = useNavigate();

  const [username, setUsername] = useState(''); //takes username inputs
  const [password, setPassword] = useState(''); //takes oassword inputs

  const loginattempt = (e) => {
    e.preventDefault(); // Prevent page reload
    if (username === 'Samuel' && password === 'Pa$$w0rd') {
      navigate('/Dashboard'); // Navigate to login page
    } else {
      alert('Invalid credentials, try again.');
    }
  };

  return (
    <div>
      <h1>Login Page</h1>
      <form onSubmit={loginattempt}>
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
      </form>
    </div>
    );
  };
  
  export default Login;