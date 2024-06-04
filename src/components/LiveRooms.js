import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideMenu from './SideMenu';
import { cable_api } from '../api';
import log from 'loglevel';

const LiveRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const currentRoomInputName = 'roomNameInput';
  const [roomName, setRoomName] = useState('');
  const navigate = useNavigate();

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
      // TODO: Pop up the modal which contains the room name input
      return alert('empty roomName');
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

  useEffect(() => {
    return () => {
      if (currentRoom) {
        currentRoom.unsubscribe();
      }
    };
  }, [currentRoom]);

  return (
    <>
      <div className="scene-video-background bg-gray-700 text-white min-h-screen">
        <div className="main container mx-auto px-4 py-8 flex flex-col md:flex-row h-full space-y-4 md:space-y-0">
          <SideMenu />
          <div id="main-content" className="w-full md:w-3/4 lg:w-6/7 pt-4">
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
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
                        <i className="fa fa-clock-o"></i>
                      </span>
                      <span className="inline-flex items-center justify-center">
                        {activeFor(room)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="room-name-setter">
              <input
                className="text-black"
                type="text"
                name={currentRoomInputName}
                placeholder="Room Name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
              <button onClick={createChannel} type="button">
                Create Channel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LiveRooms;
