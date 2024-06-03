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
import axios from 'axios';

export const userAuthContext = createContext();

// eslint-disable-next-line react/prop-types
export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState({});

  useEffect(() => {
    if (user?.uid) {
      log.info('Saving user: ', user);
      localStorage.setItem('userJwt', JSON.stringify(user));
    }
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
      if (currentuser) {
        log.info('current user: ', currentuser);
        const firebaseToken = await currentuser.getIdToken();
        const firebaseTokeRes = await currentuser.getIdTokenResult();
        log.info('JWT Token: ', firebaseToken);
        log.info('JWT Token Res: ', firebaseTokeRes);

        await sendFirebaseTokenToRailsServer(firebaseToken);

        setUser(currentuser);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  async function sendFirebaseTokenToRailsServer(firebaseIdToken) {
    try {
      const response = await axios.post(
        'http://localhost:3333/custom_auth/exchange_token',
        {
          firebase_id_token: firebaseIdToken,
        }
      );
      const jwtToken = response.headers['authorization'];
      if (jwtToken) {
        localStorage.setItem('jwtToken', jwtToken);
        log.info('JWT Token stored:', jwtToken);
      } else {
        log.error('JWT Token not found in response headers');
      }
    } catch (error) {
      log.error(
        'Error exchanging Firebase ID token:',
        error.response?.data || error.message
      );
    }
  }

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
