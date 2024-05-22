import React, { useState, useEffect } from 'react';
import 'font-awesome/css/font-awesome.min.css';

const BottomPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [bgms, setBgms] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [currentBgm, setCurrentBgm] = useState(null);
  const [audio, setAudio] = useState(null);

  const togglePlayPause = () => {
    if (audio) {
      isPlaying ? audio.pause() : audio.play();
    }
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
    fetch('http://localhost:3000/api/bgms')
      .then((response) => response.json())
      .then((data) => setBgms(data));
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

  const BgmPopup = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-1/2 p-6 rounded-md">
        <div className="flex justify-between items-center border-b-2 border-gray-200 pb-2 mb-4">
          <h2>Select Background Music</h2>
          <button
            className="text-gray-500 hover:text-black"
            onClick={handleChoose}
          >
            <i className="fa fa-times"></i>
          </button>
        </div>
        <ul className="divide-y divide-gray-200">
          {bgms.map((bgm) => (
            <li
              key={bgm.id}
              className="py-2 cursor-pointer hover:bg-gray-200"
              onClick={() => handleBgmSelection(bgm)}
            >
              {bgm.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 py-8 px-8 flex flex-col items-center justify-center">
      <div className="w-1/2 flex justify-between">
        <button
          className="text-white flex flex-col items-center"
          onClick={togglePlayPause}
        >
          <i className={isPlaying ? 'fa fa-pause' : 'fa fa-play'}></i>
          <span className="hidden sm:inline w-16 text-center">
            {isPlaying ? 'Pause' : 'Play'}
          </span>
        </button>
        <button
          className="text-white flex flex-col items-center"
          onClick={toggleRecord}
        >
          <i className={isRecording ? 'fa fa-circle' : 'fa fa-circle-o'}></i>
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
          <i className="fa fa-ellipsis-h"></i>
          <span className="hidden sm:inline w-16 text-center">Choose</span>
        </button>
      </div>
      {isPopupVisible && <BgmPopup />}
      {currentBgm && (
        <div className="fixed bottom-0 left-0 right-0 mt-20 mx-8 text-center text-white">
          {isPlaying ? (
            <span>Now Playing: {currentBgm.name}</span>
          ) : (
            <span>{currentBgm.name}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default BottomPlayer;
