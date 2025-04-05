import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../Provider/AuthProvider";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle closing the dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logOut();
      setIsMenuOpen(false);
      navigate("/"); // Redirect to home after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleProtectedRoute = (path) => {
    if (!user) {
      navigate("/login", { state: { from: path } }); // Save intended path
    } else {
      navigate(path);
    }
  };

  const isActive = (path) => location.pathname === path ? "text-blue-500" : "hover:text-blue-300";

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 shadow-md">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        {/* Left Side - Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-400">
          BlogZone
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-white"
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-grow justify-center space-x-6">
          <Link to="/" className={`${isActive("/")}`}>Home</Link>
          <Link to="/all-blogs" className={`${isActive("/all-blogs")}`}>All Blogs</Link>
          <Link to="/featured" className={`${isActive("/featured")}`}>Featured Blogs</Link>
          <button onClick={() => handleProtectedRoute("/add-blog")} className="hover:text-blue-300">Add Blog</button>
          <div>
            {user && (
              <Link to="/wishlist" className={`${isActive("/wishlist")}`}>Wishlist</Link>
            )}
          </div>
        </div>

        {/* Desktop Authentication Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {!user ? (
            <div className="flex space-x-4">
              <Link to="/login" className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600">Login</Link>
              <Link to="/register" className="px-4 py-2 bg-green-500 rounded hover:bg-green-600">Register</Link>
            </div>
          ) : (
            <div className="relative flex items-center space-x-4">
              {/* Profile section with image and dropdown */}
              <div className="relative">
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center space-x-2">
                  <img src={user.photoURL || "https://via.placeholder.com/40"} alt="Profile" className="w-10 h-10 rounded-full border border-gray-400 hover:border-blue-400" />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div ref={dropdownRef} className="absolute right-0 mt-2 bg-gray-700 text-white rounded-lg shadow-lg w-48 z-50">
                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-600" onClick={() => setIsDropdownOpen(false)}>
                      My Profile
                    </Link>
                    <Link to="/my-blogs" className="block px-4 py-2 hover:bg-gray-600" onClick={() => setIsDropdownOpen(false)}>
                      My Blogs
                    </Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 bg-red-500 rounded hover:bg-red-600">
                      Logout
                    </button>
                  </div>
                )}
              </div>
              {/* Logout button next to the profile */}
              <button onClick={handleLogout} className="hidden md:block px-4 py-2 bg-red-500 rounded hover:bg-red-600 ml-4">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      <div className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 transform transition-all duration-300 ease-in-out z-50 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} md:hidden`}>
        <div className="flex justify-between items-center p-4">
          <Link to="/" className="text-2xl font-bold text-blue-400">BlogZone</Link>
          <button onClick={() => setIsMenuOpen(false)} className="text-white">
            <FaTimes size={24} />
          </button>
        </div>

        <div className="flex flex-col text-center space-y-6 p-4">
          <Link to="/" className={`${isActive("/")}`} onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/all-blogs" className={`${isActive("/all-blogs")}`} onClick={() => setIsMenuOpen(false)}>All Blogs</Link>
          <Link to="/featured" className={`${isActive("/featured")}`} onClick={() => setIsMenuOpen(false)}>Featured Blogs</Link>
          <button onClick={() => handleProtectedRoute("/add-blog")} className="hover:text-blue-300" onClick={() => setIsMenuOpen(false)}>Add Blog</button>

          <div className="mt-4">
            {!user ? (
              <div className="space-y-4">
                <Link to="/login" className="block px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 text-center" onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link to="/register" className="block px-4 py-2 bg-green-500 rounded hover:bg-green-600 text-center" onClick={() => setIsMenuOpen(false)}>Register</Link>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                <div className="text-center space-y-2">
                  <Link to="/profile" className="hover:text-blue-300" onClick={() => setIsMenuOpen(false)}>My Profile</Link>
                  <br />
                  <Link to="/my-blogs" className="hover:text-blue-300" onClick={() => setIsMenuOpen(false)}>My Blogs</Link>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <img src={user.photoURL || "https://via.placeholder.com/40"} alt="Profile" className="w-10 h-10 rounded-full border" />
                  <button onClick={handleLogout} className="px-4 py-2 bg-red-500 rounded hover:bg-red-600">Logout</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
