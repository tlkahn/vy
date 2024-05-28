import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import SideMenu from './SideMenu';

const SequenceComponent = () => {
  const { id } = useParams();
  const [isFavoredList, setIsFavoredList] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const audioRef = useRef(new Audio());
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (currentSession && currentSession.url) {
      if (audioRef.current.src != currentSession.url) {
        audioRef.current.src = currentSession.url;
      }
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentSession, isPlaying]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    // Initialize isFavoredList with false for each session
    fetch(`http://localhost:3000/api/sessions_of/${id}`)
      .then((response) => response.json())
      .then((data) => setSessions(data))
      .then(() => setIsFavoredList(sessions.map((session) => session.favored)));
  }, []);

  const toggleFavorite = (index) => {
    const updatedFavoredList = [...isFavoredList];
    updatedFavoredList[index] = !updatedFavoredList[index];
    // sync logic here
    setIsFavoredList(updatedFavoredList);
  };

  const handleSessionClick = (session) => {
    setCurrentSession(session);
    setIsPlaying(true);
  };

  return (
    <>
      <div className="scene-video-background bg-gray-700 text-white min-h-screen">
        <div className="main container mx-auto px-4 py-8 flex flex-col md:flex-row h-full">
          <SideMenu />
          <main
            id="main-content"
            className="w-full md:w-3/4 lg:w-6/7 pt-4 flex justify-center items-center"
          >
            <div className="program-layout bg-gray-700 text-white min-h-screen p-4 md:p-8 lg:w-1/2">
              <h1 className="program-title text-4xl font-bold mb-4 text-white">
                Program Title
              </h1>
              <h2 className="program-subtitle text-2xl font-semibold mb-2 text-gray-300">
                Program {id}
              </h2>
              <div className="program-container flex flex-col p-4 m-4">
                <div className="author-info flex items-center mb-8">
                  <div className="author-portrait mr-4">
                    <img
                      src="http://localhost:3000/images/author1.jpeg"
                      alt="Author Portrait"
                      className="w-24 h-24 rounded-full border-2 border-gray-500"
                    />
                  </div>
                  <div className="author-intro">
                    <p className="author-name text-lg font-semibold">
                      Author Name
                    </p>
                    <p className="author-brief text-gray-400">
                      Author Brief Introduction
                    </p>
                  </div>
                </div>
                <div className="program-list ml-0">
                  <ul>
                    {sessions.map((session, index) => (
                      <li
                        key={session.id}
                        className={`session flex items-center mb-2 ${
                          currentSession && session.id === currentSession.id
                            ? 'opacity-50'
                            : ''
                        }`}
                      >
                        <div
                          className="title text-lg font-semibold mr-2 cursor-pointer"
                          onClick={() => handleSessionClick(session)}
                        >
                          {session.title}
                        </div>
                        <div className="duration text-gray-600">
                          <i className="fa fa-clock-o mr-2"></i>
                          {session.duration}
                        </div>
                        <button
                          className="fav-heart ml-auto flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(index);
                          }}
                        >
                          {isFavoredList[index] ? (
                            <i className="fa fa-heart text-red-500"></i>
                          ) : (
                            <i className="fa fa-heart-o text-gray-500"></i>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="bottom-player fixed bottom-0 left-0 right-0 bg-gray-900 text-white flex items-center justify-between p-4">
              <button className="play-button mx-auto" onClick={togglePlay}>
                {isPlaying ? (
                  <i className="fa fa-pause"></i>
                ) : (
                  <i className="fa fa-play"></i>
                )}
              </button>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default SequenceComponent;
