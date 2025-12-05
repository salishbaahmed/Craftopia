import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import {
  FiUser,
  FiShoppingCart,
  FiHeart,
  FiHelpCircle,
  FiLogOut,
  FiHome,
  FiGift,
  FiCheckSquare,
  FiMessageSquare,
  FiInfo
} from 'react-icons/fi';

import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isHelpDropdownOpen, setIsHelpDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { cartCount } = useCart();

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Toggle profile dropdown
  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
    setIsHelpDropdownOpen(false);
  };

  // Toggle help dropdown
  const toggleHelpDropdown = () => {
    setIsHelpDropdownOpen(!isHelpDropdownOpen);
    setIsProfileDropdownOpen(false);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/customer-login');
    setIsMenuOpen(false);
    setIsProfileDropdownOpen(false);
    setIsHelpDropdownOpen(false);
  };

  // Handle navigation with menu close
  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
    setIsProfileDropdownOpen(false);
    setIsHelpDropdownOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileDropdownOpen && !event.target.closest('.navbar-profile-dropdown')) {
        setIsProfileDropdownOpen(false);
      }
      if (isHelpDropdownOpen && !event.target.closest('.navbar-help-dropdown')) {
        setIsHelpDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileDropdownOpen, isHelpDropdownOpen]);

  return (
    <nav className="navbar">
      <div className="nav-container">

        {/* Logo Section */}
        <div
          className="navbar-logo"
          onClick={() => handleNavigation('/customer')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleNavigation('/customer')}
        >
          <img
            src="/Craftopia Logo2.png"
            alt="Craftopia Logo"
            className="navbar-logo-image"
          />
          <span className="navbar-logo-name">Craftopia</span>
        </div>

        {/* Navigation Menu */}
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>

          {/* Main Navigation Links */}
          <div className="navbar-links">
            <button
              className="navbar-link-btn"
              onClick={() => handleNavigation('/customer')}
            >
              <FiHome className="navbar-link-icon" />
              Home
            </button>

            <button
              className="navbar-link-btn"
              onClick={() => handleNavigation('/customer-quiz')}
            >
              <FiCheckSquare className="navbar-link-icon" />
              Shopping Quiz
            </button>
          </div>

          {/* Action Icons */}
          <div className="navbar-actions">

            {/* Cart Icon */}
            <button
              className="navbar-icon"
              onClick={() => handleNavigation('/customer-cart')}
              aria-label={`Shopping Cart with ${cartCount} items`}
            >
              <FiShoppingCart />
              {cartCount > 0 && (
                <span className="navbar-icon-badge">{cartCount}</span>
              )}
              <span className="navbar-icon-label">Cart</span>
            </button>

            {/* Wishlist Icon */}
            <button
              className="navbar-icon"
              onClick={() => handleNavigation('/customer-wishlist')}
              aria-label="Wishlist"
            >
              <FiHeart />
              <span className="navbar-icon-label">Wishlist</span>
            </button>

            {/* Rewards Icon */}
            <button
              className="navbar-icon"
              onClick={() => handleNavigation('/customer-view-rewards')}
              aria-label="Rewards"
            >
              <FiGift className="navbar-link-icon" />
              <span className="navbar-icon-label">Rewards</span>
            </button>

            {/* Help Dropdown */}
            <div className="navbar-help-dropdown">
              <button
                className="navbar-icon"
                onClick={toggleHelpDropdown}
                aria-label="Help and Support"
                aria-expanded={isHelpDropdownOpen}
              >
                <FiHelpCircle />
                <span className="navbar-icon-label">Help</span>
              </button>

              {isHelpDropdownOpen && (
                <div className="navbar-dropdown-menu">
                  <button
                    className="navbar-dropdown-item"
                    onClick={() => handleNavigation('/customer-faq')}
                  >
                    <FiInfo className="navbar-dropdown-icon" />
                    <span>FAQ</span>
                  </button>

                  <button
                    className="navbar-dropdown-item"
                    onClick={() => handleNavigation('/customer-contact-support')}
                  >
                    <FiMessageSquare className="navbar-dropdown-icon" />
                    <span>Contact Support</span>
                  </button>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="navbar-profile-dropdown">
              <button
                className="navbar-icon"
                onClick={toggleProfileDropdown}
                aria-label="Account menu"
                aria-expanded={isProfileDropdownOpen}
              >
                <FiUser />
                <span className="navbar-icon-label">Account</span>
              </button>

              {isProfileDropdownOpen && (
                <div className="navbar-dropdown-menu">
                  <button
                    className="navbar-dropdown-item"
                    onClick={() => handleNavigation('/customer-my-account')}
                  >
                    <FiUser className="navbar-dropdown-icon" />
                    <span>My Account</span>
                  </button>

                  <button
                    className="navbar-dropdown-item"
                    onClick={() => handleNavigation('/customer-orders')}
                  >
                    <FiShoppingCart className="navbar-dropdown-icon" />
                    <span>Order History</span>
                  </button>

                  <button
                    className="navbar-dropdown-item"
                    onClick={() => handleNavigation('/customer-track-order')}
                  >
                    <FiGift className="navbar-dropdown-icon" />
                    <span>Track Order</span>
                  </button>

                  <button
                    className="navbar-dropdown-item"
                    onClick={() => handleNavigation('/customer-manage-address')}
                  >
                    <FiHome className="navbar-dropdown-icon" />
                    <span>Delivery Details</span>
                  </button>

                  <button
                    className="navbar-dropdown-item"
                    onClick={() => handleNavigation('/customer-refund')}
                  >
                    <FiCheckSquare className="navbar-dropdown-icon" />
                    <span>Refunds & Returns</span>
                  </button>

                  <div className="navbar-dropdown-divider"></div>

                  <button
                    className="navbar-dropdown-item navbar-logout-item"
                    onClick={handleLogout}
                  >
                    <FiLogOut className="navbar-dropdown-icon" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="navbar-hamburger"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;