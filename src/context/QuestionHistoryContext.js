import React, { createContext, useContext, useState } from 'react';

const QuestionHistoryContext = createContext();

export const useQuestionHistory = () => useContext(QuestionHistoryContext);

export const QuestionHistoryProvider = ({ children }) => {
  const [questionHistory, setQuestionHistory] = useState([]);

  return (
    <QuestionHistoryContext.Provider
      value={{ questionHistory, setQuestionHistory }}
    >
      {children}
    </QuestionHistoryContext.Provider>
  );
};
