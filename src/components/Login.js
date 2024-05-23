import React, { useState } from "react";
import { auth, database, provider } from "../firebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import Loading from "./Loading";
import googleLogo from '../google1Logo.svg';
import '../globals.css';
import { trace } from "firebase/performance";



const Login = ({ setUserName }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erorUserOrPass, setErorUserOrPass] = useState(null);
  const [erorScreen, setErorScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageRegister, setpageRegister] = useState(false);

  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [emailRegister, setEmailRegister] = useState("");
  const [passwordRegister, setPasswordRegister] = useState("");
  const navigate = useNavigate();





  const handleLogin = async () => {
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      const userDoc = doc(database, 'users', auth.currentUser.uid);
      const userSnapshot = await getDoc(userDoc);
      const userData = userSnapshot.data();
      setUserName(userData.email);
      navigate('/user');
    } catch (error) {
      setIsLoading(false);
      setErorUserOrPass('username or password is wrong');
      console.error("Error signing in:", error);
    }
  };



  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      setErorScreen(false);
      const result = await signInWithPopup(auth, provider);
      const newUser = result.user;
      const userDoc = doc(database, 'users', newUser.uid);
      const userSnapshot = await getDoc(userDoc);

      if (!userSnapshot.exists()) {
        await setDoc(userDoc, {
          email: newUser.email,
          displayName: newUser.displayName
        });
      }
      setUserName(newUser.providerData[0].displayName);
      navigate('/user');
    } catch (error) {
      setIsLoading(false);
      setErorScreen(true);
      console.error("Error signing in with Google:", error);
    }

  };




  const handleRegister = async (e) => {
    e.preventDefault();
    if (passwordRegister !== confirmPassword) {
      setErorUserOrPass("Passwords don't match");

    }
    else if (passwordRegister.trim() === "" || emailRegister.trim() === "" || confirmPassword.trim() === "") {
      setErorUserOrPass("You must fill in a username and password");
    }

    else if (passwordRegister.length < 6) {
      setErorUserOrPass("Your password must contain at least 6 characters");
    }
    else{
    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, emailRegister, passwordRegister);
      const newUser = userCredential.user;
      await setDoc(doc(database, 'users', newUser.uid), {
        email: newUser.email
      });
      setUserName(newUser.email);
      navigate('/user');
    } catch (error) {
      setIsLoading(false);
      if (error.message.includes("auth/email-already-in-use")) {
        setErorUserOrPass("email already in use");
    }
      console.error("Error registering:", error);
    }
  }
  };




  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : erorScreen ? (
        <div className="container">
          <div className="header">
            <i className="fa-solid fa-list-check"></i>
            <p className="nameUser"></p>
          </div>
          <div className="main-eror">
            <div className="erorScreen">
              <h1>שגיאה בנסיון כניסה,אנא נסו שוב</h1>
              <button className="signin" onClick={signInWithGoogle}>
                <img src={googleLogo} className="googleLogo" alt="Google Logo" />Sign in with Google
              </button>
            </div>
          </div>
        </div>
      ) : (


        pageRegister ? (
          //signup
          <div className="container">
            <div className="header">
              <i className="fa-solid fa-list-check"></i>
              <p className="nameUser"></p>
            </div>
            <div className="main">
              <div className='start-work'>
              <button onClick={() => {setpageRegister(false); setErorUserOrPass("")}} className="return">BACK</button>
                <h1>Register here</h1>
                <form onSubmit={handleRegister}>
                  <input
                    type="email"
                    placeholder="Email"
                    value={emailRegister}
                    onChange={(e) => setEmailRegister(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Password"
                    value={passwordRegister}
                    onChange={(e) => setPasswordRegister(e.target.value)}
                  />
                  <input placeholder="password confirm" type='text' value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)} />

                  <div className="button-Registration">
                    <button type="submit" className="Registration">Register</button>
                  </div>
                </form>
                <span className="valid">{erorUserOrPass}</span>
                <button className="signin" onClick={signInWithGoogle}>
                  <img src={googleLogo} className="googleLogo" alt="Google Logo" />Sign in with Google
                </button>
                <p className="reast-pass">Forget Password?</p>
              </div>
            </div>
          </div>

        ) : (
          //login
          <div className="container">
            <div className="header">
              <i className="fa-solid fa-list-check"></i>
              <p className="nameUser"></p>
            </div>
            <div className="main">
              <div className='start-work'>
                <h1>Welcome to your task log</h1>
                <h1>Click "login" to start working.</h1>
                <form onSubmit={handleLogin}>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="button-Registration">
                    <button onClick={() => setpageRegister(true)} className="Registration">Register</button>
                    <button className="LogIn" type="submit">Login</button>
                  </div>
                </form>
                <span className="valid">{erorUserOrPass}</span>
                <button className="signin" onClick={signInWithGoogle}>
                  <img src={googleLogo} className="googleLogo" alt="Google Logo" />Sign in with Google
                </button>
                <p className="reast-pass">Forget Password?</p>
              </div>
            </div>
          </div>


        ))}
    </div>

    //      <div className="container">
    //        <div className="header">
    //          <i className="fa-solid fa-list-check"></i>
    //          <p className="nameUser"></p>
    //        </div>
    //        <div className="main">
    //          <div className='start-work'>
    //            <h1>Welcome to your task log</h1>
    //            <h1>Click "login" to start working.</h1>
    //            <form onSubmit={handleLogin}>
    //              <input
    //                type="email"
    //                placeholder="Email"
    //                value={email}
    //                onChange={(e) => setEmail(e.target.value)}
    //              />
    //              <input
    //                type="password"
    //                placeholder="Password"
    //                value={password}
    //                onChange={(e) => setPassword(e.target.value)}
    //              />
    //              <div className="button-Registration">
    //                <button onClick={()=>pageRegister(true)} className="Registration">Register</button>
    //                <button className="LogIn" type="submit">Login</button>
    //              </div>
    //            </form>
    //            <span className="valid">{erorUserOrPass}</span>
    //            <button className="signin" onClick={signInWithGoogle}>
    //              <img src={googleLogo} className="googleLogo" alt="Google Logo" />Sign in with Google
    //            </button>
    //            <p className="reast-pass">Forget Password?</p>
    //          </div>
    //        </div>
    //      </div>
    //    )}
    //  </div>
  );
};

export default Login;
