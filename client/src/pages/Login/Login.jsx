import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');

    if (!email) {
      setEmailError("Email is required.");
    }

    if (!password) {
      setPasswordError("Password is required.");
    }

    if (!email || !password) {
      return;
    }

    try {
      const response = await fetch('http://localhost/online_billing/server/php/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data);

      if (data.success) {
        // Store session data
        sessionStorage.setItem('user_id', data.user_id);
        sessionStorage.setItem('user_name', data.firstname);
        sessionStorage.setItem('user_role', data.role); // Storing user role

        // Always redirect to /dashboard
        navigate('/dashboard');

        // Additional feature for admin after redirection
        if (data.role === 'admin') {
          // You can unlock specific admin features here
          // For example, set a state or call a function that shows extra features for admin
          sessionStorage.setItem('is_admin', 'true');
        } else {
          sessionStorage.setItem('is_admin', 'false');
        }

      } else {
        // Handle error based on the error message
        if (data.message.toLowerCase().includes("email")) {
          setEmailError(data.message);
        } else if (data.message.toLowerCase().includes("password")) {
          setPasswordError(data.message);
        } else {
          setPasswordError(data.message || "Something went wrong. Please try again.");
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setPasswordError("Something went wrong. Please try again!");
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
              type="email"
              className="login-input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <span>Email</span>
            {emailError && <p className="error-message">{emailError}</p>}
          </label>

          <label>
            <input
              type="password"
              className="login-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span>Password</span>
            {passwordError && <p className="error-message">{passwordError}</p>}
          </label>

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
