import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const RequireAuth = ({ allowRoles }) => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user')); // Obtener el objeto de usuario del localStorage
  const userRole = user?.role; // Obtener el rol del usuario actual

  const isAuthorized = userRole && allowRoles.includes(userRole);

  return isAuthorized ? (
    <Outlet />
  ) : (
    <Navigate to="/user" state={{ from: location }} replace />
  );
};

export default RequireAuth;
