import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CustomerLogin.css';

import { useAuth } from '../../context/AuthContext';

const CustomerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/customer');
    } catch (err) {
      setError('Invalid email or password');
      console.error(err);
    }
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
  };

  return (
    <div className="customer-login-page">
      <div className="login-container">
        <div className="logo-section">
          <img
            src="/craftopia logo.png"
            alt="Craftopia Logo"
            className="login-logo"
          />
        </div>

        <form onSubmit={handleSubmit} className="login-form1">
          {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
          <div className="input-group1">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field1"
              required
            />
            <span className="input-icon1">✉</span>
          </div>

          <div className="input-group1">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field1"
              required
            />
            <span className="input-icon1">✉</span>
          </div>

          <div className="forgot-password-container">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="forgot-password-link"
            >
              Forgot Password?
            </button>
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <div className="signup-section">
          <p className="signup-text">Not registered yet?</p>
          <a href="/customer-signup" className="signup-button">
            Create an Account
          </a>
        </div>

        <a href="/" className="back-link">
          Back to Home
        </a>
      </div>
    </div>
  );
};

export default CustomerLogin;
