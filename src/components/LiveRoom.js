import React, { useEffect, useState } from 'react';
import OnlinerList from './OnlinerList';
import { useParams, useLocation } from 'react-router-dom';
import log from 'loglevel';
import { useUserAuth } from '../context/UserAuthContext';
import { createConsumer } from '@rails/actioncable';
import { getToken } from '../api';
import { useChat } from '../context/ChatContext';
import NewAgora from './NewAgora';

function LiveRoom() {
  const { roomId } = useParams();
  const { chatroomChannelRef, setMessages } = useChat();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { loading } = useUserAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  useEffect(() => {
    const handleNavigation = () => {};
    handleNavigation(); // Initial call to handle the current location
    return () => {
      handleNavigation();
    };
  }, [location]);

  useEffect(() => {
    log.info({ onlineUsers });
  }, [onlineUsers]);

  useEffect(() => {
    if (loading) return; // Wait until loading is complete
    const jwt = getToken(); // Get the JWT token from local storage or another storage mechanism
    const consumer = createConsumer(`ws://localhost:3333/cable?jwt=${jwt}`);

    chatroomChannelRef.current = consumer.subscriptions.create(
      { channel: 'ChatroomChannel', channel_id: roomId },
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
          this.perform('speak', { message, channel_id: roomId });
        },
      }
    );

    return () => {
      if (chatroomChannelRef.current) {
        chatroomChannelRef.current.unsubscribe({ channel_id: roomId });
        consumer.disconnect();
      }
    };
  }, [loading]);

  return (
    <>
      <div className="scene-video-background bg-gray-700 text-white min-h-screen">
        <div className="main container mx-auto px-4 py-8 flex flex-col md:flex-row h-full space-y-4 md:space-y-0">
          <div id="main-content" className="w-full md:w-3/4 lg:w-6/7 pt-4">
            <OnlinerList onliners={onlineUsers} />
            <NewAgora channel={roomId} />
          </div>
        </div>
      </div>
    </>
  );
}

export default LiveRoom;
