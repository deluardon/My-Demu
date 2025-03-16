// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6WdhIeNmKP9qzJeLoQZpCSwzoFdMA-Ss",
  authDomain: "demu-cc026.firebaseapp.com",
  projectId: "demu-cc026",
  storageBucket: "demu-cc026.firebasestorage.app",
  messagingSenderId: "982738411258",
  appId: "1:982738411258:web:85515d4a0911886c15b343"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { auth, storage };
const auth = getAuth(app);
