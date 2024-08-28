import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Css  from './register.css'

const Register = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.find(user => user.username === username)) {
      alert('Username Exists');
    } else {
      const newUser = { username, password };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      alert('Registration Successful!');
      onRegister();
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form className='space' onSubmit={handleRegister}>
        <input className='form' type="text" placeholder="Username"
          value={username} onChange={(e) => setUsername(e.target.value)}
          required/><br/>
        <input className='form' type="password" placeholder="Password"
          value={password} onChange={(e) => setPassword(e.target.value)}
          required/>
        <button className='btn2' type="submit">Register</button>
      </form>
      <div className="link-container">
        <p>Already registered? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
};
export default Register