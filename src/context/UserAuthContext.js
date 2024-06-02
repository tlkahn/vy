import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../firebase';
import log from 'loglevel';

export const userAuthContext = createContext();

// eslint-disable-next-line react/prop-types
export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState({});

  useEffect(() => {
    log.info('saving user: ', user);
    localStorage.setItem('userJwt', JSON.stringify(user));
  }, [user]);

  function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function logOut() {
    return signOut(auth);
  }

  function googleSignIn() {
    return signInWithPopup(auth, new GoogleAuthProvider());
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentuser) => {
      log.info('Auth', currentuser);
      const firebaseToke = await currentuser.getIdToken();
      const firebaseTokeRes = await currentuser.getIdTokenResult();
      log.info('JWT Token: ', firebaseToke);
      log.info('JWT Token Res: ', firebaseTokeRes);
      setUser(currentuser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <userAuthContext.Provider
      value={{ user, logIn, signUp, logOut, googleSignIn }}
    >
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}
