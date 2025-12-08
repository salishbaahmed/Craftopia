// CustomerOrders.js

import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { FiCalendar, FiShoppingBag, FiPackage, FiTruck, FiCheckCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi';

import Navbar from '../../../components/Navbar/Navbar';

import Footer from '../../../components/Footer/Footer';

import './CustomerOrders.css';

import api from '../../../api/axios';



const CustomerOrders = () => {

  const [expandedOrder, setExpandedOrder] = useState(null);

  const [orders, setOrders] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();



  // Load orders from localStorage on mount





  // ...

// Add auto-refresh every 10 seconds to see status updates

  useEffect(() => {

    const loadOrders = async () => {

      try {

        const response = await api.get('/orders');

        console.log('Orders response:', response.data);

        setOrders(response.data);

        setIsLoading(false);

      } catch (error) {

        console.error('Error loading orders:', error);

        setOrders([]);

        setIsLoading(false);

      }

    };



    // Load immediately

    loadOrders();



    // Set up polling every 10 seconds to check for status updates

    const interval = setInterval(loadOrders, 10000);



    // Cleanup interval on unmount

    return () => clearInterval(interval);

  }, []);

  // Toggle order details view

  const toggleOrderDetails = (orderId) => {

    setExpandedOrder(expandedOrder === orderId ? null : orderId);

  };



  // Handle button actions

  const handleRateProduct = (order, product) => {

    navigate('/customer-product-rating', {

      state: {

        orderItem: {

          ...product,

          orderId: order.id,

          orderDate: order.date

        }

      }

    });

  };



  const handleTrackOrder = () => {

    navigate('/customer-track-order');

    // Navigate to tracking page

  };



  // Check whether a given order item has already been rated by this customer

  const isItemRated = (orderId, productId, productName) => {

    try {

      const raw = localStorage.getItem('customerFeedbacks');

      if (!raw) return false;

      const list = JSON.parse(raw) || [];

      return list.some(fb => String(fb.orderId) === String(orderId) && (

        (fb.productId != null && String(fb.productId) === String(productId)) || fb.product === productName

      ));

    } catch (err) {

      return false;

    }

  };



  // Get status badge class

  const getStatusBadgeClass = (status) => {

    switch (status) {

      case 'Delivered':

        return 'customer-status-badge customer-status-delivered';

      case 'Shipped':

        return 'customer-status-badge customer-status-shipped';

      case 'Out for Delivery':

        return 'customer-status-badge customer-status-out-for-delivery';

      case 'Processing':

        return 'customer-status-badge customer-status-processing';

      case 'Approved':

        return 'customer-status-badge customer-status-approved';

      case 'Rejected':

        return 'customer-status-badge customer-status-rejected';

      case 'Delayed':

        return 'customer-status-badge customer-status-delayed';

      case 'Pending':

        return 'customer-status-badge customer-status-pending';

      default:

        return 'customer-status-badge customer-status-processing';

    }

  };



  // Format currency

  const formatCurrency = (amount) => {

    return `RS.${amount.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  };



  return (

    <div className="customer-orders1">

      <Navbar />



      <div className="customer-orders-container">

        {/* Page Header */}

        <div className="customer-orders-header">

          <h1 className="customer-page-title">My Orders</h1>

          <p className="customer-page-subtitle">Track and manage your order history</p>

        </div>



        {/* Loading State */}

        {isLoading && (

          <div className="loading-container">

            <div className="loading-spinner"></div>

            <p>Loading your orders...</p>

          </div>

        )}



        {/* Empty State */}

        {!isLoading && orders.length === 0 && (

          <div className="empty-orders-state">

            <div className="empty-icon">

              <FiShoppingBag />

            </div>

            <h2>No Orders Yet</h2>

            <p>You haven't placed any orders yet. Start shopping to see your orders here!</p>

            <button

              className="customer-continue-shopping-btn"

              onClick={() => navigate('/customer')}

            >

              Continue Shopping

            </button>

          </div>

        )}



        {/* Orders List */}

        {!isLoading && orders.length > 0 && (

          <div className="customer-orders-list1">

            {orders.map((order) => (

              <div key={order.id} className="customer-order-card1">

                {/* Order Summary */}

                <div className="customer-order-summary">

                  {/* Top Row - Order ID and Status */}

                  <div className="customer-order-header">

                    <div className="customer-order-id-section">

                      <FiShoppingBag className="customer-order-icon" />

                      <span className="customer-order-id">Order #{order.id}</span>

                    </div>

                    <div className={getStatusBadgeClass(order.status)}>

                      {order.status}

                    </div>

                  </div>



                  {/* Second Row - Date and Amount */}

                  <div className="customer-order-meta">

                    <div className="customer-date-section">

                      <FiCalendar className="customer-calendar-icon" />

                      <span className="customer-order-date">{new Date(order.createdAt).toLocaleDateString()}</span>

                    </div>

                    <div className="customer-amount-section">

                      <span className="customer-order-amount">{formatCurrency(order.total)}</span>

                    </div>

                  </div>



                  {/* Third Row - Product Information */}

                  <div className="customer-product-info">

                    <h3 className="customer-product-title">{order.items?.[0]?.name || 'Order Items'}</h3>

                    {order.items && order.items.length > 1 && (

                      <span className="customer-more-items">

                        +{order.items.length - 1} more item{order.items.length - 1 > 1 ? 's' : ''}

                      </span>

                    )}

                  </div>



                  {/* Bottom Row - Action Buttons */}

                  <div className="customer-order-actions">

                    <button

                      className="customer-view-details-btn"

                      onClick={() => toggleOrderDetails(order.id)}

                    >

                      {expandedOrder === order.id ? 'Hide Details' : 'View Order Details'}

                      {expandedOrder === order.id ? <FiChevronUp /> : <FiChevronDown />}

                    </button>



                    {order.status === 'Delivered' && order.items?.[0] && (

                      isItemRated(order.id, order.items[0]?.id, order.items[0]?.name) ? (

                        <button className="customer-rate-product-btn" disabled>

                          Rated

                        </button>

                      ) : (

                        <button

                          className="customer-rate-product-btn"

                          onClick={() => handleRateProduct(order, order.items[0])}

                        >

                          Rate Product

                        </button>

                      )

                    )}



                    {(order.status === 'Shipped' || order.status === 'Out for Delivery') && (

                      <button

                        className="customer-track-order-btn"

                        onClick={() => handleTrackOrder()}

                      >

                        Track Order

                      </button>

                    )}

                  </div>

                </div>



                {/* Order Details - Expanded View */}

                {expandedOrder === order.id && (

                  <div className="customer-order-details">

                    {/* Order Items */}

                    <div className="customer-order-items-section">

                      <h4 className="customer-section-title">Order Items</h4>

                      <div className="customer-order-items">

                        {order.items && order.items.length > 0 ? (

                          order.items.map((item, index) => (

                            <div key={item.id || index} className="customer-order-item">

                              <div className="customer-item-image">

                                {/* Placeholder for product image */}

                                <div className="customer-image-placeholder">

                                  <FiPackage />

                                </div>

                              </div>

                              <div className="customer-item-details">

                                <h5 className="customer-item-name">{item.name}</h5>

                                <p className="customer-item-category">{item.category}</p>

                                <div className="customer-item-meta">

                                  <span className="customer-item-quantity">Qty: {item.quantity}</span>

                                  <span className="customer-item-price">{formatCurrency(item.price)}</span>

                                </div>

                                {order.status === 'Delivered' && (

                                  isItemRated(order.id, item?.id, item?.name) ? (

                                    <button className="customer-rate-product-btn customer-rate-item-btn" disabled>Rated</button>

                                  ) : (

                                    <button

                                      className="customer-rate-product-btn customer-rate-item-btn"

                                      onClick={() => handleRateProduct(order, item)}

                                    >

                                      Rate This Product

                                    </button>

                                  )

                                )}

                              </div>

                            </div>

                          ))

                        ) : (

                          <p>No items found</p>

                        )}

                      </div>

                    </div>



                    {/* Order Summary */}

                    <div className="customer-order-summary-section">

                      <h4 className="customer-section-title">Order Summary</h4>

                      <div className="customer-summary-grid">

                        <div className="customer-summary-item">

                          <span className="customer-summary-label">Subtotal:</span>

                          <span className="customer-summary-value">{formatCurrency(order.total)}</span>

                        </div>

                        <div className="customer-summary-item">

                          <span className="customer-summary-label">Shipping:</span>

                          <span className="customer-summary-value">RS.0.00</span>

                        </div>

                        <div className="customer-summary-item">

                          <span className="customer-summary-label">Tax:</span>

                          <span className="customer-summary-value">RS.0.00</span>

                        </div>

                        <div className="customer-summary-item customer-total">

                          <span className="customer-summary-label">Total:</span>

                          <span className="customer-summary-value">{formatCurrency(order.total)}</span>

                        </div>

                      </div>

                    </div>



                    {/* Shipping Information */}

                    <div className="customer-shipping-section">

                      <h4 className="customer-section-title">Shipping Information</h4>

                      <div className="customer-shipping-details">

                        <p><strong>{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</strong></p>

                        <p>{order.shippingAddress?.address || order.shippingAddress?.street}</p>

                        <p>{order.shippingAddress?.city}, {order.shippingAddress?.province} {order.shippingAddress?.zipCode}</p>

                        <p>Phone: {order.shippingAddress?.phone}</p>

                      </div>

                    </div>



                    {/* Order Status Timeline */}

                    <div className="customer-status-timeline">

                      <h4 className="customer-section-title">Order Status</h4>

                      <div className="customer-timeline">

                        <div className={`customer-timeline-item ${order.status !== 'Processing' ? 'customer-timeline-completed' : ''}`}>

                          <div className="customer-timeline-icon">

                            <FiCheckCircle />

                          </div>

                          <div className="customer-timeline-content">

                            <span className="customer-timeline-title">Order Placed</span>

                            <span className="customer-timeline-date">{new Date(order.createdAt).toLocaleDateString()}</span>

                          </div>

                        </div>

                        <div className={`customer-timeline-item ${(order.status === 'Shipped' || order.status === 'Out for Delivery' || order.status === 'Delivered') ? 'customer-timeline-completed' : ''}`}>

                          <div className="customer-timeline-icon">

                            <FiPackage />

                          </div>

                          <div className="customer-timeline-content">

                            <span className="customer-timeline-title">Processing</span>

                            <span className="customer-timeline-date">{new Date(order.createdAt).toLocaleDateString()}</span>

                          </div>

                        </div>

                        <div className={`customer-timeline-item ${(order.status === 'Shipped' || order.status === 'Out for Delivery' || order.status === 'Delivered') ? 'customer-timeline-completed' : ''}`}>

                          <div className="customer-timeline-icon">

                            <FiTruck />

                          </div>

                          <div className="customer-timeline-content">

                            <span className="customer-timeline-title">Shipped</span>

                            {order.trackingNumber && (

                              <span className="customer-tracking-number">

                                Tracking: {order.trackingNumber}

                              </span>

                            )}

                          </div>

                        </div>

                        <div className={`customer-timeline-item ${order.status === 'Delivered' ? 'customer-timeline-completed' : ''}`}>

                          <div className="customer-timeline-icon">

                            <FiCheckCircle />

                          </div>

                          <div className="customer-timeline-content">

                            <span className="customer-timeline-title">Delivered</span>

                            {order.deliveredDate && (

                              <span className="customer-timeline-date">{order.deliveredDate}</span>

                            )}

                          </div>

                        </div>

                      </div>

                    </div>

                  </div>

                )}

              </div>

            ))}

          </div>

        )}

      </div>



      <Footer />

    </div>

  );

};



export default CustomerOrders;