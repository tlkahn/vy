import React, { useState, useEffect } from 'react';
import Jdenticon from 'react-jdenticon';
import ProfileModal from './ProfileModal';
import api from '../api';

function OnlinerList() {
  const [onliners, setOnliners] = useState([]);
  const [profileUserId, setProfileUserId] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleOnlinerClick = (userId) => {
    setProfileUserId(userId);
    setIsProfileModalOpen(true);
  };

  useEffect(() => {
    (async () => {
      const response = await api.get('/onliners');
      setOnliners(await response.data);
    })();
  }, []);

  return (
    <>
      <ul className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-4">
        {onliners.map((onliner) => (
          <li
            key={onliner.id}
            className="flex flex-col items-center cursor-pointer hover:bg-gray-600 p-2 rounded-lg"
            onClick={() => handleOnlinerClick(onliner.id)}
          >
            <Jdenticon size="48" value={onliner.alias} />
            <span className="text-sm">{onliner.alias}</span>
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
        ))}
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

export default OnlinerList;
