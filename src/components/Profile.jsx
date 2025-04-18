// Profile.jsx
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../Provider/AuthProvider";
import { updateProfile, reauthenticateWithCredential, EmailAuthProvider, updateEmail, updatePassword } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, storage } from "../Auth/Fairbase"; // Make sure you're importing storage correctly
import { FaSpinner } from "react-icons/fa";

// Rest of your code...



const Profile = () => {
  const { user, setUser, loading, setLoading } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoURL, setPhotoURL] = useState(null); // To store the URL of the uploaded photo
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [isLoading, setIsLoading] = useState(false); // Spinner state

  useEffect(() => {
    if (user) {
      setName(user.displayName || "");
      setPhoto(user.photoURL || null);
      setEmail(user.email || "");
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true); // Show spinner

    try {
      let photoUrl = photoURL;

      // If a new photo was selected, upload it to Firebase Storage
      if (photo) {
        // Create a reference for the image in Firebase Storage
        const storageRef = ref(storage, `profile_pictures/${user.uid}`);

        // Upload the image to Firebase Storage
        const snapshot = await uploadBytes(storageRef, photo);
        console.log("Uploaded a blob or file!");

        // Get the download URL of the uploaded image
        photoUrl = await getDownloadURL(snapshot.ref);
      }

      // Update Firebase profile with the new name and photo URL
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photoUrl,
      });

      // Update email and password if provided
      if (email !== user.email) {
        await handleEmailUpdate();
      }
      if (password) {
        await handlePasswordUpdate();
      }

      // Update the context with new user info
      setUser({
        ...user,
        displayName: name,
        photoURL: photoUrl,
        email: email,
      });

      setSuccess("Profile updated successfully.");
      setIsModalOpen(true); // Open success modal
    } catch (err) {
      setError("Failed to update profile.");
      console.error(err);
    } finally {
      setIsLoading(false); // Hide spinner after operation
    }
  };

  const handleEmailUpdate = async () => {
    if (email === user.email) return;
    const userCredential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, userCredential);
    await updateEmail(user, email);
  };

  const handlePasswordUpdate = async () => {
    if (!password) return;
    await updatePassword(user, password);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result); // Optional: To preview the image before upload
      };
      reader.readAsDataURL(file);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-blue-400 mb-4">Profile</h2>

        {error && <p className="text-red-400 text-center">{error}</p>}
        {success && <p className="text-green-400 text-center">{success}</p>}

        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="block mb-1">Name</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-700 text-white"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              className="w-full p-2 rounded bg-gray-700 text-white"
              onChange={handleImageChange}
            />
            {photo && <img src={photo} alt="Profile" className="mt-4 w-32 h-32 rounded-full mx-auto" />}
          </div>

          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 rounded bg-gray-700 text-white"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1">Password</label>
            <input
              type="password"
              className="w-full p-2 rounded bg-gray-700 text-white"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 py-2 rounded"
            disabled={isLoading}
          >
            {isLoading ? <FaSpinner className="animate-spin" /> : "Update Profile"}
          </button>
        </form>
      </div>

      {/* Success Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl text-center text-green-400 mb-4">Profile Updated Successfully</h2>
            <p className="text-center text-gray-400">Your profile has been updated successfully.</p>
            <div className="mt-4 text-center">
              <button
                onClick={closeModal}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
