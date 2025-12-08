import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiLinkedin } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-sections">

          {/* Quick Links */}
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/customer">Home</Link></li>
              <li><Link to="/customer-my-account">My Account</Link></li>
              <li><Link to="/customer-quiz">Quiz</Link></li>
            </ul>
          </div>


          {/* Help & Support */}
          <div className="footer-section">
            <h3>Help & Support</h3>
            <ul>
              <li><Link to="/customer-contact-support">Contact Us</Link></li>
              <li><Link to="/customer-faq">FAQ</Link></li>
            </ul>
          </div>

          {/* Follow Us */}
          <div className="footer-section">
            <h3>Follow Us</h3>
            <div className="social-links">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FiFacebook size={20} />
              </a>
              <a href="https://www.instagram.com/alishba__artistry?igsh=azQxemZocGo2azI4" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FiInstagram size={20} />
              </a>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FiTwitter size={20} />
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FiLinkedin size={20} />
              </a>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 Craftopia. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
