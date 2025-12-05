// CustomerMyAccount.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPackage, FiHeart, FiCreditCard, FiLogOut, FiX, FiCalendar, FiDollarSign, FiShoppingBag } from 'react-icons/fi';
import { FaBox, FaMapMarkerAlt, FaUserEdit } from 'react-icons/fa';
import { HiOutlineHome } from 'react-icons/hi';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';
import './CustomerMyAccount.css';
import api from '../../../api/axios';

const CustomerMyAccount = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: HiOutlineHome, path: '/customer-myaccount' },
    { id: 'orders', label: 'My Orders', icon: FaBox, path: '/customer-orders' },
    { id: 'favorites', label: 'WishList', icon: FiHeart, path: '/customer-wishlist' },
    { id: 'addresses', label: 'Addresses', icon: FaMapMarkerAlt, path: '/customer-manage-address' },
    { id: 'profile', label: 'Update Profile', icon: FaUserEdit, path: '/customer-update-profile' }
  ];

  const overviewCards = [
    { icon: FiPackage, number: '12', label: 'Total Orders', color: '#00C78B' },
    { icon: FiHeart, number: '3', label: 'Favorites', color: '#FF0F8F' },
    { icon: FiCreditCard, number: 'Rs 85,400', label: 'Total Spent', color: '#8B5CF6' }
  ];

  // Recent orders: load from orderHistory in localStorage so overview stays in sync
  const [recentOrders, setRecentOrders] = useState([]);



  // ...

  useEffect(() => {
    const loadRecentOrders = async () => {
      try {
        const response = await api.get('/orders/my-orders');
        // Sort by date desc and take top 3
        const sorted = response.data.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);

        const mapped = sorted.map(order => ({
          ...order,
          statusColor: order.status === 'Delivered' ? '#10B981' : order.status === 'Shipped' ? '#8B5CF6' : '#3B82F6',
          products: order.items
        }));

        setRecentOrders(mapped);
      } catch (err) {
        console.error('Error loading recent orders:', err);
        setRecentOrders([]);
      }
    };

    loadRecentOrders();
  }, []);

  const ctaCards = [
    {
      title: 'Continue Shopping',
      subtitle: 'Discover more handmade crafts',
      buttonText: 'Browse Products',
      bgColor: '#00B6C8',
      textColor: '#FFFFFF'
    },
    {
      title: 'Need Help?',
      subtitle: 'Contact our support team',
      buttonText: 'Contact Support',
      bgColor: '#FF0F8F',
      textColor: '#FFFFFF'
    }
  ];

  const handleMenuClick = (menu) => {
    setActiveSection(menu.id);
    navigate(menu.path);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  // Function to handle view details click
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  // Function to close modal
  const handleCloseModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
  };

  return (
    <div className="customer-myaccount">
      <Navbar />

      <div className="customer-myaccount-container">
        {/* Sidebar */}
        <div className="customer-account-sidebar">
          <div className="customer-sidebar-card">
            <div className="customer-user-info">
              <div className="customer-avatar">A</div>
              <h3 className="customer-user-name">Ali Raza</h3>
              <p className="customer-user-email">ali.raza@email.com</p>
            </div>

            <nav className="customer-sidebar-nav">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    className={`customer-nav-item ${activeSection === item.id ? 'customer-nav-active' : ''}`}
                    onClick={() => handleMenuClick(item)}
                  >
                    <IconComponent className="customer-nav-icon" />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <button
                className="customer-nav-item customer-nav-logout"
                onClick={() => handleNavigation('/customer-login')}
              >
                <FiLogOut className="customer-nav-icon" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="customer-account-content">
          {/* Overview Cards */}
          <div className="customer-overview-cards">
            {overviewCards.map((card, index) => {
              const IconComponent = card.icon;
              return (
                <div key={index} className="customer-overview-card">
                  <div className="customer-card-icon" style={{ backgroundColor: card.color }}>
                    <IconComponent className="customer-card-icon-svg" />
                  </div>
                  <div className="customer-card-content">
                    <h3 className="customer-card-number">{card.number}</h3>
                    <p className="customer-card-label">{card.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Orders */}
          <div className="customer-recent-orders-section">
            <div className="customer-section-header">
              <h2 className="customer-section-title">Recent Orders</h2>
              <button
                className="customer-view-all-btn"
                onClick={() => handleNavigation('/customer-orders')}
              >
                View All
              </button>
            </div>

            <div className="customer-orders-list">
              {recentOrders.map((order) => (
                <div key={order.id} className="customer-order-card">
                  <div className="customer-product-image-placeholder"></div>

                  <div className="customer-order-details">
                    <h4 className="customer-order-number">{order.id}</h4>
                    <p className="customer-order-date">Placed on {order.date}</p>
                    <p className="customer-order-summary">{order.items} items • {order.amount}</p>
                    <button
                      className="customer-view-details-btn"
                      onClick={() => handleViewDetails(order)}
                    >
                      View Details
                    </button>
                  </div>

                  <div className="customer-order-status">
                    <span
                      className="customer-status-badge"
                      style={{ backgroundColor: order.statusColor }}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="customer-cta-section">
            <div
              className="customer-cta-card"
              style={{ backgroundColor: ctaCards[0].bgColor, color: ctaCards[0].textColor }}
            >
              <h3 className="customer-cta-title">{ctaCards[0].title}</h3>
              <p className="customer-cta-subtitle">{ctaCards[0].subtitle}</p>
              <button
                className="customer-cta-button"
                style={{ backgroundColor: ctaCards[0].textColor, color: ctaCards[0].bgColor }}
                onClick={() => handleNavigation('/customer')}
              >
                {ctaCards[0].buttonText}
              </button>
            </div>

            <div
              className="customer-cta-card"
              style={{ backgroundColor: ctaCards[1].bgColor, color: ctaCards[1].textColor }}
            >
              <h3 className="customer-cta-title">{ctaCards[1].title}</h3>
              <p className="customer-cta-subtitle">{ctaCards[1].subtitle}</p>
              <button
                className="customer-cta-button"
                style={{ backgroundColor: ctaCards[1].textColor, color: ctaCards[1].bgColor }}
                onClick={() => handleNavigation('/customer-contact-support')}
              >
                {ctaCards[1].buttonText}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="customer-order-modal-overlay">
          <div className="customer-order-modal">
            <div className="customer-order-modal-header">
              <h2 className="customer-order-modal-title">Order Details</h2>
              <button className="customer-order-modal-close" onClick={handleCloseModal}>
                <FiX className="customer-modal-close-icon" />
              </button>
            </div>

            <div className="customer-order-modal-content">
              {/* Order Summary */}
              <div className="customer-order-summary-section">
                <div className="customer-order-info-row">
                  <div className="customer-order-info-item">
                    <FiCalendar className="customer-order-info-icon" />
                    <div>
                      <p className="customer-order-info-label">Order Date</p>
                      <p className="customer-order-info-value">{selectedOrder.date}</p>
                    </div>
                  </div>
                  <div className="customer-order-info-item">
                    <FiShoppingBag className="customer-order-info-icon" />
                    <div>
                      <p className="customer-order-info-label">Order ID</p>
                      <p className="customer-order-info-value">{selectedOrder.id}</p>
                    </div>
                  </div>
                  <div className="customer-order-info-item">
                    <FiDollarSign className="customer-order-info-icon" />
                    <div>
                      <p className="customer-order-info-label">Total Amount</p>
                      <p className="customer-order-info-value">{selectedOrder.amount}</p>
                    </div>
                  </div>
                </div>

                <div className="customer-order-status-display">
                  <span
                    className="customer-order-status-badge"
                    style={{ backgroundColor: selectedOrder.statusColor }}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              {/* Products List */}
              <div className="customer-order-products-section">
                <h3 className="customer-order-products-title">Products ({selectedOrder.items})</h3>
                <div className="customer-order-products-list">
                  {selectedOrder.products.map((product) => (
                    <div key={product.id} className="customer-order-product-item">
                      <div className="customer-order-product-image"></div>
                      <div className="customer-order-product-details">
                        <h4 className="customer-order-product-name">{product.name}</h4>
                        <p className="customer-order-product-price">{product.price}</p>
                        <p className="customer-order-product-quantity">Quantity: {product.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Information */}
              <div className="customer-order-shipping-section">
                <h3 className="customer-order-shipping-title">Shipping Information</h3>
                <div className="customer-order-shipping-details">
                  <p className="customer-order-shipping-address">
                    <strong>Address:</strong> {selectedOrder.shippingAddress}
                  </p>
                  <p className="customer-order-delivery-date">
                    <strong>Expected Delivery:</strong> {selectedOrder.deliveryDate}
                  </p>
                  <p className="customer-order-payment-method">
                    <strong>Payment Method:</strong> {selectedOrder.paymentMethod}
                  </p>
                </div>
              </div>
            </div>

            <div className="customer-order-modal-footer">
              <button
                className="customer-order-modal-button customer-order-modal-close-btn"
                onClick={handleCloseModal}
              >
                Close
              </button>
              <button
                className="customer-order-modal-button customer-order-modal-support-btn"
                onClick={() => handleNavigation('/customer-contact-support')}
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CustomerMyAccount;