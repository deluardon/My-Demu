import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { AuthContext } from "../../Provider/AuthProvider";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // For eye icon to toggle password visibility
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify components
import 'react-toastify/dist/ReactToastify.css'; // Import the required styles

const Register = () => {
  const { createUser, signInWithGoogle } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State to toggle password visibility
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false); // State for confirm password visibility
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location (where the user was trying to go)
  const redirectTo = location.state?.from?.pathname || "/"; // Set the fallback to home page if no previous page

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z]).{6,}$/;
    return regex.test(password);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters long, include a capital letter, a number, and a special character.");
      toast.error("Password format is invalid.");
      return;
    }

    setLoading(true);
    try {
      await createUser(email, password);
      toast.success("Account created successfully!");
      setTimeout(() => {
        navigate(redirectTo); // Redirect to the previous page or home page
      }, 2000);
    } catch (err) {
      setError("Failed to create an account. Please try again.");
      toast.error("Account creation failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      await signInWithGoogle();
      toast.success("Signed in with Google successfully!");
      navigate(redirectTo); // Redirect to the previous page or home page
    } catch (err) {
      setError("Google Sign-in failed.");
      toast.error("Google Sign-in failed.");
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-blue-400 mb-4">
          Register for BlogZone
        </h2>

        {error && <p className="text-red-400 text-center">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 rounded bg-gray-700 text-white"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1">Password</label>
            <div className="relative">
              <input
                type={isPasswordVisible ? "text" : "password"} // Toggle password visibility
                className="w-full p-2 rounded bg-gray-700 text-white"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
              >
                {isPasswordVisible ? <FaEyeSlash /> : <FaEye />} {/* Toggle eye icon */}
              </button>
            </div>
          </div>

          <div>
            <label className="block mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={isConfirmPasswordVisible ? "text" : "password"} // Toggle confirm password visibility
                className="w-full p-2 rounded bg-gray-700 text-white"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
              >
                {isConfirmPasswordVisible ? <FaEyeSlash /> : <FaEye />} {/* Toggle eye icon */}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 py-2 rounded"
            disabled={loading}
          >
            {loading ? (
              <div className="flex justify-center items-center">
                <div className="spinner-border animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></div>
              </div>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={handleGoogleRegister}
            className="flex items-center justify-center w-full bg-red-500 hover:bg-red-600 py-2 rounded"
          >
            <FaGoogle className="mr-2" /> Register with Google
          </button>
        </div>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </div>

      {/* ToastContainer to display the toast notifications */}
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Register;
