// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_UFOIwAdDXSSY9nFRfQ7SEBEKF--D3Vc",
  authDomain: "karta08-10bb0.firebaseapp.com",
  projectId: "karta08-10bb0",
  storageBucket: "karta08-10bb0.firebasestorage.app",
  messagingSenderId: "30224018997",
  appId: "1:30224018997:web:6cc1f784cd3f17455c0b7c",
  measurementId: "G-HK4XV7HBBQ"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
