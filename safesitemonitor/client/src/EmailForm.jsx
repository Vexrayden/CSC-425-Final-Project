import axios from 'axios';
import React, { useState } from 'react';
import UserContext from './context/UserContext';

const EmailForm = ({ userId, authToken }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [service, setService] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId) {
            setError('User ID is missing. Please log in again.');
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:3000/api/user/${userId}/accounts`,
                { email, password, service },
                { headers: { Authorization: `Bearer ${authToken}` } }
            );

            setMessage('Account saved successfully!');
            setError('');
            console.log(response.data);
        } catch (err) {
            setError('Error saving account: ' + (err.response?.data?.error || err.message));
            setMessage('');
        }

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

