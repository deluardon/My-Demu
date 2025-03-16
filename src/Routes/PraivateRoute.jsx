import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../Provider/AuthProvider';
// Import AuthContext

const PrivateRoute = () => {
  const { user } = useContext(AuthContext); // Get the user from AuthContext

  // If user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user is logged in, render the child components
  return ;
};

export default PrivateRoute;
