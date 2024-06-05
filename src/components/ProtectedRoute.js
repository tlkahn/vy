import React from 'react';
import { Outlet } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import log from 'loglevel';

const verifyUser = (user) => {
  // TODO: validate user fields
  return !!user?.uid;
};

const ProtectedRoute = () => {
  const { user } = useUserAuth();
  log.info(`user from userUserAuth hook:`, { user });

  return verifyUser(user) ? (
    <Outlet />
  ) : (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-700">
      <div className="bg-white p-4 rounded shadow-md w-40 text-center">
        <p>Loading...</p>
      </div>
    </div>
  );
};

export default ProtectedRoute;
