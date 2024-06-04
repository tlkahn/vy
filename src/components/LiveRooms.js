import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideMenu from './SideMenu';
import { cable_api } from '../api';
import log from 'loglevel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const LiveRooms = () => {
  const [rooms, setRooms] = useState([]);
  const currentRoomInputName = 'roomNameInput';
  const [roomName, setRoomName] = useState('');
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirm = () => {
    createChannel();
    handleCloseModal();
  };

  const handleRoomClick = (selectedRoomId) => {
    navigate(`/liveroom/${selectedRoomId}`);
  };

  const activeFor = (room) => {
    const ms = new Date() - new Date(room.created_at);
    if (ms < 60000) return 'Less than a minute';
    const days = Math.floor(ms / (86400 * 1000));
    const hours = Math.floor((ms % (86400 * 1000)) / (3600 * 1000));
    const minutes = Math.floor((ms % (3600 * 1000)) / (60 * 1000));
    return [
      days && `${days} days`,
      hours && `${hours} hours`,
      minutes && `${minutes} minutes`,
    ]
      .filter(Boolean)
      .join(', ');
  };

  const createChannel = () => {
    if (!roomName) {
      return alert('Empty room name');
    }
    cable_api.post('/rooms', { room: { name: roomName } }).then(({ data }) => {
      setRooms([...rooms, data]);
      setRoomName('');
    });
  };

  useEffect(() => {
    log.info({ roomName });
  }, [roomName]);

  useEffect(() => {
    cable_api.get('/rooms').then((response) => {
      setRooms(response.data);
    });
  }, []);

  return (
    <>
      <div className="scene-video-background bg-gray-700 text-white min-h-screen">
        <div className="main container mx-auto px-4 py-8 flex flex-col md:flex-row h-full space-y-4 md:space-y-0">
          <SideMenu />
          <div id="main-content" className="w-full md:w-3/4 lg:w-6/7 pt-4">
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <li
                className="cursor-pointer hover:bg-gray-600 p-2 rounded-lg relative overflow-hidden flex flex-col justify-center items-center min-h-56 flex-grow col-span-2 sm:col-span-3 lg:col-span-5"
                style={{
                  backgroundImage: `url('http://localhost:3000/images/room1.jpeg')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transition: 'transform 0.3s ease', // Smooth transition for transform changes
                  transform: 'scale(1)', // Initial scale is 1
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = 'scale(1.05)')
                } // Scale up a bit when mouse hovers
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = 'scale(1)')
                } // Return to initial scale when mouse is not hovering
              >
                <div
                  className="room-name-setter"
                  style={{
                    width: '25%',
                    textAlign: 'center',
                  }}
                >
                  <button
                    onClick={handleOpenModal}
                    type="button"
                    style={{ width: '100%' }}
                  >
                    <FontAwesomeIcon icon={faPlus} size="3x" />
                  </button>
                </div>
              </li>
              {rooms.map((room) => (
                <li
                  key={room.id}
                  className="cursor-pointer hover:bg-gray-600 p-2 rounded-lg relative overflow-hidden"
                  onClick={() => handleRoomClick(room.id)}
                  style={{
                    backgroundImage: `url('http://localhost:3000/images/room1.jpeg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transition: 'transform 0.3s ease', // Smooth transition for transform changes
                    transform: 'scale(1)', // Initial scale is 1
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform = 'scale(1.05)')
                  } // Scale up a bit when mouse hovers
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = 'scale(1)')
                  } // Return to initial scale when mouse is not hovering
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      bottom: 0,
                      left: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.3)', // Adjust the opacity (0.5) to make it more or less dimmed
                    }}
                  ></div>
                  <div className="z-10 relative aspect-w-1 aspect-h-1">
                    <div className="text-md text-center font-bold flex flex-col justify-center items-center w-full">
                      {room.name}
                    </div>
                    <div className="text-sm flex items-center justify-center mt-8 w-full">
                      <span className="inline-flex items-center justify-center w-6">
                        <FontAwesomeIcon icon={faClock} />
                      </span>
                      <span className="inline-flex items-center justify-center">
                        {activeFor(room)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div>
        {showModal && (
          <div className="fixed inset-0 z-20 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black opacity-50"
              onClick={handleOverlayClick}
            ></div>
            <div className="bg-white rounded-lg p-6 w-96 mx-auto z-50">
              <h2 className="text-xl font-semibold mb-4">Create New Channel</h2>
              <input
                className="text-black border border-gray-300 p-2 w-full rounded"
                type="text"
                name={currentRoomInputName}
                placeholder="Room Name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
              <div className="mt-4 flex justify-end">
                <button
                  className="bg-gray-300 text-white px-4 py-2 rounded mr-2"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  className="bg-gray-700 text-white px-4 py-2 rounded"
                  onClick={handleConfirm}
                >
                  Create Channel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LiveRooms;
