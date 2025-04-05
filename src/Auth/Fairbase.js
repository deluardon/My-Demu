// Fairbase.js (or your Firebase config file)
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // Ensure this is imported
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6WdhIeNmKP9qzJeLoQZpCSwzoFdMA-Ss",
  authDomain: "demu-cc026.firebaseapp.com",
  projectId: "demu-cc026",
  storageBucket: "demu-cc026.firebasestorage.app",
  messagingSenderId: "982738411258",
  appId: "1:982738411258:web:85515d4a0911886c15b343",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Auth instance
const auth = getAuth(app);

// Get Firestore instance
const db = getFirestore(app);

// Get Storage instance
const storage = getStorage(app);

// Export necessary modules
export { auth, db, storage }; // Ensure storage is exported here
