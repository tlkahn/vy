/**
 * Deprecated notice
 *
 * This component is deprecated and not currently used by the
 * project. Please avoid using in any new code, as it may
 * be removed in future updates.
 *
 */

import React, { useState, useEffect, useRef, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import AudioPlayer from './AudioPlayer';
const QuestionForm = lazy(() => import('./QuestionForm'));
import api from '../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEllipsis,
  faPause,
  faPlay,
  faQuestion,
  faStop,
  faTimes,
  faVolumeMute,
  faVolumeUp,
} from '@fortawesome/free-solid-svg-icons';
import { faCircle as faCircleSolid } from '@fortawesome/free-solid-svg-icons';

const BottomPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [bgms, setBgms] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [currentBgm, setCurrentBgm] = useState(null);
  const [audio, setAudio] = useState(null);
  const [isMuted, setIsMuted] = useState(false);

  const audioPlayerRef = useRef(null);
  const navigate = useNavigate();

  const togglePlayPause = () => {
    audio &&
      (isPlaying
        ? audioPlayerRef.current?.pauseAudio()
        : audioPlayerRef.current?.playAudio());
    setIsPlaying(!isPlaying);
  };

  const toggleRecord = () => {
    setIsRecording(!isRecording);
  };

  const handleChoose = () => {
    // Handle choose action
    setIsPopupVisible(!isPopupVisible);
  };

  useEffect(() => {
    api.get('/bgms').then((response) => setBgms(response.data));
  }, []);

  useEffect(() => {
    if (currentBgm) {
      const newAudio = new Audio(currentBgm.url);
      setAudio(newAudio);
    } else {
      setAudio(null);
    }
  }, [currentBgm]);

  const handleBgmSelection = (bgm) => {
    // Handle the selected background music
    setCurrentBgm(bgm);
    setIsPopupVisible(false);
  };

  const handleDismiss = () => {
    if (window.confirm('Are you sure you want to leave the room?')) {
      // Handle dismissing the room
      navigate('/liverooms');
    }
  };

  const BgmPopup = () => {
    useEffect(() => {
      const closeOnEsc = (event) => {
        if (event.key === 'Escape') {
          setIsPopupVisible(false);
        }
      };
      document.addEventListener('keydown', closeOnEsc);
      return () => document.removeEventListener('keydown', closeOnEsc);
    }, []);
    return (
      <>
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50">
          <div className="bg-gray-700 text-white w-1/2 p-6 rounded-md">
            <div className="flex justify-between items-center border-b-2 border-gray-200 pb-2 mb-4">
              <h2>Select Background Music</h2>
              <button
                className="text-white hover:text-black"
                onClick={handleChoose}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <ul className="divide-y divide-gray-200">
              {bgms.map((bgm) => (
                <li
                  key={bgm.id}
                  className="py-2 cursor-pointer hover:bg-gray-800"
                  onClick={() => handleBgmSelection(bgm)}
                >
                  {bgm.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </>
    );
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => setIsModalVisible(!isModalVisible);

  useEffect(() => {
    const closeOnEsc = (event) => {
      if (event.key === 'Escape') {
        setIsModalVisible(false);
      }
    };

    document.addEventListener('keydown', closeOnEsc);

    return () => document.removeEventListener('keydown', closeOnEsc);
  }, []);

  const toggleMuteUnmute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 py-8 px-8 flex flex-col items-center justify-center select-none">
        <div className="w-1/2 flex justify-between">
          <AudioPlayer ref={audioPlayerRef} src={currentBgm?.url} />
          <button
            className={`flex flex-col items-center ${
              currentBgm ? 'text-white' : 'text-gray-400'
            }`}
            onClick={togglePlayPause}
            disabled={!currentBgm}
          >
            {isPlaying ? (
              <FontAwesomeIcon icon={faPause} />
            ) : (
              <FontAwesomeIcon icon={faPlay} />
            )}
            <span className="hidden sm:inline w-16 text-center">
              {isPlaying ? 'Pause' : 'Play'}
            </span>
          </button>
          <button
            className={`flex flex-col items-center`}
            onClick={toggleMuteUnmute}
          >
            {isMuted ? (
              <FontAwesomeIcon icon={faVolumeMute} />
            ) : (
              <FontAwesomeIcon icon={faVolumeUp} />
            )}
            <span className="hidden sm:inline w-16 text-center">
              {isMuted ? 'Unmute' : 'Mute'}
            </span>
          </button>
          <button
            className="text-white flex flex-col items-center"
            onClick={toggleRecord}
          >
            {isRecording ? (
              <FontAwesomeIcon icon={faStop} />
            ) : (
              <FontAwesomeIcon icon={faCircleSolid} />
            )}
            <span className="hidden sm:inline w-16 text-center">
              {isRecording ? 'Stop' : 'Record'}
            </span>
          </button>
          <button
            className={`flex flex-col items-center ${
              isPlaying ? 'text-gray-400' : 'text-white'
            }`}
            onClick={isPlaying ? undefined : handleChoose}
          >
            <FontAwesomeIcon icon={faEllipsis} />
            <span className="hidden sm:inline w-16 text-center">Choose</span>
          </button>
          <button
            className="text-white flex flex-col items-center"
            onClick={toggleModal}
          >
            <FontAwesomeIcon icon={faQuestion} />
            <span className="hidden sm:inline w-16 text-center">Ask</span>
          </button>
          <button
            className="text-white flex flex-col items-center"
            onClick={handleDismiss}
          >
            <FontAwesomeIcon icon={faTimes} />
            <span className="hidden sm:inline w-16 text-center">Dismiss</span>
          </button>
        </div>
        {currentBgm && (
          <div className="fixed w-full bottom-0 left-0 right-0 mt-20 text-center text-white bg-gray-700 bg-opacity-50 line-clamp-1">
            {isPlaying ? (
              <span>
                Now Playing: {currentBgm.name} from {currentBgm.url}
              </span>
            ) : (
              <span>{currentBgm.name}</span>
            )}
          </div>
        )}
        {isPopupVisible && <BgmPopup />}
        {isModalVisible && <QuestionForm toggleModal={toggleModal} />}
      </div>
    </>
  );
};

export default BottomPlayer;
