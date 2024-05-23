// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import MainComponent from './components/MainComponent';
import SequenceComponent from './components/SequenceComponent';
import CategoryComponent from './components/CategoryComponent';
import { UserAuthContextProvider } from './context/UserAuthContext';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos/1') // Example endpoint from JSONPlaceholder
      .then((response) => response.json())
      .then((data) => setMessage(data.title));
  }, []);

  return (
    <BrowserRouter>
      <UserAuthContextProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* Below are protected domains */}
          <Route path="/home" element={<MainComponent />} />
          <Route path="/sequence/:id" element={<SequenceComponent />} />
          <Route path="/category/:id" element={<CategoryComponent />} />
        </Routes>
      </UserAuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
