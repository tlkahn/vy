import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Alert, Button } from 'react-bootstrap';
import GoogleButton from 'react-google-button';
import { useUserAuth } from '../context/UserAuthContext';
import log from 'loglevel';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { logIn, googleSignIn } = useUserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await logIn(email, password);
      navigate('/home');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      await googleSignIn();
      navigate('/home');
    } catch (error) {
      log.info(error.message);
    }
  };

  const logoUrl = 'http://localhost:3000/images/logo.svg';

  return (
    <>
      <div className="p-4 shadow-md rounded-md scene-video-background bg-gray-600 text-white min-h-screen">
        <div className="container mx-auto px-4 md:max-w-md lg:max-w-lg xl:max-w-xl">
          <div className="flex items-center justify-between">
            <Link to="/" className="logo-wrapper">
              <img src={logoUrl} alt="Logo" />
            </Link>
          </div>
          <h2 className="mb-3 text-xl text-center p-4 font-semibold">Log in</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-gray-700"
                type="email"
                placeholder="Email address"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <div className="grid gap-2">
              <Button
                className="bg-deep-blue-600 hover:bg-deep-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
                type="Submit"
              >
                Continue
              </Button>
            </div>
          </Form>
          <hr className="my-4" />
          <div className="flex justify-center">
            <GoogleButton
              className="g-btn"
              type="dark"
              onClick={handleGoogleSignIn}
            />
          </div>
        </div>
        <div className="p-4 box mt-3 text-center">
          Don&apos;t have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </>
  );
};

export default Login;
