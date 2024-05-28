import React, { useState } from 'react';
import { useQuestionHistory } from '../context/QuestionHistoryContext'; // Adjust the path as needed
import PropTypes from 'prop-types';

const QuestionForm = ({ toggleModal }) => {
  const [userQuestion, setUserQuestion] = useState('');

  const handleQuestionSubmit = (e) => {
    e.preventDefault();
    setQuestionHistory([...questionHistory, userQuestion]);
    setUserQuestion('');
  };

  const { questionHistory, setQuestionHistory } = useQuestionHistory();

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-gray-700 p-5 rounded-lg">
          <div className="bg-gray-600 p-4 mb-4 rounded overflow-auto max-h-40">
            {questionHistory.map((question, index) => (
              <div key={index} className="text-white mb-2 last:mb-0">
                {question}
              </div>
            ))}
          </div>
          <form onSubmit={handleQuestionSubmit} className="my-4 flex">
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
          <button onClick={toggleModal} className="absolute top-0 right-0 p-4">
            <i className="fa fa-times"></i>
          </button>
        </div>
      </div>
    </>
  );
};

QuestionForm.propTypes = {
  toggleModal: PropTypes.func.isRequired, // Validate src prop
};

export default QuestionForm;
