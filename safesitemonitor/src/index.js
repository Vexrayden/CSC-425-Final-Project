import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.js'; // app
import Login from './Login.js'; // login page
import Dashboard from './Dashboard.js';
import './index.css'; //styles for the index html i made
import Emails from './Emails.js'; // email page to push data to mongodb
import reportWebVitals from './reportWebVitals.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />  {/* Home page */}
          <Route path="/login" element={<Login />} /> {/* Login */}
          <Route path="/Dashboard" element={<Dashboard />} /> {/* Dashboard */}
          <Route path="/Emails" element={<Emails />} /> {/* Email Info */}
        </Routes>
      </Router>
    </React.StrictMode>
  );

  reportWebVitals(); //recccomended performance measuring function
