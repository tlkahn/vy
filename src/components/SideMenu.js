import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const logoUrl = 'http://localhost:3000/images/logo.svg';

const SideMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const descriptionRef = useRef(null);

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

  const handleEditButtonClick = (event, field, fieldValue) => {
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
    // Fetch categories
    fetch('http://localhost:3000/api/categories')
      .then((response) => response.json())
      .then((data) => setCategories(data));
  });

  useEffect(() => {
    console.log('editingField:', editingField);
  }, [editingField]);

  return (
    <>
      <aside className="flex flex-col w-full md:w-1/4 lg:w-1/7 pt-4 pl-4 pr-4 space-y-4">
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
          <ul className="space-y-4 mt-4">
            {categories.map((category) => (
              <li key={category.id} className="hover:bg-gray-800 rounded">
                <Link to={category.url} className="flex items-center space-x-2">
                  <span className="inline-flex items-center justify-center w-6">
                    <i className={`fa ${category.icon}`} aria-hidden="true"></i>
                  </span>
                  <span className="text-2xl">{category.title}</span>
                </Link>
              </li>
            ))}
            <li key="profile" className="hover:bg-gray-800 rounded">
              <button
                onClick={handleProfileButtonClick}
                className="block w-full text-left space-x-2 focus:outline-none whitespace-nowrap flex items-center"
              >
                <span className="inline-flex items-center justify-center w-6">
                  <i className="fa fa-user" aria-hidden="true"></i>
                </span>
                <span className="text-2xl">Profile</span>
              </button>
            </li>
            <li key="sign-out" className="hover:bg-gray-800 rounded">
              <button
                onClick={() => handleNavigation('/logout')}
                className="block w-full text-left space-x-2 focus:outline-none whitespace-nowrap flex items-center"
              >
                <span className="inline-flex items-center justify-center w-6">
                  <i className="fa fa-sign-out" aria-hidden="true"></i>
                </span>
                <span className="text-2xl">Sign out</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 bg-opacity-90 p-6 w-full max-w-md rounded-md">
            <div className="user-modal-header flex justify-between items-center mb-4">
              <h2 className="text-2xl">Profile</h2>
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
                    editingField === 'name' ? 'bg-yellow-100 text-gray-700' : ''
                  }`}
                >
                  John Doe
                </div>
                <button
                  onClick={(event) =>
                    handleEditButtonClick(
                      event,
                      'name',
                      nameRef.current.textContent
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
              <div className="flex justify-between items-center">
                <div
                  ref={emailRef}
                  contentEditable={editingField === 'email'}
                  suppressContentEditableWarning
                  onKeyDown={(e) => handleKeyDown(e, 'name')}
                  onBlur={(e) =>
                    handleFieldSubmit('email', e.target.textContent)
                  }
                  className={`font-semibold ${
                    editingField === 'email'
                      ? 'bg-yellow-100 text-gray-700'
                      : ''
                  }`}
                >
                  john.doe@example.com
                </div>
                <button
                  onClick={(event) =>
                    handleEditButtonClick(
                      event,
                      'email',
                      emailRef.current.textContent
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
                  onClick={(event) =>
                    handleEditButtonClick(
                      event,
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
      )}
    </>
  );
};

export default SideMenu;
