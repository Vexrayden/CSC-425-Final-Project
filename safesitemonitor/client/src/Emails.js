import { useNavigate } from 'react-router-dom';
import React from 'react';
import EmailForm from './EmailForm'; // Ensure this path is correct

const Emails = () => {
    return (
        <div style={{ padding: '20px' }}>
            <h1>Store Your Active Emails Here</h1>
            <EmailForm /> {/* Include the EmailForm component */}
        </div>
    );
};

export default Emails;