// src/UserContext.js
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebaseConfig';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [lastActivity, setLastActivity] = useState(Date.now());

  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
  }, []);

  const resetActivityTimeout = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const checkInactivity = () => {
      const currentTime = Date.now();
      const inactivityLimit = 15 * 60 * 1000; // 15 דקות

      if (currentTime - lastActivity > inactivityLimit) {
        logout();
      }
    };

    const interval = setInterval(checkInactivity, 60 * 1000); // בדיקה כל דקה

    window.addEventListener('mousemove', resetActivityTimeout);
    window.addEventListener('keydown', resetActivityTimeout);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', resetActivityTimeout);
      window.removeEventListener('keydown', resetActivityTimeout);
    };
  }, [lastActivity, logout, resetActivityTimeout]);

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
