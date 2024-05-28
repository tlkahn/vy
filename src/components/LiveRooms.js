import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Jdenticon from 'react-jdenticon';
import SideMenu from './SideMenu';

const LiveRooms = () => {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  const handleRoomClick = (selectedRoomId) => {
    navigate(`/liveroom/${selectedRoomId}`);
  };

  const activeFor = (room) => {
    const ms = new Date() - new Date(room.from);
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

  useEffect(() => {
    (async () => {
      const response = await fetch('http://localhost:3000/api/rooms');
      setRooms(await response.json());
    })();
  }, []);

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
                      {room.channel}
                    </div>
                    <div className="text-sm flex items-center justify-center mt-8 w-full">
                      <span className="inline-flex items-center justify-center w-6">
                        <i className="fa fa-clock-o"></i>
                      </span>
                      <span className="inline-flex items-center justify-center w-16">
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
    </>
  );
};

export default LiveRooms;
