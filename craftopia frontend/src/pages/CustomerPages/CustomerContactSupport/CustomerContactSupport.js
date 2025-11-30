import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiSend, 
  FiTrash2, 
  FiTruck, 
  FiRefreshCw, 
  FiCreditCard, 
  FiHelpCircle,
  FiMail,
  FiMessageCircle,
  FiClock,
  FiArrowRight
} from 'react-icons/fi';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';
import './CustomerContactSupport.css';

const CustomerContactSupport = () => {
  const [formData, setFormData] = useState({
    topic: '',
    orderNumber: '',
    message: ''
  });
  const [characterCount, setCharacterCount] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'message') {
      setCharacterCount(value.length);
    }
  };

  const handleClearForm = () => {
    setFormData({
      topic: '',
      orderNumber: '',
      message: ''
    });
    setCharacterCount(0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  const topics = [
    'Order Issue',
    'Return or Refund',
    'Payment Problem',
    'Account Help',
    'Product Question',
    'Shipping & Delivery',
    'Other'
  ];

  const quickHelpItems = [
    {
      icon: <FiTruck />,
      title: 'Track Your Order',
      description: 'Check order status and delivery'
    },
    {
      icon: <FiRefreshCw />,
      title: 'Returns & Refunds',
      description: 'Start a return or refund request'
    },
    {
      icon: <FiCreditCard />,
      title: 'Payment Issues',
      description: 'Payment and billing questions'
    },
    {
      icon: <FiHelpCircle />,
      title: 'FAQs',
      description: 'Find answers to common questions'
    }
  ];

  const contactMethods = [
    {
      icon: <FiMail />,
      title: 'Email Support',
      value: 'support@craftopia.com'
    },
    {
      icon: <FiMessageCircle />,
      title: 'Live Chat',
      value: 'Available 24/7'
    },
    {
      icon: <FiClock />,
      title: 'Response Time',
      value: 'Usually within 24 hours'
    }
  ];

  return (
    <div className="customercontactsupport-wrapper">
      <Navbar />
      <div className="customercontactsupport-container">
        {/* Header Section */}
        <div className="customercontactsupport-header">
          <h1 className="customercontactsupport-title">Contact Support</h1>
          <p className="customercontactsupport-subtitle">
            We're here to help! Send us a message and we'll get back to you as soon as possible.
          </p>
        </div>

        {/* User Info Card */}
        <div className="customercontactsupport-user-card">
          <div className="customercontactsupport-user-avatar">
            <span className="customercontactsupport-user-initial">Z</span>
          </div>
          <div className="customercontactsupport-user-details">
            <p className="customercontactsupport-user-name">Sending as Ali Raza</p>
            <p className="customercontactsupport-user-email">(Aliraza@email.com)</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="customercontactsupport-form-card">
          <form onSubmit={handleSubmit} className="customercontactsupport-form">
            {/* Topic Dropdown */}
            <div className="customercontactsupport-form-group">
              <label htmlFor="topic" className="customercontactsupport-form-label">
                What is this regarding? *
              </label>
              <select
                id="topic"
                name="topic"
                value={formData.topic}
                onChange={handleInputChange}
                className="customercontactsupport-form-select"
                required
              >
                <option value="">Select a topic</option>
                {topics.map((topic, index) => (
                  <option key={index} value={topic}>{topic}</option>
                ))}
              </select>
            </div>

            {/* Order Number Input */}
            <div className="customercontactsupport-form-group">
              <label htmlFor="orderNumber" className="customercontactsupport-form-label">
                Related Order Number (Optional)
              </label>
              <input
                type="text"
                id="orderNumber"
                name="orderNumber"
                value={formData.orderNumber}
                onChange={handleInputChange}
                className="customercontactsupport-form-input"
                placeholder="e.g., #ORD-1043"
              />
              <small className="customercontactsupport-helper-text">
                If this relates to a specific order, enter the order number
              </small>
            </div>

            {/* Message Textarea */}
            <div className="customercontactsupport-form-group">
              <label htmlFor="message" className="customercontactsupport-form-label">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="customercontactsupport-form-textarea"
                placeholder="Please describe your question or issue in detail..."
                rows="6"
                required
              ></textarea>
              <div className="customercontactsupport-character-count">
                {characterCount} characters
              </div>
            </div>

            {/* Form Buttons */}
            <div className="customercontactsupport-form-buttons">
              <button
                type="button"
                onClick={handleClearForm}
                className="customercontactsupport-clear-btn"
              >
                <FiTrash2 className="customercontactsupport-btn-icon" />
                Clear Form
              </button>
              <button
                type="submit"
                className="customercontactsupport-submit-btn"
              >
                <FiSend className="customercontactsupport-btn-icon" />
                Send Message
              </button>
            </div>
          </form>
        </div>

        {/* Privacy Note */}
        <div className="customercontactsupport-privacy-note">
          <p className="customercontactsupport-privacy-text">
            Privacy Note: Your information is secure and will only be used to respond to your inquiry. We'll never share your details with third parties.
          </p>
        </div>

        {/* Quick Help Section */}
        <div className="customercontactsupport-quick-help-card">
          <h2 className="customercontactsupport-section-title">Quick Help</h2>
          <div className="customercontactsupport-quick-help-grid">
            {quickHelpItems.map((item, index) => (
              <div key={index} className="customercontactsupport-quick-help-item">
                <div className="customercontactsupport-quick-help-icon">
                  {item.icon}
                </div>
                <div className="customercontactsupport-quick-help-content">
                  <h3 className="customercontactsupport-quick-help-title">{item.title}</h3>
                  <p className="customercontactsupport-quick-help-desc">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Other Ways to Connect */}
        <div className="customercontactsupport-contact-methods-card">
          <h2 className="customercontactsupport-section-title">Other Ways to Connect</h2>
          <div className="customercontactsupport-contact-methods">
            {contactMethods.map((method, index) => (
              <div key={index} className="customercontactsupport-contact-method">
                <div className="customercontactsupport-contact-icon">
                  {method.icon}
                </div>
                <div className="customercontactsupport-contact-content">
                  <h3 className="customercontactsupport-contact-title">{method.title}</h3>
                  <p className="customercontactsupport-contact-value">{method.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="customercontactsupport-bottom-banner">
          <div className="customercontactsupport-banner-content">
            <h3 className="customercontactsupport-banner-title">Need immediate help?</h3>
            <p className="customercontactsupport-banner-text">
              Check our FAQ section for instant answers to common questions.
            </p>
            <Link to="/customer-faq" className="customercontactsupport-banner-link">
              Check our FAQ section
              <FiArrowRight className="customercontactsupport-link-icon" />
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CustomerContactSupport;