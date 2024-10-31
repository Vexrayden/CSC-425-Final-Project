import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.js'; // Home page
import Login from './Login.js'; // Login page
import Dashboard from './Dashboard.js'; // Dashboard page
import Emails from './Emails.js'; // Emails page for MongoDB data
import './index.css'; // Global styles
import reportWebVitals from './reportWebVitals.js'; // Performance measure function

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Emails" element={<Emails />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

// Call to report app performance, optional
reportWebVitals();
