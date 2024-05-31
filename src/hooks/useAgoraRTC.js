import { useState, useEffect } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import useToken from './useToken';
import { AGORA_APP_ID, AGORA_TOKEN_URL } from '../agora';

const useAgoraRTC = (roomId, rtcUid) => {
  const [rtcClient, setRtcClient] = useState(null);
  const [audioTracks, setAudioTracks] = useState({
    localAudioTrack: null,
    remoteAudioTracks: {},
  });
  const token = useToken(AGORA_TOKEN_URL, roomId, rtcUid);

  const killRtc = async () => {
    if (rtcClient) {
      audioTracks.localAudioTrack.stop();
      audioTracks.localAudioTrack.close();
      rtcClient.unpublish();
      rtcClient.leave();
    }
  };

  const initRtc = async () => {
    const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

    client.on('user-joined', handleUserJoined);
    client.on('user-published', handleUserPublished);
    client.on('user-left', handleUserLeft);

    if (token) {
      await client.join(AGORA_APP_ID, roomId, token, rtcUid);
      const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      await client.publish(localAudioTrack);

      setRtcClient(client);
      setAudioTracks((tracks) => ({ ...tracks, localAudioTrack }));
    }
  };

  useEffect(() => {
    initRtc();
    return () => {
      killRtc();
    };
  }, [token]);

  const handleUserJoined = async (user) => {
    console.log('USER:', user);
  };

  const handleUserPublished = async (user, mediaType) => {
    await rtcClient.subscribe(user, mediaType);

    if (mediaType === 'audio') {
      const remoteAudioTracks = {
        ...audioTracks.remoteAudioTracks,
        [user.uid]: [user.audioTrack],
      };
      setAudioTracks((tracks) => ({ ...tracks, remoteAudioTracks }));
      user.audioTrack.play();
    }
  };

  const handleUserLeft = async (user) => {
    const { [user.uid]: _, ...remoteAudioTracks } =
      audioTracks.remoteAudioTracks;
    setAudioTracks((tracks) => ({ ...tracks, remoteAudioTracks }));
  };

  return {
    rtcClient,
    audioTracks,
    killRtc,
  };
};

export default useAgoraRTC;
