import { createContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../Auth/Fairbase"; // Ensure correct path

export const AuthContext = createContext(null);

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Set loading to false after Firebase completes checking
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    error,
    createUser: (email, password) => createUserWithEmailAndPassword(auth, email, password),
    signIn: (email, password) => signInWithEmailAndPassword(auth, email, password),
    signInWithGoogle: () => signInWithPopup(auth, googleProvider),
    logOut: () => signOut(auth),
    updateUserProfile: (name, photo) => updateProfile(auth.currentUser, { displayName: name, photoURL: photo }),
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {!loading ? children : <div className="flex items-center justify-center h-screen text-white">Loading...</div>}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
