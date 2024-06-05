import React, { createContext, useContext, useState, useRef } from 'react';

// Create a single context
const ChatContext = createContext();

// Create a custom hook to use the context
export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const chatroomChannelRef = useRef(null);
  const [messages, setMessages] = useState([]);

  return (
    <ChatContext.Provider
      value={{
        chatroomChannelRef,
        messages,
        setMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
