import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage("Both email and password are required.");
      return;
    }

    try {
      const response = await fetch('http://localhost/online_billing/server/php/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        sessionStorage.setItem('user_id', data.user_id);  
        navigate('/dashboard'); 
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage("Something went wrong. Please try again!");
    }
  };

  return (
    <div className="login-body">
      <div className="login-container">
        <form className="login-form" onSubmit={handleLogin}>
          <p className="login-title">Log in</p>
          <p className="login-message">Log in now and get full access to our app.</p>

          <label>
            <input 
              type="email" className="login-input" placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
            <span>Email</span>
          </label>

          <label>
            <input 
              type="password" className="login-input" placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
            <span>Password</span>
          </label>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button type="submit" className="login-submit">Submit</button>

          <p className="login-signin">
            Don't have an account? <Link to='/register'>Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
