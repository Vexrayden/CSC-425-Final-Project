import { render, screen } from '@testing-library/react';
import { UserContext } from './context/UserContext'; // Import UserContext
import Profile from '../Profile';

// Mock data for the user context
const mockUser = {
  username: 'JohnDoe',
  profileImage: 'https://example.com/profile.jpg',
};

describe('Profile Component', () => {
  test('shows loading message when user is not provided', () => {
    render(
      <UserContext.Provider value={{ user: null }}>
        <Profile />
      </UserContext.Provider>
    );

    // Check if the "Loading user data..." message is displayed
    expect(screen.getByText('Loading user data...')).toBeInTheDocument();
  });

  test('displays user information when user is provided', () => {
    render(
      <UserContext.Provider value={{ user: mockUser }}>
        <Profile />
      </UserContext.Provider>
    );

    // Check if the username is displayed
    expect(screen.getByText(`Welcome, ${mockUser.username}!`)).toBeInTheDocument();
    // Check if the profile image is displayed with the correct src
    expect(screen.getByAltText('Profile')).toHaveAttribute('src', mockUser.profileImage);
  });

  test('displays default profile image when profileImage is not provided', () => {
    const userWithoutImage = { ...mockUser, profileImage: null };

    render(
      <UserContext.Provider value={{ user: userWithoutImage }}>
        <Profile />
      </UserContext.Provider>
    );

    // Check if the default profile image is displayed
    expect(screen.getByAltText('Profile')).toHaveAttribute('src', '/default-profile.png');
  });
});
