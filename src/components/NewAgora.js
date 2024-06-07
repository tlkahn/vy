import React, { useEffect, useRef, useState } from 'react';
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
    </>
  );
}

NewAgora.propTypes = {
  channel: PropTypes.string,
};

export default NewAgora;
