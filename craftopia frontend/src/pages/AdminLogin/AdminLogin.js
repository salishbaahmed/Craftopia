import React, { useState } from 'react';
import './AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempted with:', { email, password });
  };

  return (
    <div className="admin-login-page">
      <div className="login-container">
        {/* Logo Section */}
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

          {/* Login Button */}
          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        {/* Back to Home Link */}
        <a href="/" className="back-link">
          Back to Home
        </a>
      </div>
    </div>
  );
};

export default AdminLogin;
