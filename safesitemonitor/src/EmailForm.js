
import axios from 'axios';

import React, { useState } from 'react';

const EmailForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Logic to send email and password to the server or handle them
        console.log('Email:', email);
        console.log('Password:', password);
        
        // You can implement an API call here to send data to your backend
        try {
            // Make a POST request to the API
            const response = await axios.post('http://localhost:3000/api/user', {
                email,
                password,
            });
            setMessage('Credentials saved successfully!');
            setError('');
            console.log(response.data); // Response from the server
        } catch (err) {
            setError('Error saving credentials: ' + err.response.data.error);
            setMessage('');
        }
        // For demonstration, let's display a message
        setMessage('Credentials saved successfully!');
        
        // Clear the input fields
        setEmail('');
        setPassword('');
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default EmailForm;