import React, { useRef, useState } from 'react';
import {
  VERSION,
  createClient,
  createCameraVideoTrack,
  createMicrophoneAudioTrack,
  onCameraChanged,
  onMicrophoneChanged,
} from 'agora-rtc-sdk-ng/esm';

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

  const turnOnCamera = async (flag) => {
    flag = flag ?? !isVideoOn;
    setIsVideoOn(flag);

    if (videoTrack) {
      return videoTrack.setEnabled(flag);
    }
    videoTrack = await createCameraVideoTrack();
    videoTrack.play('camera-video');
  };

  const turnOnMicrophone = async (flag) => {
    flag = flag ?? !isAudioOn;
    setIsAudioOn(flag);

    if (audioTrack) {
      return audioTrack.setEnabled(flag);
    }

    audioTrack = await createMicrophoneAudioTrack();
    // audioTrack.play();
  };

  const [isJoined, setIsJoined] = useState(false);
  const appid = useRef('ed48e0cee69e41ffa303e26737ec210f');
  const token = useRef(
    '007eJxTYEhJKyq5kM8++W/5v83/ipZUVIhk3zaT/s8z71nT9VSXtB0KDKkpJhapBsmpqWaWqSaGaWmJxgbGqUZm5sbmqclGhgZpB2KT0hoCGRn4vyYwMEIhiM/IYMDAAABygB+R'
  );
  const uid = useRef('123');

  const joinChannel = async () => {
    if (!channel) {
      channel = 'react-room';
    }

    if (isJoined) {
      await leaveChannel();
    }

    client.on('user-published', onUserPublish);

    await client.join(
      appid.current,
      channel,
      token.current || null,
      uid.current
    );
    setIsJoined(true);
  };

  const leaveChannel = async () => {
    setIsJoined(false);
    setIsAudioPubed(false);
    setIsVideoPubed(false);

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
    await turnOnMicrophone(true);

    if (!isJoined) {
      await joinChannel();
    }

    await client.publish(audioTrack);
    setIsAudioPubed(true);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row">
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
              onClick={() => turnOnMicrophone()}
              className={`px-4 py-2 rounded ${
                isAudioOn
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Turn {isAudioOn ? 'off' : 'on'} Microphone
            </button>
          </div>
          <h3 className="mt-4 text-lg">
            {`Please input the appid and token (`}
            <a
              href="https://www.agora.io/en/blog/how-to-get-started-with-agora"
              className="text-blue-500 underline"
            >
              Create an account.
            </a>
            {`) `}
          </h3>
          <ul className="space-y-4 mt-4">
            <li>
              <p className="font-medium">appid</p>
              <input
                defaultValue={appid.current}
                placeholder="appid"
                onChange={(e) => (appid.current = e.target.value)}
                className="w-full px-2 py-1 border rounded"
              />
            </li>
            <li>
              <p className="font-medium">token</p>
              <input
                defaultValue={token.current}
                placeholder="token"
                onChange={(e) => (token.current = e.target.value)}
                className="w-full px-2 py-1 border rounded"
              />
            </li>
            <li>
              <p className="font-medium">uid</p>
              <input
                defaultValue={uid.current}
                placeholder="uid"
                onChange={(e) => (uid.current = e.target.value)}
                className="w-full px-2 py-1 border rounded"
              />
            </li>
          </ul>
          <h3 className="mt-4 text-lg">Channel name</h3>
          {channel}
          <div className="buttons space-x-2 mt-4">
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
        <div className="right-side p-4">
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

export default NewAgora;
