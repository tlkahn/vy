// src/App.js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import MainComponent from './components/MainComponent';
import LiveRooms from './components/LiveRooms';
import SequenceComponent from './components/SequenceComponent';
import CategoryComponent from './components/CategoryComponent';
import { UserAuthContextProvider } from './context/UserAuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { ChatProvider } from './context/ChatContext';
import log from 'loglevel';
const LiveRoom = lazy(() => import('./components/LiveRoom'));
import NewAgora from './components/NewAgora';

function App() {
  if (process.env.NODE_ENV === 'development') {
    log.setLevel('info');
  }

  return (
    <BrowserRouter>
      <UserAuthContextProvider>
        <ChatProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/signin" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/chat" element={<NewAgora channel={'0'} />} />
              {/* Below are protected domains */}
              <Route path="*" element={<ProtectedRoute />}>
                <Route path="liverooms" element={<LiveRooms />} />
                <Route path="home" element={<MainComponent />} />
                <Route path="liveroom/:roomId" element={<LiveRoom />} />
                <Route path="sequence/:id" element={<SequenceComponent />} />
                <Route path="category/:id" element={<CategoryComponent />} />
              </Route>
            </Routes>
          </Suspense>
        </ChatProvider>
      </UserAuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
