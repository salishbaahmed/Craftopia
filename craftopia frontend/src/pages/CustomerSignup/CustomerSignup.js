import React, { useState } from 'react';
import './CustomerSignup.css';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CustomerSignup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      });
      navigate('/customer');
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="customer-signup-page">
      <div className="signup-container">
        {/* Logo */}
        <div className="logo-section">
          <img
            src="/craftopia logo.png"
            alt="Craftopia Logo"
            className="signup-logo"
          />
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="signup-form1">
          {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</div>}
          {/* Name Fields */}
          <div className="name-fields">
            <div className="input-group1">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="input-field1"
                required
              />
            </div>
            <div className="input-group1">
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="input-field1"
                required
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="input-group1">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="input-field1"
              required
            />
            <span className="input-icon1">✉</span>
          </div>

          {/* Password Input */}
          <div className="input-group1">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="input-field1"
              required
            />
            <span className="input-icon1">✉</span>
          </div>

          {/* Confirm Password Input */}
          <div className="input-group1">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input-field1"
              required
            />
            <span className="input-icon1">✉</span>
          </div>

          {/* Signup Button */}
          <button type="submit" className="signup-button">
            Create Account
          </button>
        </form>

        {/* Login Section */}
        <div className="login-section">
          <p className="login-text">Already have an account?</p>
          <a href="/customer-login" className="login-link-button">
            Sign In
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

export default CustomerSignup;