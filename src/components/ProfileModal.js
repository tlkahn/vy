import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const ProfileModal = ({
  isProfileModalOpen,
  setIsProfileModalOpen,
  userId,
}) => {
  if (!isProfileModalOpen) return null;

  const [editingField, setEditingField] = useState(null);

  const nameRef = useRef(null);
  const descriptionRef = useRef(null);
  const modalRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !containerRef.current.contains(event.target)) {
        setIsProfileModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileModalOpen]); // Add toggleModal to the dependencies array if it changes

  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:3000/api/onliners/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          if (nameRef.current) nameRef.current.textContent = data.alias;
          if (descriptionRef.current)
            descriptionRef.current.textContent = data.description;
        })
        .catch((error) => console.error('Error fetching user data:', error));
    }
  }, [userId]);

  // Update the handleFieldSubmit function to reset the editingField state
  const handleFieldSubmit = (field, value) => {
    console.log(`Submitting ${field}: ${value}`);
    // Implement the logic to update the user's information
    setEditingField(null); // Reset the editing field state
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setEditingField(null);
    }
  };

  const handleEditButtonClick = (field) => {
    setEditingField(field);
    const refLookup = {
      name: nameRef,
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
      <div
        ref={modalRef}
        className="fixed inset-0 z-50 bg-black bg-opacity-50"
      ></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          ref={containerRef}
          className="lg:w-1/4 md:w-1/3 sm:w-1/2 bg-gray-900 bg-opacity-90 rounded-lg shadow-lg p-6 w-full max-w-md rounded-md"
        >
          <div className="user-modal-header flex items-center justify-between text-white p-4 rounded-t-lg">
            <div className="flex justify-between items-center">
              <div ref={nameRef}></div>
            </div>
          </div>
          <div className="user-modal-content p-4 shadow-md">
            {/* Description Section */}
            <div className="flex justify-between">
              <div
                ref={descriptionRef}
                contentEditable={editingField === 'description'}
                suppressContentEditableWarning
                onKeyDown={(e) => handleKeyDown(e)}
                onBlur={(e) =>
                  handleFieldSubmit('description', e.target.textContent)
                }
                className={`font-semibold ${
                  editingField === 'description'
                    ? 'bg-yellow-100 text-gray-700'
                    : ''
                }`}
              ></div>
              <button
                onClick={() => handleEditButtonClick('description')}
                className="text-white focus:outline-none"
              >
                <i className={`fa fa-edit ${editingField ? 'hidden' : ''}`}></i>
              </button>
            </div>
          </div>
          <button
            onClick={() => {
              setIsProfileModalOpen(false);
            }}
            className="text-white absolute top-0 right-0 p-4 z-100"
          >
            <i className="fa fa-times"></i>
          </button>
        </div>
      </div>
    </>
  );
};

ProfileModal.propTypes = {
  isProfileModalOpen: PropTypes.bool.isRequired,
  setIsProfileModalOpen: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired, // Adjust the type based on actual usage, e.g., PropTypes.number if userId is a number
};

export default ProfileModal;
