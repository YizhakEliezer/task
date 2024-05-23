// src/components/Logout.js
import React from 'react';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { useUser } from '../UserContext';

const Logout = () => {
  const { user } = useUser();

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div>
      {user && (
        <>
          <p>Welcome, {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </div>
  );
};

export default Logout;
