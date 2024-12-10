import React, { useContext } from 'react';
import { UserContext } from './context/UserContext'; // Import UserContext


const Profile = () => {
  const { user } = useContext(UserContext);

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div>
      <h2>Welcome, {user.username}!</h2>
      <img src={user.profileImage || '/default-profile.png'} alt="Profile" />
    </div>
  );
};

export default Profile;

