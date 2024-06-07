import React, { useEffect, useRef, useState, lazy } from 'react';
import PropTypes from 'prop-types';
import {
  VERSION,
  createClient,
  createCameraVideoTrack,
  createMicrophoneAudioTrack,
  onCameraChanged,
  onMicrophoneChanged,
} from 'agora-rtc-sdk-ng/esm';
import log from 'loglevel';
import { useUserAuth } from '../context/UserAuthContext';
import { AGORA_APP_ID, AGORA_TOKEN_URL } from '../agora';
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

console.log('Current SDK VERSION: ', VERSION);

onCameraChanged((device) => {
  console.log('onCameraChanged: ', device);
});
onMicrophoneChanged((device) => {
  console.log('onMicrophoneChanged: ', device);
});

const client = createClient({
  mode: 'rtc',
  codec: 'vp8',
});

client.on('volume-indicator', function (result) {
  result.forEach(function (volume, index) {
    console.log(`${index} UID ${volume.uid} Level ${volume.level}`);
  });
});

let audioTrack;
let videoTrack;
function NewAgora({ channel }) {
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isAudioPubed, setIsAudioPubed] = useState(false);
  const [isVideoPubed, setIsVideoPubed] = useState(false);
  const [isVideoSubed, setIsVideoSubed] = useState(false);

  const { user } = useUserAuth();
  log.info({ uid: user.uid });

  const uid = useRef('');

  const appid = useRef(AGORA_APP_ID);

  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchToken = async () => {
      uid.current = user.uid;
      if (!uid.current) return;

      try {
        const response = await fetch(AGORA_TOKEN_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ channel_name: channel, uid: uid.current }),
        });

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const { token: rtcToken } = await response.json();
        log.info(rtcToken);
        setToken(rtcToken);
      } catch (error) {
        console.error('Failed to fetch token:', error);
      }
    };

    fetchToken();
  }, [user]);

  useEffect(() => {
    const startChannel = async () => {
      if (token) {
        await joinChannel();
        await publishAudio();
      }
    };
    startChannel();
  }, [token]);

  const turnOnCamera = async (flag) => {
    flag = flag ?? !isVideoOn;
    setIsVideoOn(flag);

    if (videoTrack) {
      return videoTrack.setEnabled(flag);
    }
    videoTrack = await createCameraVideoTrack();
    videoTrack.play('camera-video');
  };

  const toggleMic = async (flag) => {
    flag = flag ?? !isAudioOn;
    setIsAudioOn(flag);

    if (audioTrack) {
      return audioTrack.setEnabled(flag);
    }

    audioTrack = await createMicrophoneAudioTrack();
    // audioTrack.play();
  };

  const [isJoined, setIsJoined] = useState(false);

  const joinChannel = async () => {
    if (isJoined) {
      await leaveChannel();
    }

    client.on('user-published', onUserPublish);

    await client.join(appid.current, channel, token, uid.current);
    setIsJoined(true);
  };

  const leaveChannel = async () => {
    log.info('Leaving channel...');
    setIsJoined(false);
    setIsAudioPubed(false);
    setIsVideoPubed(false);

    await toggleMic(false);

    await client.leave();
  };

  const onUserPublish = async (user, mediaType) => {
    if (mediaType === 'video') {
      const remoteTrack = await client.subscribe(user, mediaType);
      remoteTrack.play('remote-video');
      setIsVideoSubed(true);
    }
    if (mediaType === 'audio') {
      const remoteTrack = await client.subscribe(user, mediaType);
      remoteTrack.play();
    }
  };

  const publishVideo = async () => {
    await turnOnCamera(true);

    if (!isJoined) {
      await joinChannel();
    }
    await client.publish(videoTrack);
    setIsVideoPubed(true);
  };

  const publishAudio = async () => {
    await toggleMic(true);

    if (!isJoined) {
      log.error("You haven't joined the channel: ", channel);
    }

    await client.publish(audioTrack);
    setIsAudioPubed(true);
  };

  const recordAudio = async (enabled) => {
    log.info(`Recording enbled ${enabled}...`);
    // TODO: To be implemented
  };

  return (
    <>
      <div
        className={`flex flex-col ${
          process.env.NODE_ENV === 'development' ? '' : 'hidden'
        }`}
      >
        <div className="left-side p-4">
          <div className="buttons space-x-2 mt-4">
            <button
              onClick={() => turnOnCamera()}
              className={`px-4 py-2 rounded ${
                isVideoOn
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Turn {isVideoOn ? 'off' : 'on'} camera
            </button>
            <button
              onClick={() => toggleMic()}
              className={`px-4 py-2 rounded ${
                isAudioOn
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Turn {isAudioOn ? 'off' : 'on'} Microphone
            </button>
          </div>
          <ul className="space-y-4 mt-4">
            <li>
              <p className="font-medium">appid</p>
              <p>{appid.current}</p>
            </li>
            <li>
              <p className="font-medium">token</p>
              <p>{token}</p>
            </li>
            <li>
              <p className="font-medium">uid</p>
              <p>{uid.current}</p>
            </li>
          </ul>
          <h3 className="mt-4 text-lg">Channel name</h3>
          {channel}
          <div className="buttons space-x-2 mt-4 flex-row flex">
            <button
              onClick={joinChannel}
              className={`px-4 py-2 rounded ${
                isJoined
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Join Channel
            </button>
            <button
              onClick={publishVideo}
              className={`px-4 py-2 rounded ${
                isVideoPubed
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Publish Video
            </button>
            <button
              onClick={publishAudio}
              className={`px-4 py-2 rounded ${
                isAudioPubed
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Publish Audio
            </button>
            <button
              onClick={leaveChannel}
              className="px-4 py-2 rounded bg-red-500 text-white"
            >
              Leave Channel
            </button>
          </div>
        </div>
        <div className="p-4">
          <video
            id="camera-video"
            className={`${isVideoOn ? 'block' : 'hidden'}`}
          ></video>
          <video
            id="remote-video"
            className={`${isVideoSubed ? 'block' : 'hidden'}`}
          ></video>
          {isJoined && !isVideoSubed ? (
            <div className="waiting mt-4 text-center text-gray-500">
              You can share the channel <b>{channel}</b> with others...
            </div>
          ) : null}
        </div>
      </div>
      <AgoraPlayer
        toggleMic={toggleMic}
        record={recordAudio}
        dismiss={leaveChannel}
      />
    </>
  );
}

const AgoraPlayer = ({ toggleMic, record, dismiss }) => {
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
    if (isRecording) {
      record(true);
    } else {
      record(false);
    }
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

  const handleDismiss = async () => {
    if (window.confirm('Are you sure you want to leave the room?')) {
      // Handle dismissing the room
      await dismiss();
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
    toggleMic();
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

NewAgora.propTypes = {
  channel: PropTypes.string,
};

AgoraPlayer.propTypes = {
  toggleMic: PropTypes.func.isRequired,
  record: PropTypes.func.isRequired,
  dismiss: PropTypes.func.isRequired,
};

export default NewAgora;
