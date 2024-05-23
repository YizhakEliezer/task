import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import { auth, database } from "../firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import Loading from "./Loading";

const Home = ({ userName }) => {
  const [tasks, setTasks] = useState([]); // שמירת רשימת המשימות
  const [newTask, setNewTask] = useState(''); // שמירת המשימה החדשה
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();







  useEffect(() => {
    const fetchTasks = async (user) => {
      try {
        const userDoc = doc(database, 'users', user.uid);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setTasks(userData.tasks || []);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }finally {
        setIsLoading(false);
      }
    };





    const unsubscribe = auth.onAuthStateChanged(user => {
      console.log(user)
      if (user) {
        setUserId(user.uid);
        fetchTasks(user);
      } else {
        setTasks([]);
      }
    });

    return () => unsubscribe();
  }, []);





  const addTask = async (e) => {
    e.preventDefault();
    const updatedTasks = [...tasks, newTask]; 
    setTasks(updatedTasks);
    setNewTask(''); 






  // שמירת המשימות ב-Firebase
    try {
      const userDoc = doc(database, 'users', userId);
      await setDoc(userDoc, { tasks: updatedTasks }, { merge: true });
    } catch (error) {
      console.error("Error saving tasks:", error);
    }
  };






  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out");
        setUserId(null);
         navigate('/');
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };





  if (isLoading) {
    return <Loading />;
  }



  return (
    <div className='container-home'>
      <div className="header">
        <i className="fa-solid fa-list-check"></i>
        <p className="nameUser">{userName}</p>
        <button onClick={handleSignOut} className="signOut">Sign Out</button>
      </div>
      <div className='main'>






        <form onSubmit={addTask}>
          <input
            placeholder='Add task'
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button type='submit'>Add Task</button>
        </form>

   





        <div className='task-list'>
          {tasks.map((task, index) => (
            <p key={index}>{task}</p>
          ))}
        </div>


      </div>
    </div>
  );
};

export default Home;
