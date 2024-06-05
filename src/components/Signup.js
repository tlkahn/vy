import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Alert } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { useUserAuth } from '../context/UserAuthContext';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const { signUp } = useUserAuth();
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signUp(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="p-4 shadow-md rounded-md bg-gray-600 text-white min-h-screen">
        <div className="container mx-auto px-4 md:max-w-md lg:max-w-lg xl:max-w-xl">
          <h1 className="mb-3 text-xl text-center p-4 font-semibold">
            Create an account
          </h1>

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
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-gray-700"
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="off"
              />
            </Form.Group>

            <div className="grid gap-2">
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
                type="Submit"
              >
                Continue
              </Button>
            </div>
          </Form>
        </div>
        <div className="container mx-auto px-4 md:max-w-md lg:max-w-lg xl:max-w-xl">
          <div className="p-4 mt-3 text-center text-white">
            Already have an account?{' '}
            <Link to="/" className="text-blue-500 hover:text-blue-600">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
