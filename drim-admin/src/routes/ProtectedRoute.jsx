// components/ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Pages404 from '../pages/404';

const getUserRole = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.roleId?.name || null;
};

const ProtectedRoute = ({ allowedRoles,children }) => {
  const role = getUserRole();

  if (!role) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(role)) {
    return <Pages404/>;
  }
  
  return children;
};

export default ProtectedRoute;
