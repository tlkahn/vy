import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import PropTypes from 'prop-types';

const AudioPlayer = ({ src }, ref) => {
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
};

AudioPlayer.propTypes = {
  src: PropTypes.string.isRequired, // Validate src prop
};

export default forwardRef(AudioPlayer);
