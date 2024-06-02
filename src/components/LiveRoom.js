import React, { useEffect, useRef, useState } from 'react';
import BottomPlayer from './BottomPlayer';
import OnlinerList from './OnlinerList';
import SideMenu from './SideMenu';
import { useParams } from 'react-router-dom';
import useAgoraRTC from '../hooks/useAgoraRTC';
import log from 'loglevel';
import { useUserAuth } from '../context/UserAuthContext';

async function hashString(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint32Array(hashBuffer));

  // Convert the hash to an unsigned integer by taking the first 32-bit value
  return hashArray[0];
}

function LiveRoom() {
  const { roomId } = useParams();
  const { user } = useUserAuth();
  const prevUidRef = useRef(null);
  const prevUsernameRef = useRef(null);
  const [uidInt, setUidInt] = useState(null);
  const [_, setUsername] = useState(null);
  const { killRtc } = useAgoraRTC(roomId, uidInt);

  useEffect(() => {
    async function updateUidInt() {
      if (prevUidRef.current) {
        const hashedUid = await hashString(prevUidRef.current);
        setUidInt(hashedUid);
      }
    }
    updateUidInt();
  }, [prevUidRef.current]);

  useEffect(() => {
    if (prevUsernameRef.current) {
      setUsername(prevUsernameRef.current);
    }
  }, [prevUsernameRef.current]);

  useEffect(() => {
    return () => {
      killRtc();
    };
  }, [killRtc]);

  useEffect(() => {
    if (user && user.uid && user.uid !== prevUidRef.current) {
      log.info(`VY [INFO]: uid: ${JSON.stringify(user.uid)}`);
      prevUidRef.current = user.uid;
    }
    if (
      user &&
      user.displayName &&
      user.displayName !== prevUsernameRef.current
    ) {
      log.info(
        `VY [INFO]: user displayName: ${JSON.stringify(user.displayName)}`
      );
      prevUsernameRef.current = user.displayName;
    }
  }, [user]);

  useEffect(() => {
    log.info(`VY [INFO]: room id: ${roomId}`);
  }, [roomId]);

  return (
    <>
      <div className="scene-video-background bg-gray-700 text-white min-h-screen">
        <div className="main container mx-auto px-4 py-8 flex flex-col md:flex-row h-full space-y-4 md:space-y-0">
          <SideMenu />
          <div id="main-content" className="w-full md:w-3/4 lg:w-6/7 pt-4">
            <OnlinerList />
            <BottomPlayer />
          </div>
        </div>
      </div>
    </>
  );
}

export default LiveRoom;
