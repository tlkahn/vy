import React, { useState, useEffect, useRef } from 'react';

const ProfileModal = ({
  isProfileModalOpen,
  setIsProfileModalOpen,
  userId,
}) => {
  if (!isProfileModalOpen) return null;

  const [editingField, setEditingField] = useState(null);

  const nameRef = useRef(null);
  const descriptionRef = useRef(null);

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
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50"></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="lg:w-1/4 md:w-1/3 sm:w-1/2 bg-gray-900 bg-opacity-90 rounded-lg shadow-lg p-6 w-full max-w-md rounded-md">
          <div className="user-modal-header flex items-center justify-between text-white p-4 rounded-t-lg">
            <div className="flex justify-between items-center">
              <div ref={nameRef}></div>
            </div>
            <button
              className="text-right focus:outline-none"
              onClick={() => setIsProfileModalOpen(false)}
            >
              X
            </button>
          </div>
          <div className="user-modal-content p-4 shadow-md">
            {/* Description Section */}
            <div className="flex justify-between">
              <div
                ref={descriptionRef}
                contentEditable={editingField === 'description'}
                suppressContentEditableWarning
                onKeyDown={(e) => handleKeyDown(e, 'description')}
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
                onClick={() =>
                  handleEditButtonClick(
                    'description',
                    descriptionRef.current.textContent
                  )
                }
                className="text-white focus:outline-none"
              >
                <i className={`fa fa-edit ${editingField ? 'hidden' : ''}`}></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileModal;