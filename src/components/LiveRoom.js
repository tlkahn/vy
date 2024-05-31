import React, { useEffect } from 'react';
import BottomPlayer from './BottomPlayer';
import OnlinerList from './OnlinerList';
import SideMenu from './SideMenu';
import { useParams } from 'react-router-dom';
import useAgoraRTC from '../hooks/useAgoraRTC';

function LiveRoom() {
  const { roomId } = useParams();
  const rtcUid = 123;
  const { killRtc } = useAgoraRTC(roomId, rtcUid);

  useEffect(() => {
    return () => {
      killRtc();
    };
  }, [killRtc]);

  useEffect(() => {
    console.log(`room id: ${roomId}`);
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
