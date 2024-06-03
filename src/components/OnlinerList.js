import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Jdenticon from 'react-jdenticon';
import ProfileModal from './ProfileModal';

function OnlinerList({ onliners }) {
  const [profileUserId, setProfileUserId] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleOnlinerClick = (userId) => {
    setProfileUserId(userId);
    setIsProfileModalOpen(true);
  };

  return (
    <>
      <ul className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-4">
        {onliners &&
          onliners.map((onliner) => {
            return (
              <li
                key={onliner.id}
                className="flex flex-col items-center cursor-pointer hover:bg-gray-600 p-2 rounded-lg"
                onClick={() => handleOnlinerClick(onliner.id)}
              >
                <Jdenticon size="48" value={onliner.email} />
                <span className="text-sm">{onliner.email}</span>
                <i
                  className={`text-sm ${
                    onliner.device === 'iphone'
                      ? 'fa fa-apple'
                      : onliner.device === 'android'
                      ? 'fa fa-android'
                      : 'fa fa-globe'
                  }`}
                ></i>
              </li>
            );
          })}
      </ul>
      {isProfileModalOpen && (
        <ProfileModal
          isProfileModalOpen={isProfileModalOpen}
          setIsProfileModalOpen={setIsProfileModalOpen}
          userId={profileUserId}
        />
      )}
    </>
  );
}

OnlinerList.propTypes = {
  onliners: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      email: PropTypes.string.isRequired,
      device: PropTypes.oneOf(['iphone', 'android', 'web']),
    })
  ),
};

export default OnlinerList;
