import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Input from './form-components/Input';

import 'react-toastify/dist/ReactToastify.css';

export default function Login({ handleJWTChange }) {
  const navigate = useNavigate();

  const [input, setInput] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState([]);

  const handleChange = (event) => {
    let value = event.target.value;
    let name = event.target.name;
    setInput({
      ...input,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let errorsInput = [];
    if (input.email === '') {
      errorsInput.push('email');
    }

    if (input.password === '') {
      errorsInput.push('password');
    }

    setErrors(errorsInput);

    if (errorsInput.length > 0) {
      return false;
    }

    let data = new FormData(event.target);
    const payload = Object.fromEntries(data.entries());

    const requestOptions = {
      method: 'POST',
      body: JSON.stringify(payload),
    };

    const response = await fetch(
      'http://localhost:4000/v1/signin',
      requestOptions
    );
    data = await response.json();

    if (data.error) {
      toast.error(data.error.message);
    } else {
      handleJWTChange(data.response);
      window.localStorage.setItem('jwt', data.response);
      navigate('/admin');
    }
  };

  const hasError = (key) => {
    return errors.indexOf(key) !== -1;
  };

  return (
    <>
      <h2>Login</h2>
      <hr />
      <ToastContainer />

      <form className="pt-3" onSubmit={handleSubmit}>
        <Input
          title="Email"
          type="email"
          name="email"
          handleChange={handleChange}
          className={hasError('email') ? 'is-invalid' : ''}
          errorDiv={hasError('email') ? 'text-danger' : 'd-none'}
          errorMsg={'Please enter a valid email address'}
        />

        <Input
          title="Password"
          type="password"
          name="password"
          handleChange={handleChange}
          className={hasError('password') ? 'is-invalid' : ''}
          errorDiv={hasError('password') ? 'text-danger' : 'd-none'}
          errorMsg={'Please enter a password'}
        />

        <hr />

        <button className="btn btn-primary">Login</button>
      </form>
    </>
  );
}
