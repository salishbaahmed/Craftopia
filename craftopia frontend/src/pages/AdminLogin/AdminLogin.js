import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import './AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email,
        password,
        role: 'admin' // Important: specify admin role
      });

      // Store the token
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('role', 'admin');

      console.log('Admin login successful');
      navigate('/admin'); // Redirect to AdminMain page
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.detail || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
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

        <form onSubmit={handleSubmit} className="login-form1">
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

          {error && (
            <div className="error-message" style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
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
