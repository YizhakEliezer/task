
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"; // שימוש ב-signInWithEmailAndPassword ו-createUserWithEmailAndPassword ישירות מ- firebase/auth
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6ADO387t-1AHIHem9HkcFJ-X9JL5bXC8",
  authDomain: "xenon-shard-414307.firebaseapp.com",
  projectId: "xenon-shard-414307",
  storageBucket: "xenon-shard-414307.appspot.com",
  messagingSenderId: "768847239786",
  appId: "1:768847239786:web:8b051e89cf375de01c8813"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // קבל את אובייקט ה-Auth מהאפליקציה
const provider = new GoogleAuthProvider();
const database = getFirestore(app); // שימוש ב-getFirestore לקבלת בסיס הנתונים

export { auth, provider, database }; // אקספורט של auth, provider ו- database

