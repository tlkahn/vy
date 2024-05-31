import { useState, useEffect } from 'react';
import AgoraRTM from 'agora-rtm-sdk';
import useToken from './useToken';
import { AGORA_APP_ID, AGORA_TOKEN_URL } from '../agora';

const useAgoraRTM = (roomId, name) => {
  const [rtmClient, setRtmClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [avatar, _] = useState(null);
  const rtmUid = String(Math.floor(Math.random() * 2032));
  const token = useToken(AGORA_TOKEN_URL, roomId, rtmUid);

  useEffect(() => {
    const initRtm = async () => {
      const client = AgoraRTM.createInstance(AGORA_APP_ID);
      await client.login({ uid: rtmUid, token: token });

      const ch = client.createChannel(roomId);
      await ch.join();

      await client.addOrUpdateLocalUserAttributes({
        name: name,
        userRtcUid: rtmUid.toString(),
        userAvatar: avatar,
      });

      getChannelMembers();

      window.addEventListener('beforeunload', killRTM);

      ch.on('MemberJoined', handleMemberJoined);
      ch.on('MemberLeft', handleMemberLeft);

      setRtmClient(client);
      setChannel(ch);
    };

    initRtm();

    return () => {
      killRTM();
    };
  }, [name]);

  const handleMemberJoined = async (MemberId) => {
    return await rtmClient.getUserAttributesByKeys(MemberId, [
      'name',
      'userRtcUid',
      'userAvatar',
    ]);
  };

  const handleMemberLeft = async (MemberId) => console.log(MemberId);

  const getChannelMembers = async () => {
    const members = await channel.getMembers();

    return Promise.all(
      members.map(async (member) => {
        const { name, userRtcUid, userAvatar } =
          await rtmClient.getUserAttributesByKeys(member, [
            'name',
            'userRtcUid',
            'userAvatar',
          ]);
        return { name, userRtcUid, userAvatar };
      })
    );
  };

  const killRTM = async () => {
    if (channel) {
      await channel.leave();
    }
    if (rtmClient) {
      await rtmClient.logout();
    }
  };

  return { rtmClient, channel, avatar };
};

export default useAgoraRTM;
