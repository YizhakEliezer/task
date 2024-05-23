// src/components/Profile.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { useUser } from '../UserContext';

const Profile = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div>
      {user ? (
        <>
          <p>Welcome, {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;
