import axios from 'axios';
import React, { useState } from 'react';

const EmailForm = ({ userId, authToken }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [service, setService] = useState(''); // New state for the service
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Make a POST request to the API to save the account
            const response = await axios.post(
                `http://localhost:3000/api/user/${userId}/accounts`,
                {
                    email,
                    password,
                    service, // Add service to the request body
                },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`, // Pass the token for authentication
                    },
                }
            );

            setMessage('Account saved successfully!');
            setError('');
            console.log(response.data); // Response from the server
        } catch (err) {
            setError('Error saving account: ' + (err.response?.data?.error || err.message));
            setMessage('');
        }

        // Clear the input fields
        setEmail('');
        setPassword('');
        setService('');
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
                <div>
                    <label>Service:</label>
                    <input
                        type="text"
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
            {message && <p>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default EmailForm;
