import React, { useEffect, useRef, useState } from 'react';
import BottomPlayer from './BottomPlayer';
import OnlinerList from './OnlinerList';
import SideMenu from './SideMenu';
import { useParams } from 'react-router-dom';
import useAgoraRTC from '../hooks/useAgoraRTC';
import log from 'loglevel';
import { useUserAuth } from '../context/UserAuthContext';
import { cable_api } from '../api';
import { createConsumer } from '@rails/actioncable';
import { getToken } from '../api';
import { useChat } from '../context/ChatContext';

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
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { loading } = useUserAuth();
  const { chatroomChannelRef, setMessages } = useChat();

  if (loading) {
    return <div>Loading...</div>;
  }

  useEffect(() => {
    log.info({ onlineUsers });
  }, [onlineUsers]);

  useEffect(() => {
    if (loading) return; // Wait until loading is complete
    const jwt = getToken(); // Get the JWT token from local storage or another storage mechanism
    const consumer = createConsumer(`ws://localhost:3333/cable?jwt=${jwt}`);

    chatroomChannelRef.current = consumer.subscriptions.create(
      'ChatroomChannel',
      {
        connected() {
          log.info('Connected to the chatroom!');
        },
        disconnected() {
          log.info('Disconnected from the chatroom!');
        },
        received(data) {
          log.info('Data from cable', { data });
          if (data.type === 'online_users') {
            setOnlineUsers(data.users);
          }
          if (data.type === 'message') {
            setMessages((prevMessages) => [...prevMessages, data.message]);
          }
        },
        speak(message) {
          this.perform('speak', { message });
        },
      }
    );

    cable_api.get('/messages').then((response) => {
      setMessages(response.data);
    });

    return () => {
      if (chatroomChannelRef.current) {
        chatroomChannelRef.current.unsubscribe();
        consumer.disconnect();
      }
    };
  }, [loading]);

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

  // useEffect(() => {
  //   return () => {
  //     killRtc();
  //   };
  // }, [killRtc]);

  useEffect(() => {
    if (user && user.uid && user.uid !== prevUidRef.current) {
      log.info(`[VY] [INFO]: uid: ${JSON.stringify(user.uid)}`);
      prevUidRef.current = user.uid;
    }
    if (
      user &&
      user.displayName &&
      user.displayName !== prevUsernameRef.current
    ) {
      log.info(
        `[VY] [INFO]: user displayName: ${JSON.stringify(user.displayName)}`
      );
      prevUsernameRef.current = user.displayName;
    }
  }, [user]);

  useEffect(() => {
    log.info(`[VY] [INFO]: room id: ${roomId}`);
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
