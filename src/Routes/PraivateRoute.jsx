import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../Provider/AuthProvider';

const PrivateRoute = () => {
  const { user } = useContext(AuthContext); // Get the user from AuthContext
  const location = useLocation(); // Get the current location

  // If user is not logged in, redirect to login page with the current location (intended page)
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is logged in, render the child components
  return <Outlet />;
};

export default PrivateRoute;
