import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import Login from './Login';

const ProtectedRoute = () => {
  const { user } = useUserAuth();

  return user ? <Outlet /> : <Login />;
};

export default ProtectedRoute;