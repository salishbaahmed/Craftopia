// CustomerUpdateProfile.js
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiMapPin, FiKey, FiBell, FiCheck, FiCamera, FiUser } from 'react-icons/fi';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';
import './CustomerUpdateProfile.css';
import api from '../../../api/axios';

const CustomerUpdateProfile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: ''
  });

  const [addressInfo, setAddressInfo] = useState({
    streetAddress: '',
    city: '',
    province: 'Punjab',
    zipCode: ''
  });

  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    emailEnabled: true,
    emailOrderUpdates: true,
    emailPromotionalOffers: true,
    emailNewsletter: true,
    smsEnabled: false,
    smsOrderUpdates: false,
    smsPromotionalOffers: false
  });

  const [saveStatus, setSaveStatus] = useState({
    personal: false,
    address: false,
    password: false,
    notifications: false
  });

  const [profileImage, setProfileImage] = useState(null);

  const handlePersonalInfoChange = (field, value) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressInfoChange = (field, value) => {
    setAddressInfo(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationToggle = (field) => {
    setNotifications(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  // ...

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/users/profile');
        const { first_name, last_name, email, phone_number, address, city, state, zip_code } = response.data;

        setPersonalInfo(prev => ({
          ...prev,
          firstName: first_name || '',
          lastName: last_name || '',
          email: email || '',
          phone: phone_number || '',
          // dateOfBirth and gender are not in current backend model
        }));

        setAddressInfo({
          streetAddress: address || '',
          city: city || '',
          province: state || 'Punjab',
          zipCode: zip_code || ''
        });

      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };
    fetchProfile();
  }, []);

  // ...

  // Save Handlers with Status Feedback
  const handleSavePersonalInfo = async () => {
    try {
      await api.put('/users/profile', {
        first_name: personalInfo.firstName,
        last_name: personalInfo.lastName,
        phone_number: personalInfo.phone,
        // email is usually read-only or requires verification
      });
      setSaveStatus(prev => ({ ...prev, personal: true }));
      setTimeout(() => setSaveStatus(prev => ({ ...prev, personal: false })), 2000);
    } catch (error) {
      console.error('Error updating personal info:', error);
      alert('Failed to update profile');
    }
  };

  const handleSaveAddressInfo = async () => {
    try {
      await api.put('/users/profile', {
        address: addressInfo.streetAddress,
        city: addressInfo.city,
        state: addressInfo.province,
        zip_code: addressInfo.zipCode
      });
      setSaveStatus(prev => ({ ...prev, address: true }));
      setTimeout(() => setSaveStatus(prev => ({ ...prev, address: false })), 2000);
    } catch (error) {
      console.error('Error updating address info:', error);
      alert('Failed to update address');
    }
  };

  const handleUpdatePassword = async () => {
    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Backend doesn't have a specific password change endpoint yet, 
    // but usually it's a separate endpoint or part of profile update with current password check.
    // For now, we'll assume we can't update it without a specific endpoint or we'd need to add one.
    // Let's skip this for now or mock it.
    alert('Password update feature requires backend implementation.');
  };

  const handleSaveNotifications = () => {
    console.log('Saving notifications:', notifications);
    setSaveStatus(prev => ({ ...prev, notifications: true }));
    setTimeout(() => setSaveStatus(prev => ({ ...prev, notifications: false })), 2000);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Deleting account');
      navigate('/');
    }
  };

  const provinces = ['Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 'Gilgit-Baltistan', 'Azad Kashmir'];

  return (
    <div className="customer-update-profile">
      <Navbar />

      <div className="update-profile-container">
        <div className="profile-header">
          <h1 className="page-title">Update Profile</h1>
          <p className="page-subtitle">Manage your personal information and preferences</p>
        </div>

        <div className="profile-content">
          {/* Sidebar */}
          <div className="profile-sidebar">
            <div className="sidebar-card">
              <div className="profile-picture-section">
                <div className="profile-picture-container">
                  <div className="profile-picture" onClick={triggerFileInput}>
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="profile-image" />
                    ) : (
                      <FiUser className="profile-icon" />
                    )}
                    <div className="camera-overlay">
                      <FiCamera className="camera-icon" />
                    </div>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="file-input"
                  />
                </div>
                <h3 className="profile-name">{personalInfo.firstName} {personalInfo.lastName}</h3>
                <p className="profile-email">{personalInfo.email}</p>
              </div>

              <div className="account-status-section">
                <h4 className="status-title">Account Status</h4>
                <ul className="status-list">
                  <li className="status-item verified">
                    <FiCheck className="status-icon" />
                    Email Verified
                  </li>
                  <li className="status-item verified">
                    <FiCheck className="status-icon" />
                    Phone Verified
                  </li>
                </ul>
              </div>

              <div className="member-since-section">
                <p className="member-since">Member since March 2024</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="profile-main-content">
            {/* Personal Information */}
            <div className="profile-card">
              <div className="card-header">
                <div className="card-title">
                  <FiLock className="card-icon" />
                  <span>Personal Information</span>
                </div>
                <button
                  className={`save-btn ${saveStatus.personal ? 'saved' : ''}`}
                  onClick={handleSavePersonalInfo}
                >
                  {saveStatus.personal ? 'Saved!' : 'Save'}
                </button>
              </div>

              <div className="card-content">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={personalInfo.firstName}
                      onChange={(e) => handlePersonalInfoChange('firstName', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={personalInfo.lastName}
                      onChange={(e) => handlePersonalInfoChange('lastName', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-input"
                      value={personalInfo.email}
                      onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      className="form-input"
                      value={personalInfo.phone}
                      onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Date of Birth</label>
                    <input
                      type="date"
                      className="form-input"
                      value={personalInfo.dateOfBirth}
                      onChange={(e) => handlePersonalInfoChange('dateOfBirth', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select
                      className="form-input"
                      value={personalInfo.gender}
                      onChange={(e) => handlePersonalInfoChange('gender', e.target.value)}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="profile-card">
              <div className="card-header">
                <div className="card-title">
                  <FiMapPin className="card-icon" />
                  <span>Address Information</span>
                </div>
                <button
                  className={`save-btn ${saveStatus.address ? 'saved' : ''}`}
                  onClick={handleSaveAddressInfo}
                >
                  {saveStatus.address ? 'Saved!' : 'Save'}
                </button>
              </div>

              <div className="card-content">
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label className="form-label">Street Address</label>
                    <input
                      type="text"
                      className="form-input"
                      value={addressInfo.streetAddress}
                      onChange={(e) => handleAddressInfoChange('streetAddress', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-input"
                      value={addressInfo.city}
                      onChange={(e) => handleAddressInfoChange('city', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Province</label>
                    <select
                      className="form-input"
                      value={addressInfo.province}
                      onChange={(e) => handleAddressInfoChange('province', e.target.value)}
                    >
                      {provinces.map(province => (
                        <option key={province} value={province}>{province}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Zip Code</label>
                    <input
                      type="text"
                      className="form-input"
                      value={addressInfo.zipCode}
                      onChange={(e) => handleAddressInfoChange('zipCode', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div className="profile-card">
              <div className="card-header">
                <div className="card-title">
                  <FiKey className="card-icon" />
                  <span>Change Password</span>
                </div>
                <button
                  className={`save-btn ${saveStatus.password ? 'saved' : ''}`}
                  onClick={handleUpdatePassword}
                >
                  {saveStatus.password ? 'Updated!' : 'Update Password'}
                </button>
              </div>

              <div className="card-content">
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label className="form-label">Current Password</label>
                    <input
                      type="password"
                      className="form-input"
                      value={passwordInfo.currentPassword}
                      onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                      placeholder="Enter current password"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-input"
                      value={passwordInfo.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      placeholder="Enter new password"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-input"
                      value={passwordInfo.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="profile-card">
              <div className="card-header">
                <div className="card-title">
                  <FiBell className="card-icon" />
                  <span>Notification Preferences</span>
                </div>
                <button
                  className={`save-btn ${saveStatus.notifications ? 'saved' : ''}`}
                  onClick={handleSaveNotifications}
                >
                  {saveStatus.notifications ? 'Saved!' : 'Save'}
                </button>
              </div>

              <div className="card-content">
                {/* Email Notifications */}
                <div className="notification-section">
                  <div className="notification-header">
                    <span className="notification-title">Email Notifications</span>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.emailEnabled}
                        onChange={() => handleNotificationToggle('emailEnabled')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  {notifications.emailEnabled && (
                    <div className="notification-options">
                      <div className="notification-option">
                        <span>Order Updates</span>
                        <label className="toggle-switch small">
                          <input
                            type="checkbox"
                            checked={notifications.emailOrderUpdates}
                            onChange={() => handleNotificationToggle('emailOrderUpdates')}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                      <div className="notification-option">
                        <span>Promotional Offers</span>
                        <label className="toggle-switch small">
                          <input
                            type="checkbox"
                            checked={notifications.emailPromotionalOffers}
                            onChange={() => handleNotificationToggle('emailPromotionalOffers')}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                      <div className="notification-option">
                        <span>Newsletter</span>
                        <label className="toggle-switch small">
                          <input
                            type="checkbox"
                            checked={notifications.emailNewsletter}
                            onChange={() => handleNotificationToggle('emailNewsletter')}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* SMS Notifications */}
                <div className="notification-section">
                  <div className="notification-header">
                    <span className="notification-title">SMS Notifications</span>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.smsEnabled}
                        onChange={() => handleNotificationToggle('smsEnabled')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  {notifications.smsEnabled && (
                    <div className="notification-options">
                      <div className="notification-option">
                        <span>Order Updates</span>
                        <label className="toggle-switch small">
                          <input
                            type="checkbox"
                            checked={notifications.smsOrderUpdates}
                            onChange={() => handleNotificationToggle('smsOrderUpdates')}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                      <div className="notification-option">
                        <span>Promotional Offers</span>
                        <label className="toggle-switch small">
                          <input
                            type="checkbox"
                            checked={notifications.smsPromotionalOffers}
                            onChange={() => handleNotificationToggle('smsPromotionalOffers')}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="profile-card danger-zone">
              <div className="card-header">
                <div className="card-title">
                  <span className="danger-title">Danger Zone</span>
                </div>
              </div>

              <div className="card-content">
                <p className="danger-description">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button
                  className="delete-account-btn"
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CustomerUpdateProfile;