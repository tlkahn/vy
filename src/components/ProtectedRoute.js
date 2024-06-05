import React from 'react';
import { Outlet } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import Login from './Login';
import log from 'loglevel';

const verifyUser = (user) => {
  // TODO: validate user fields
  return !!user?.uid;
};

const ProtectedRoute = () => {
  const { user } = useUserAuth();
  log.info(`user from userUserAuth hook:`, { user });

  return verifyUser(user) ? <Outlet /> : <Login />;
};

export default ProtectedRoute;
