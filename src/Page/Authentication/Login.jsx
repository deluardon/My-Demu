import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { AuthContext } from "../../Provider/AuthProvider";
import { sendPasswordResetEmail, confirmPasswordReset } from "firebase/auth";
import { auth } from "../../Auth/Fairbase"; // Your Firebase config file

const Login = () => {
  const { signIn, signInWithGoogle } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      navigate("/");
    } catch (err) {
      setError("Invalid email or password.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      navigate("/");
    } catch (err) {
      setError("Google Sign-in failed.");
      console.error(err);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setError("Password reset email sent. Please check your inbox.");
      setForgotPassword(false);
    } catch (err) {
      setError("Failed to send password reset email.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmNewPassword = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await confirmPasswordReset(auth, verificationCode, newPassword);
      setResetPasswordSuccess(true);
    } catch (err) {
      setError("Invalid verification code or password.");
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-blue-400 mb-4">
          Login to BlogZone
        </h2>

        {error && <p className="text-red-400 text-center">{error}</p>}

        {!forgotPassword && !resetPasswordSuccess ? (
          <form onSubmit={handleLogin} className="space-y-4">
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
              <input
                type="password"
                className="w-full p-2 rounded bg-gray-700 text-white"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 py-2 rounded"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="text-center mt-4">
              <button
                onClick={handleGoogleLogin}
                className="flex items-center justify-center w-full bg-red-500 hover:bg-red-600 py-2 rounded"
              >
                <FaGoogle className="mr-2" /> Login with Google
              </button>
            </div>

            <p className="text-center mt-4">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-400 hover:underline">
                Register
              </Link>
            </p>

            <div className="text-center mt-4">
              <button
                onClick={() => setForgotPassword(true)}
                className="text-blue-400 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          </form>
        ) : forgotPassword && !resetPasswordSuccess ? (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div>
              <label className="block mb-1">Enter your email to reset password</label>
              <input
                type="email"
                className="w-full p-2 rounded bg-gray-700 text-white"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 py-2 rounded"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Email"}
            </button>

            <div className="text-center mt-4">
              <button
                onClick={() => setForgotPassword(false)}
                className="text-blue-400 hover:underline"
              >
                Back to Login
              </button>
            </div>
          </form>
        ) : (
          <p className="text-green-400 text-center mt-4">
            Password reset successful! You can now {" "}
            <Link to="/login" className="text-blue-400 hover:underline">
              Login
            </Link> with your new password.
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
