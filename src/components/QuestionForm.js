import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext'; // Adjust the path as needed
import PropTypes from 'prop-types';
import log from 'loglevel';

const QuestionForm = ({ toggleModal }) => {
  const [userQuestion, setUserQuestion] = useState('');
  const modalRef = useRef(); // Ref for the modal container
  const containerRef = useRef(); // Ref for the modal container
  const { chatroomChannelRef, messages } = useChat();

  const handleQuestionSubmit = (e) => {
    e.preventDefault();
    chatroomChannelRef.current.speak(userQuestion);
    setUserQuestion('');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !containerRef.current.contains(event.target)) {
        toggleModal(false); // Assuming toggleModal can accept a boolean to show/hide
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [toggleModal]); // Add toggleModal to the dependencies array if it changes

  useEffect(() => {
    log.info({ messages });
  }, [messages]);

  return (
    <>
      <div
        ref={modalRef}
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <div
          ref={containerRef}
          className="bg-gray-700 p-5 rounded-lg question-form-container"
        >
          <div className="question-history bg-gray-600 p-4 mb-4 rounded overflow-auto max-h-40">
            {messages &&
              messages.map((m, index) => (
                <div key={index} className="text-white mb-2 last:mb-0">
                  {m.content}
                </div>
              ))}
          </div>
          <form
            onSubmit={handleQuestionSubmit}
            className="question-form-input my-4 flex"
          >
            <input
              type="text"
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              placeholder="Ask a question..."
              className="text-black flex-grow p-2"
            />
            <button type="submit" className="ml-2 p-2">
              <i className="fa fa-paper-plane"></i>
            </button>
          </form>
        </div>
        <button onClick={toggleModal} className="absolute top-0 right-0 p-4">
          <i className="fa fa-times"></i>
        </button>
      </div>
    </>
  );
};

QuestionForm.propTypes = {
  toggleModal: PropTypes.func.isRequired, // Validate src prop
};

export default QuestionForm;
