import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import ProfileModal from './ProfileModal';
import log from 'loglevel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBolt, faSignOut } from '@fortawesome/free-solid-svg-icons';
import {
  faDotCircle,
  faUser,
  faComments,
} from '@fortawesome/free-regular-svg-icons';

const logoUrl = 'http://localhost:3000/images/logo.svg';
const profileTitle = 'Profile';
const signoutTitle = 'Sign out';

const SideMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { logOut, user } = useUserAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
      localStorage.clear();
    } catch (error) {
      log.info(error.message);
    }
  };

  const handleProfileButtonClick = () => {
    setIsProfileModalOpen(true);
  };

  if (user === null) {
    return <p>Loading...</p>; // Show a loading indicator or any other placeholder while waiting for the user data
  }

  return (
    <>
      <aside className="flex flex-col w-full md:w-1/4 lg:w-1/7 pt-4 pl-4 pr-4">
        <div className="flex items-center justify-between">
          <Link to="/home" className="logo-wrapper">
            <img src={logoUrl} alt="Logo" />
          </Link>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden focus:outline-none"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
        <nav className={`${isMenuOpen ? 'block' : 'hidden'} md:block`}>
          <ul className="space-y-4 mt-8 pr-4">
            <li
              className={`hover:bg-gray-800 rounded ${
                location.pathname === '/home' ? 'bg-gray-900' : ''
              }`}
            >
              <Link to="/home" className="flex items-center space-x-2">
                <span className="inline-flex items-center justify-center w-6">
                  <FontAwesomeIcon icon={faDotCircle} />
                </span>
                <span className="text-2xl">Meditate</span>
              </Link>
            </li>

            <li
              className={`hover:bg-gray-800 rounded ${
                /^\/liverooms?\/?\d*$/.test(location.pathname)
                  ? 'bg-gray-900'
                  : ''
              }`}
            >
              <Link to="/liverooms" className="flex items-center space-x-2">
                <span className="inline-flex items-center justify-center w-6">
                  <FontAwesomeIcon icon={faBolt} />
                </span>
                <span className="text-2xl">Now</span>
              </Link>
            </li>
            <hr className="my-2 border-gray-00" />
            <li
              key="profile"
              className={`hover:bg-gray-800 rounded ${
                isProfileModalOpen ? 'bg-gray-900' : ''
              }`}
            >
              <button
                onClick={handleProfileButtonClick}
                className="block w-full text-left space-x-2 focus:outline-none whitespace-nowrap flex items-center"
              >
                <span className="inline-flex items-center justify-center w-6">
                  <FontAwesomeIcon icon={faUser} />
                </span>
                <span className="text-2xl">{profileTitle}</span>
              </button>
            </li>
            <li key="sign-out" className="hover:bg-gray-800 rounded">
              <button
                onClick={handleLogout}
                className="block w-full text-left space-x-2 focus:outline-none whitespace-nowrap flex items-center"
              >
                <span className="inline-flex items-center justify-center w-6">
                  <FontAwesomeIcon icon={faSignOut} />
                </span>
                <span className="text-2xl">{signoutTitle}</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      <ProfileModal
        isProfileModalOpen={isProfileModalOpen}
        setIsProfileModalOpen={setIsProfileModalOpen}
        userId={user.uid}
      />
    </>
  );
};

export default SideMenu;
