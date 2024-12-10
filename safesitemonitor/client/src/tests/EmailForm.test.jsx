import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import EmailForm from '../EmailForm';

// Mock axios
const mock = new MockAdapter(axios);

describe('EmailForm Component', () => {
  afterEach(() => {
    mock.reset();
  });

  it('renders the form with all fields and submit button', () => {
    render(<EmailForm userId="12345" authToken="test-token" />);

    // Check form fields and button
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/service/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('shows an error when userId is missing', async () => {
    render(<EmailForm userId="" authToken="test-token" />);

    // Fill out form
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/service/i), { target: { value: 'TestService' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Verify error message
    await waitFor(() => {
      expect(screen.getByText(/user id is missing/i)).toBeInTheDocument();
    });
  });

  it('sends a POST request and shows success message on valid submission', async () => {
    // Mock successful API response
    mock
      .onPost('http://localhost:3000/api/user/12345/accounts')
      .reply(200, { message: 'Success' });

    render(<EmailForm userId="12345" authToken="test-token" />);

    // Fill out form
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/service/i), { target: { value: 'TestService' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Verify success message
    await waitFor(() => {
      expect(screen.getByText(/account saved successfully!/i)).toBeInTheDocument();
    });

    // Verify input fields are cleared
    expect(screen.getByLabelText(/email/i)).toHaveValue('');
    expect(screen.getByLabelText(/password/i)).toHaveValue('');
    expect(screen.getByLabelText(/service/i)).toHaveValue('');
  });

  it('shows an error message when the API request fails', async () => {
    // Mock failed API response
    mock
      .onPost('http://localhost:3000/api/user/12345/accounts')
      .reply(400, { error: 'Invalid data' });

    render(<EmailForm userId="12345" authToken="test-token" />);

    // Fill out form
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/service/i), { target: { value: 'TestService' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Verify error message
    await waitFor(() => {
      expect(screen.getByText(/error saving account: invalid data/i)).toBeInTheDocument();
    });
  });
});
