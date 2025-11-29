import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';
import './CustomerCheckout.css';
import {
  FiTruck,
  FiCreditCard,
  FiCheck,
  FiMapPin,
  FiMail,
  FiPhone,
  FiArrowLeft
} from 'react-icons/fi';
import api from '../../../api/axios';
import { useCart } from '../../../context/CartContext';

const CustomerCheckout = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    zipCode: ''
  });

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  // Load real cart items from localStorage
  const [orderItems] = useState(() => {
    const savedCart = localStorage.getItem('craftopiaCart');
    if (savedCart) {
      try {
        return JSON.parse(savedCart);
      } catch (error) {
        console.error('Error loading cart items:', error);
        return [];
      }
    }
    return [];
  });

  // Load saved addresses from localStorage and prefill form with default
  useEffect(() => {
    try {
      const saved = localStorage.getItem('customerAddresses');
      if (saved) {
        const parsed = JSON.parse(saved) || [];

        // Normalize ids to strings so comparisons are stable across pages
        const normalized = parsed.map(a => ({ ...a, id: a.id != null ? String(a.id) : String(Date.now()) }));

        setSavedAddresses(normalized);
        const defaultAddr = normalized.find(a => a.isDefault) || normalized[0];
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
          setFormData(prev => ({
            ...prev,
            firstName: (defaultAddr.name || '').split(' ')[0] || '',
            lastName: (defaultAddr.name || '').split(' ').slice(1).join(' ') || '',
            address: defaultAddr.street || '',
            city: defaultAddr.city || '',
            province: defaultAddr.province || '',
            zipCode: defaultAddr.zipCode || '',
            phone: defaultAddr.phone || ''
          }));
        }
      }
    } catch (err) {
      console.error('Error loading saved addresses:', err);
    }
  }, []);

  // Listen for address updates from ManageAddress page
  useEffect(() => {
    const onAddressesUpdated = () => {
      try {
        const saved = localStorage.getItem('customerAddresses');
        if (saved) {
          const parsed = JSON.parse(saved) || [];

          const normalized = parsed.map(a => ({ ...a, id: a.id != null ? String(a.id) : String(Date.now()) }));
          setSavedAddresses(normalized);

          // If previously selected address was removed, pick default or first
          const hasSelected = normalized.some(a => a.id === selectedAddressId);
          if (!hasSelected) {
            const defaultAddr = normalized.find(a => a.isDefault) || normalized[0];
            if (defaultAddr) setSelectedAddressId(defaultAddr.id);
          }
        } else {
          setSavedAddresses([]);
          setSelectedAddressId(null);
        }
      } catch (err) {
        console.error('Error reloading addresses after update:', err);
      }
    };

    window.addEventListener('addressesUpdated', onAddressesUpdated);
    return () => window.removeEventListener('addressesUpdated', onAddressesUpdated);
  }, [selectedAddressId]);

  // When user selects an address, update the form fields
  useEffect(() => {
    if (!selectedAddressId) return;
    const addr = savedAddresses.find(a => String(a.id) === String(selectedAddressId));
    if (addr) {
      setFormData(prev => ({
        ...prev,
        firstName: (addr.name || '').split(' ')[0] || '',
        lastName: (addr.name || '').split(' ').slice(1).join(' ') || '',
        address: addr.street || '',
        city: addr.city || '',
        province: addr.province || '',
        zipCode: addr.zipCode || '',
        phone: addr.phone || ''
      }));
    }
  }, [selectedAddressId, savedAddresses]);

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = subtotal * 0.10;
  const tax = (subtotal - discount) * 0.05;
  const total = subtotal - discount + tax;

  const formatPrice = (price) => `Rs ${price.toLocaleString()}`;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Store checkout data and cart items for payment page
    const checkoutData = {
      formData,
      orderItems,
      subtotal,
      discount,
      tax,
      total
    };
    localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    navigate('/customer-make-payment');
  };

  const handleBackToCart = () => {
    navigate('/customer-cart');
  };




  return (
    <div className="checkout-page">
      <Navbar />

      <div className="checkout-container">
        {/* Header Section */}
        <div className="checkout-header">
          <button className="back-button" onClick={handleBackToCart}>
            <FiArrowLeft />
            Back to Cart
          </button>
          <div className="header-content">
            <h1>Checkout</h1>
            <p>Complete your order</p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="progress-indicator">
          <div className="progress-step active">
            <div className="step-icon">
              <FiTruck />
            </div>
            <span className="step-label">Shipping</span>
          </div>
          <div className="progress-line"></div>
          <div className="progress-step">
            <div className="step-icon">
              <FiCreditCard />
            </div>
            <span className="step-label">Payment</span>
          </div>
          <div className="progress-line"></div>
          <div className="progress-step">
            <div className="step-icon">
              <FiCheck />
            </div>
            <span className="step-label">Confirmation</span>
          </div>
        </div>

        <div className="checkout-content">
          {/* Left Section - Shipping Form */}
          <div className="checkout-left">
            <form className="shipping-form" onSubmit={handleSubmit}>
              {/* Saved addresses selector */}
              {savedAddresses.length > 0 && (
                <div className="saved-addresses">
                  <label className="saved-addresses-label">Select Shipping Address</label>
                  <div className="saved-addresses-list">
                    {savedAddresses.map((addr) => (
                      <label key={addr.id} className="saved-address-item">
                        <input
                          type="radio"
                          name="selectedAddress"
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                        />
                        <div className="saved-address-content">
                          <strong>{addr.name}</strong>
                          <div className="saved-address-line">{addr.street}</div>
                          <div className="saved-address-line">{addr.city}, {addr.province} {addr.zipCode}</div>
                          <div className="saved-address-line">{addr.phone}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  <button type="button" className="manage-addresses-link" onClick={() => navigate('/customer-manage-address')}>
                    Manage Addresses
                  </button>
                </div>
              )}
              <div className="form-header">
                <FiMapPin className="form-icon" />
                <h2>Shipping Information</h2>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="firstName">First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <div className="input-with-icon">
                    <FiMail className="input-icon" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="john.doe@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <div className="input-with-icon">
                    <FiPhone className="input-icon" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="+92-300-1234567"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="address">Street Address *</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    placeholder="Enter your complete address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    placeholder="Lahore"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="province">Province *</label>
                  <select
                    id="province"
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Province</option>
                    <option value="punjab">Punjab</option>
                    <option value="sindh">Sindh</option>
                    <option value="kpk">Khyber Pakhtunkhwa</option>
                    <option value="balochistan">Balochistan</option>
                    <option value="islamabad">Islamabad Capital Territory</option>
                    <option value="gilgit">Gilgit-Baltistan</option>
                    <option value="ajk">Azad Jammu & Kashmir</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="zipCode">Zip Code *</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    placeholder="54000"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="continue-button">
                Continue to Payment
              </button>
            </form>
          </div>

          {/* Right Section - Order Summary */}
          <div className="checkout-right">
            <div className="order-summary">
              <h3>Order Summary</h3>

              <div className="order-items">
                {orderItems.map(item => (
                  <div key={item.id} className="order-item">
                    <div className="item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="item-details">
                      <h4 className="item-name">{item.name}</h4>
                      <p className="item-quantity">Qty: {item.quantity}</p>
                    </div>
                    <div className="item-price">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="summary-divider"></div>

              <div className="price-breakdown">
                <div className="price-row">
                  <span>Subtotal:</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="price-row discount1">
                  <span>Discount (10%):</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
                <div className="price-row shipping">
                  <span>Shipping:</span>
                  <span>FREE</span>
                </div>
                <div className="price-row">
                  <span>Tax (5%):</span>
                  <span>{formatPrice(tax)}</span>
                </div>
              </div>

              <div className="summary-divider"></div>

              <div className="total-row">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CustomerCheckout;