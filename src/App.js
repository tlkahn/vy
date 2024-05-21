// src/App.js
import React, { useState, useEffect } from 'react';
import MainComponent from './main';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import SequenceComponent from './SequenceComponent';
import CategoryComponent from './CategoryComponent';

function App() {
  const [message, setMessage] = useState('');

useEffect(() => {
  fetch('https://jsonplaceholder.typicode.com/todos/1') // Example endpoint from JSONPlaceholder
    .then(response => response.json())
    .then(data => setMessage(data.title));
}, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainComponent />} />
        <Route path="/sequence/:id" element={<SequenceComponent />} />
        <Route path="/category/:id" element={<CategoryComponent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
