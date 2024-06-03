import React, { useState, useEffect, useRef } from 'react';
import { cable_api } from '../api';
import log from 'loglevel';
import { createConsumer } from '@rails/actioncable';
import { getToken } from '../api';
import { useUserAuth } from '../context/UserAuthContext';

const Chatroom = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { loading } = useUserAuth();
  const chatroomChannelRef = useRef(null);

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
          log.info(data);
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
      consumer.disconnect();
    };
  }, [loading]);

  useEffect(() => {
    log.info({ messages });
  }, [messages]);

  const handleSubmit = (event) => {
    event.preventDefault();
    chatroomChannelRef.current.speak(message);
    setMessage('');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="chatroom">
        <h1>Chatroom</h1>
        <div id="messages">
          {messages?.map((msg, index) => (
            <div key={index}>
              <strong>{msg?.user_id}:</strong> {msg?.content}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
          />
          <button type="submit">Send</button>
        </form>
      </div>
      <div className="online-users">
        <h1>Online Users</h1>
        <ul>
          {onlineUsers.map((user) => (
            <li key={user.id}>{user.email}</li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Chatroom;
