import React from 'react';
import { useState, useEffect, useRef } from 'react';
import AudioPlayer from './AudioPlayer';
import { useParams } from 'react-router-dom';
import SideMenu from './SideMenu';
import api from '../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faHeart } from '@fortawesome/free-regular-svg-icons';
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';

const SequenceComponent = () => {
  const { id } = useParams();
  const [isFavoredList, setIsFavoredList] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  /**
   * - If `currentSession` changes (e.g., a new session is selected),
   *  - the effect will run, updating the `src` of the audio element
   *  - and playing the audio if `isPlaying` is `true`.  If
   *  - `isPlaying` changes (e.g., toggling between play and pause),
   *  - the effect will run, playing or pausing the audio depending on
   *  - the new value of `isPlaying`.  If none of the dependencies
   *  - change, the effect will not run again.
   */
  useEffect(() => {
    if (audioRef) {
      if (currentSession && currentSession.url) {
        if (audioRef.current.src != currentSession.url) {
          audioRef.current.src = currentSession.url;
        }
        if (isPlaying) {
          audioRef.current.playAudio();
        }
      }
    }
  }, [currentSession, isPlaying]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pauseAudio();
    } else {
      audioRef.current.playAudio();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    // Initialize isFavoredList with false for each session
    api
      .get(`/sessions_of/${id}`)
      .then((response) => setSessions(response.data))
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
        <AudioPlayer ref={audioRef} src={currentSession?.url} />
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
                          <FontAwesomeIcon icon={faClock} className="mr-2" />
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
                            <FontAwesomeIcon
                              icon={faHeart}
                              className="text-red-500"
                            />
                          ) : (
                            <FontAwesomeIcon
                              icon={faHeart}
                              className="text-gray-500"
                            />
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
                  <FontAwesomeIcon icon={faPause} />
                ) : (
                  <FontAwesomeIcon icon={faPlay} />
                )}
              </button>
            </div>
            {currentSession && (
              <div className="text-sm fixed w-full bottom-0 left-0 right-0 mt-20 text-center text-white bg-gray-700 bg-opacity-50 line-clamp-1">
                {isPlaying ? (
                  <span>
                    Now Playing: {currentSession.title} from{' '}
                    {currentSession.url}
                  </span>
                ) : (
                  <span>{currentSession.title}</span>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default SequenceComponent;
