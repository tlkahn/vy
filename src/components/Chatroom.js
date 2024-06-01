import React, { useState, useEffect } from 'react';
import chatroomChannel from '../channels/chatroom_channel';
import api from '../api';

const Chatroom = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/messages').then((response) => {
      setMessages(response.data);
    });

    chatroomChannel.received = (data) => {
      setMessages((prevMessages) => [...prevMessages, data.message]);
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    chatroomChannel.speak(message);
    setMessage('');
  };

  return (
    <div>
      <h1>Chatroom</h1>
      <div id="messages">
        {messages?.map((msg) => (
          <div key={msg?.user_id}>
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
  );
};

export default Chatroom;
