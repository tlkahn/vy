import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import PropTypes from 'prop-types';

const AudioPlayer = forwardRef(({ src }, ref) => {
  const audioRef = useRef(null);

  const playAudio = () => {
    audioRef.current.play();
  };

  const pauseAudio = () => {
    audioRef.current.pause();
  };

  useImperativeHandle(ref, () => ({
    playAudio,
    pauseAudio,
  }));

  return (
    <>
      <audio ref={audioRef} src={src} loop />
    </>
  );
});

AudioPlayer.displayName = 'AudioPlayer';

AudioPlayer.propTypes = {
  src: PropTypes.string, // Validate src prop
};

export default AudioPlayer;
