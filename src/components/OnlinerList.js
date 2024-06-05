import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Jdenticon from 'react-jdenticon';
import ProfileModal from './ProfileModal';
import platform from 'platform';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAndroid,
  faApple,
  faChrome,
  faFirefoxBrowser,
  faInternetExplorer,
} from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

const getIcon = () => {
  const os = platform.os.family.toLowerCase();
  const browser = platform.name.toLowerCase();

  if (os.includes('ios') || os.includes('iphone') || os.includes('ipad')) {
    return faApple;
  } else if (os.includes('android')) {
    return faAndroid;
  } else if (browser.includes('chrome')) {
    return faChrome;
  } else if (browser.includes('firefox')) {
    return faFirefoxBrowser;
  } else if (browser.includes('internet explorer')) {
    return faInternetExplorer;
  } else {
    return faGlobe; // Default icon for unknown cases
  }
};

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
                <FontAwesomeIcon icon={getIcon()} />
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
