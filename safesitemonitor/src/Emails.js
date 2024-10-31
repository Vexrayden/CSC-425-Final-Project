import React from 'react';
import { useNavigate } from 'react-router-dom';
import EmailForm from './EmailForm.js'; // Import the EmailForm component

const App = () => {
    return (
        <div>
            <h1>Store Your Active Emails Here</h1>
            <EmailForm /> {/* Include the EmailForm component */}
        </div>
    );
};

export default Emails;