import React from 'react';
import { FiFacebook, FiInstagram, FiTwitter, FiLinkedin } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-sections">

          <div className="footer-section">
            <h3>Shop</h3>
            <ul>
              <li><a href="#all-products">All Products</a></li>
              <li><a href="#clay-creations">Clay Creations</a></li>
              <li><a href="#resin-art">Resin Art</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>About</h3>
            <ul>
              <li><a href="#about-craftopia">About Craftopia</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Help & Support</h3>
            <ul>
              <li><a href="#contact">Contact Us</a></li>
              <li><a href="#shipping">Shipping Info</a></li>
              <li><a href="#returns">Returns</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Follow Us</h3>
            <div className="social-links">
              <a href="#facebook" aria-label="Facebook"><FiFacebook size={20} /></a>
              <a href="#instagram" aria-label="Instagram"><FiInstagram size={20} /></a>
              <a href="#twitter" aria-label="Twitter"><FiTwitter size={20} /></a>
              <a href="#linkedin" aria-label="LinkedIn"><FiLinkedin size={20} /></a>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 Craftopia. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
