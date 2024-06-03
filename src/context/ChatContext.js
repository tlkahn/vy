import React, { createContext, useContext, useState, useRef } from 'react';

// Create a single context
const ChatContext = createContext();

// Create a custom hook to use the context
export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const chatroomChannelRef = useRef();
  const [questionHistory, setQuestionHistory] = useState([]);

  return (
    <ChatContext.Provider
      value={{ chatroomChannelRef, questionHistory, setQuestionHistory }}
    >
      {children}
    </ChatContext.Provider>
  );
};
