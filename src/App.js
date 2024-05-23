import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/Login';
import Home from './components/Home';
import { auth, database } from './firebaseConfig';
import { doc, getDoc } from "firebase/firestore";
import Loading from './components/Loading';

const App = () => {
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const fetchUserData = async (user) => {
      try {
        const userDoc = doc(database, 'users', user.uid);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          if (user.providerData[0].providerId === "google.com") {
            setUserName(user.providerData[0].displayName);
          } else {
            setUserName(userData.email);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        fetchUserData(user);
      } else {
        setUserName("");
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);



  if (isLoading) {
    return <Loading />;
  }



  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login setUserName={setUserName} />} />
        <Route path="/user" element={<Home userName={userName} />} />
        {/* <Route path="/Loading" element={<Loading />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
