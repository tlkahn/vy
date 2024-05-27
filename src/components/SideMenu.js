import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';

const logoUrl = 'http://localhost:3000/images/logo.svg';
const profileTitle = 'Profile';
const signoutTitle = 'Sign out';

const SideMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const { logOut } = useUserAuth();

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const descriptionRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleProfileButtonClick = () => {
    setIsProfileModalOpen(true);
  };

  // Update the handleFieldSubmit function to reset the editingField state
  const handleFieldSubmit = (field, value) => {
    console.log(`Submitting ${field}: ${value}`);
    // Implement the logic to update the user's information
    setEditingField(null); // Reset the editing field state
  };

  const handleKeyDown = (event, field) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setEditingField(null);
    }
  };

  const handleEditButtonClick = (field, fieldValue) => {
    setEditingField(field);
    const refLookup = {
      name: nameRef,
      email: emailRef,
      description: descriptionRef,
    };
    const ref = refLookup[field];

    if (ref?.current) {
      setTimeout(() => {
        ref.current.focus();
        const range = document.createRange();
        range.selectNodeContents(ref.current);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      }, 0);
    }
  };

  useEffect(() => {
    console.log('editingField:', editingField);
  }, [editingField]);

  useEffect(() => {
    const closeOnEsc = (event) => {
      if (event.key === 'Escape') {
        setIsProfileModalOpen(false);
      }
    };

    document.addEventListener('keydown', closeOnEsc);

    return () => document.removeEventListener('keydown', closeOnEsc);
  }, []);

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
            <i className="fa fa-bars" aria-hidden="true"></i>
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
                  <i className={'fa fa-dot-circle-o'} aria-hidden="true"></i>
                </span>
                <span className="text-2xl">Meditate</span>
              </Link>
            </li>
            <li
              className={`hover:bg-gray-800 rounded ${
                location.pathname === '/liveroom' ? 'bg-gray-900' : ''
              }`}
            >
              <Link to="/liveroom" className="flex items-center space-x-2">
                <span className="inline-flex items-center justify-center w-6">
                  <i className={'fa fa-bolt'} aria-hidden="true"></i>
                </span>
                <span className="text-2xl">Now</span>
              </Link>
            </li>
            <hr class="my-2 border-gray-500" />
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
                  <i className="fa fa-user" aria-hidden="true"></i>
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
                  <i className="fa fa-sign-out" aria-hidden="true"></i>
                </span>
                <span className="text-2xl">{signoutTitle}</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {isProfileModalOpen && (
        <>
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50"></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="lg:w-1/4 md:w-1/3 sm:w-1/2 bg-gray-900 bg-opacity-90 rounded-lg shadow-lg p-6 w-full max-w-md rounded-md">
              <div className="user-modal-header flex items-center justify-end mb-4">
                <button
                  className="text-right focus:outline-none"
                  onClick={() => setIsProfileModalOpen(false)}
                >
                  X
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div
                    ref={nameRef}
                    contentEditable={editingField === 'name'}
                    suppressContentEditableWarning
                    onKeyDown={(e) => handleKeyDown(e, 'name')}
                    onBlur={(e) =>
                      handleFieldSubmit('name', e.target.textContent)
                    }
                    className={`font-semibold ${
                      editingField === 'name'
                        ? 'bg-yellow-100 text-gray-700'
                        : ''
                    }`}
                  >
                    John Doe
                  </div>
                  <button
                    onClick={() =>
                      handleEditButtonClick('name', nameRef.current.textContent)
                    }
                    className="text-white focus:outline-none"
                  >
                    <i
                      className={`fa fa-edit ${editingField ? 'hidden' : ''}`}
                      aria-hidden="true"
                    ></i>
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <div
                    ref={descriptionRef}
                    contentEditable={editingField === 'description'}
                    suppressContentEditableWarning
                    onKeyDown={(e) => handleKeyDown(e, 'name')}
                    onBlur={(e) =>
                      handleFieldSubmit('description', e.target.textContent)
                    }
                    className={`font-semibold ${
                      editingField === 'description'
                        ? 'bg-yellow-100 text-gray-700'
                        : ''
                    }`}
                  >
                    Just another meditator
                  </div>
                  <button
                    onClick={() =>
                      handleEditButtonClick(
                        'description',
                        descriptionRef.current.textContent
                      )
                    }
                    className="text-white focus:outline-none"
                  >
                    <i
                      className={`fa fa-edit ${editingField ? 'hidden' : ''}`}
                      aria-hidden="true"
                    ></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SideMenu;
