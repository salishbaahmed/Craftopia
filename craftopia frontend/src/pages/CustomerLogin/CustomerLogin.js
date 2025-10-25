import React, { useState } from 'react';
import './CustomerLogin.css';

const CustomerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempted with:', { email, password });
  };

  const handleForgotPassword = () => {
    // Handle forgot password logic here
    console.log('Forgot password clicked');
    // You can add a modal or redirect to forgot password page
  };

  return (
    <div className="customer-login-page">
      <div className="login-container">
        {/* Logo */}
        <div className="logo-section">
          <img 
            src="/craftopia logo.png" 
            alt="Craftopia Logo" 
            className="login-logo"
          />
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* Email Input */}
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
            />
            <span className="input-icon">✉</span>
          </div>

          {/* Password Input */}
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
            />
            <span className="input-icon">✉</span>
          </div>

          {/* Forgot Password Link */}
          <div className="forgot-password-container">
            <button 
              type="button" 
              onClick={handleForgotPassword}
              className="forgot-password-link"
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        {/* Sign Up Section */}
        <div className="signup-section">
          <p className="signup-text">Not registered yet?</p>
          <a href="/customer-signup" className="signup-button">
            Create an Account
          </a>
        </div>

        {/* Back to Home Link */}
        <a href="/" className="back-link">
          Back to Home
        </a>
      </div>
    </div>
  );
};

export default CustomerLogin;