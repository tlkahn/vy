import React, { useState } from 'react';
import 'font-awesome/css/font-awesome.min.css';

const BottomPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleRecord = () => {
    setIsRecording(!isRecording);
  };

  const handleChoose = () => {
    // Handle choose action
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 py-4 px-8 flex items-center justify-center">
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
    </div>
  );
};

export default BottomPlayer;
