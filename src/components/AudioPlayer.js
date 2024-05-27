import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';

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

export default forwardRef(AudioPlayer);
