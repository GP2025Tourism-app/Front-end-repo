import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component }) => {
  const token = localStorage.getItem('authToken'); 

  if (!token) {
    alert("You need to sign up or log in first to access this page."); 
    return <Navigate to="/" replace />;
  }

  return Component; 
};

export default ProtectedRoute;
