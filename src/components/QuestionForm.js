import React, { useState } from 'react';

const QuestionForm = ({ toggleModal }) => {
  const [userQuestion, setUserQuestion] = useState('');

  const handleQuestionSubmit = (e) => {
    e.preventDefault();
    // Implement your question submission logic here
    console.log(userQuestion); // Placeholder for actual submission logic

    // Optionally reset the question and close the modal
    setUserQuestion('');
    toggleModal();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-gray-700 p-5 rounded-lg">
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

export default QuestionForm;
