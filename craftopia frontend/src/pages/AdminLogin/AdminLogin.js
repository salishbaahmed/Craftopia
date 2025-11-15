import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempted with:', { email, password });
    navigate('/admin'); // Redirect to AdminMain page
  };

  return (
    <div className="admin-login-page">
      <div className="login-container">
        <div className="logo-section">
          <img 
            src="/craftopia logo.png" 
            alt="Craftopia Logo" 
            className="login-logo"
          />
        </div>

        <form onSubmit={handleSubmit} className="login-form">
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

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
            />
            <span className="input-icon">🔒</span>
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <a href="/" className="back-link">
          Back to Home
        </a>
      </div>
    </div>
  );
};

export default AdminLogin;
