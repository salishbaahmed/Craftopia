// CustomerTrackOrder.js
import React, { useState, useEffect } from 'react';
import { FiSearch, FiPackage, FiTruck, FiCheckCircle, FiClock, FiMapPin, FiAlertCircle } from 'react-icons/fi';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';
import './CustomerTrackOrder.css';

const CustomerTrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [availableOrders, setAvailableOrders] = useState([]);

  // Load available orders from localStorage on mount
  useEffect(() => {
    try {
      const orderHistory = localStorage.getItem('orderHistory');
      if (orderHistory) {
        const orders = JSON.parse(orderHistory);
        setAvailableOrders(orders);
      }
    } catch (error) {
      console.error('Error loading order history:', error);
    }
  }, []);

  // When admin updates orders, refresh trackedOrder if we're currently viewing one
  useEffect(() => {
    const onOrdersUpdated = () => {
      try {
        const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
        setAvailableOrders(orderHistory);
        if (orderId) {
          const foundOrder = orderHistory.find(o => (o.orderId === orderId) || (o.id === orderId));
          if (foundOrder) {
            // reuse the same formatting logic as in handleTrackOrder (simplified)
            const baseTimestamp = foundOrder.orderDate ? new Date(foundOrder.orderDate).toLocaleString('en-US', {
              year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true
            }) : '';
            const trackingHistory = [];
            trackingHistory.push({ status: 'order_placed', description: 'Order confirmed and processing', location: 'Online Store', timestamp: baseTimestamp || 'Placed', completed: true });
            const history = Array.isArray(foundOrder.deliveryHistory) ? foundOrder.deliveryHistory : [];
            history.forEach(entry => {
              const statusKey = (entry.status || '').toString().replace(/_/g, '-').toLowerCase();
              const time = (entry.date && entry.time) ? `${entry.date} ${entry.time}` : (entry.timestamp || '');
              trackingHistory.push({ status: statusKey, description: entry.notes || entry.description || '', location: entry.location || '', timestamp: time, completed: true });
            });
            const formattedOrder = {
              id: foundOrder.orderId || foundOrder.id,
              status: foundOrder.deliveryStatus || foundOrder.status || '',
              orderDate: foundOrder.orderDate ? new Date(foundOrder.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '',
              estimatedDelivery: foundOrder.estimatedDelivery ? new Date(foundOrder.estimatedDelivery).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '',
              deliveredDate: foundOrder.deliveredDate || '',
              customer: { name: `${foundOrder.checkoutFormData?.firstName || foundOrder.customerName || ''} ${foundOrder.checkoutFormData?.lastName || ''}`.trim(), phone: foundOrder.checkoutFormData?.phone || foundOrder.customerPhone || 'N/A', email: foundOrder.checkoutFormData?.email || foundOrder.customerEmail || 'N/A' },
              shippingAddress: {
                name: `${foundOrder.checkoutFormData?.firstName || foundOrder.customerName || ''} ${foundOrder.checkoutFormData?.lastName || ''}`.trim(),
                street: foundOrder.checkoutFormData?.address || (foundOrder.shippingAddress && (foundOrder.shippingAddress.street || foundOrder.shippingAddress.addressLine1)) || '',
                city: foundOrder.checkoutFormData?.city || (foundOrder.shippingAddress && (foundOrder.shippingAddress.city)) || '',
                province: foundOrder.checkoutFormData?.province || (foundOrder.shippingAddress && (foundOrder.shippingAddress.province || foundOrder.shippingAddress.state)) || '',
                zipCode: foundOrder.checkoutFormData?.zipCode || (foundOrder.shippingAddress && (foundOrder.shippingAddress.zipCode || foundOrder.shippingAddress.postalCode)) || '',
                phone: foundOrder.checkoutFormData?.phone || (foundOrder.shippingAddress && foundOrder.shippingAddress.phone) || ''
              },
              items: foundOrder.orderItems || foundOrder.items || [],
              totalAmount: foundOrder.totalAmount || foundOrder.total || 0,
              trackingNumber: foundOrder.trackingNumber || foundOrder.tracking || null,
              paymentMethod: foundOrder.paymentMethod || foundOrder.payment || '',
              trackingHistory
            };
            setTrackedOrder(formattedOrder);
          }
        }
      } catch (err) {
        // ignore
      }
    };

    window.addEventListener('ordersUpdated', onOrdersUpdated);
    return () => window.removeEventListener('ordersUpdated', onOrdersUpdated);
  }, [orderId]);

  // Listen for new orders being placed
  useEffect(() => {
    const handleOrderPlaced = () => {
      try {
        const orderHistory = localStorage.getItem('orderHistory');
        if (orderHistory) {
          const orders = JSON.parse(orderHistory);
          setAvailableOrders(orders);
        }
      } catch (error) {
        console.error('Error updating order history:', error);
      }
    };

    window.addEventListener('orderPlaced', handleOrderPlaced);
    // refresh when admin updates orders
    window.addEventListener('ordersUpdated', handleOrderPlaced);
    return () => {
      window.removeEventListener('orderPlaced', handleOrderPlaced);
      window.removeEventListener('ordersUpdated', handleOrderPlaced);
    };
  }, []);

  // Handle track order
  const handleTrackOrder = async (e) => {
    e.preventDefault();
    
    if (!orderId.trim()) {
      setError('Please enter an order ID');
      return;
    }

    setIsLoading(true);
    setError('');

    // Search for order in available orders from localStorage
    setTimeout(() => {
      const foundOrder = availableOrders.find(order => (order.orderId === orderId) || (order.id === orderId));

      if (foundOrder) {
        // Build tracking history from order.deliveryHistory (admin source) if available
        const baseTimestamp = foundOrder.orderDate ? new Date(foundOrder.orderDate).toLocaleString('en-US', {
          year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true
        }) : '';

        const trackingHistory = [];

        // Order placed entry
        trackingHistory.push({
          status: 'order_placed',
          description: 'Order confirmed and processing',
          location: 'Online Store',
          timestamp: baseTimestamp || 'Placed',
          completed: true
        });

        // Use deliveryHistory from admin if present
        const history = Array.isArray(foundOrder.deliveryHistory) ? foundOrder.deliveryHistory : [];
        history.forEach(entry => {
          // normalize status keys (allow 'out-for-delivery' and 'out_for_delivery')
          const statusKey = (entry.status || '').toString().replace(/_/g, '-').toLowerCase();
          const time = (entry.date && entry.time) ? `${entry.date} ${entry.time}` : (entry.timestamp || '');
          trackingHistory.push({
            status: statusKey,
            description: entry.notes || entry.description || '',
            location: entry.location || '',
            timestamp: time,
            completed: true
          });
        });

        // If deliveryStatus present but deliveryHistory empty, synthesize simple entries
        if ((!history || history.length === 0) && foundOrder.deliveryStatus) {
          const ds = (foundOrder.deliveryStatus || '').toString().replace(/_/g, '-');
          if (ds === 'processing') {
            trackingHistory.push({ status: 'processing', description: 'Order is being prepared', location: 'Warehouse', timestamp: 'In Progress', completed: false });
          } else if (ds === 'shipped') {
            trackingHistory.push({ status: 'shipped', description: 'Package shipped', location: 'Courier', timestamp: 'Pending', completed: true });
          } else if (ds === 'out-for-delivery' || ds === 'out-for-delivery') {
            trackingHistory.push({ status: 'out-for-delivery', description: 'Out for delivery', location: 'Your Area', timestamp: 'Pending', completed: true });
          } else if (ds === 'delivered') {
            trackingHistory.push({ status: 'delivered', description: 'Package delivered', location: 'Delivery Address', timestamp: foundOrder.deliveredDate || 'Delivered', completed: true });
          }
        }

        const formattedOrder = {
          id: foundOrder.orderId || foundOrder.id,
          status: foundOrder.deliveryStatus || foundOrder.status || '',
          orderDate: foundOrder.orderDate ? new Date(foundOrder.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '',
          estimatedDelivery: foundOrder.estimatedDelivery ? new Date(foundOrder.estimatedDelivery).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '',
          deliveredDate: foundOrder.deliveredDate || '',
          customer: {
            name: `${foundOrder.checkoutFormData?.firstName || foundOrder.customerName || ''} ${foundOrder.checkoutFormData?.lastName || ''}`.trim(),
            phone: foundOrder.checkoutFormData?.phone || foundOrder.customerPhone || 'N/A',
            email: foundOrder.checkoutFormData?.email || foundOrder.customerEmail || 'N/A'
          },
          shippingAddress: {
            name: `${foundOrder.checkoutFormData?.firstName || foundOrder.customerName || ''} ${foundOrder.checkoutFormData?.lastName || ''}`.trim(),
            street: foundOrder.checkoutFormData?.address || (foundOrder.shippingAddress && (foundOrder.shippingAddress.street || foundOrder.shippingAddress.addressLine1)) || '',
            city: foundOrder.checkoutFormData?.city || (foundOrder.shippingAddress && (foundOrder.shippingAddress.city)) || '',
            province: foundOrder.checkoutFormData?.province || (foundOrder.shippingAddress && (foundOrder.shippingAddress.province || foundOrder.shippingAddress.state)) || '',
            zipCode: foundOrder.checkoutFormData?.zipCode || (foundOrder.shippingAddress && (foundOrder.shippingAddress.zipCode || foundOrder.shippingAddress.postalCode)) || '',
            phone: foundOrder.checkoutFormData?.phone || (foundOrder.shippingAddress && foundOrder.shippingAddress.phone) || ''
          },
          items: foundOrder.orderItems || foundOrder.items || [],
          totalAmount: foundOrder.totalAmount || foundOrder.total || 0,
          trackingNumber: foundOrder.trackingNumber || foundOrder.tracking || null,
          paymentMethod: foundOrder.paymentMethod || foundOrder.payment || '',
          trackingHistory
        };
        setTrackedOrder(formattedOrder);
      } else {
        setError(`Order ID "${orderId}" not found. Please check your order ID or visit your orders page.`);
      }
      setIsLoading(false);
    }, 500);
  };

  // Get status icon
  const getStatusIcon = (status) => {
    const key = (status || '').toString().replace(/_/g, '-').toLowerCase();
    switch (key) {
      case 'delivered':
        return <FiCheckCircle className="customertrackorder-status-icon delivered" />;
      case 'out-for-delivery':
        return <FiTruck className="customertrackorder-status-icon out-for-delivery" />;
      case 'shipped':
        return <FiPackage className="customertrackorder-status-icon shipped" />;
      case 'processing':
        return <FiClock className="customertrackorder-status-icon processing" />;
      case 'order_placed':
        return <FiCheckCircle className="customertrackorder-status-icon completed" />;
      default:
        return <FiClock className="customertrackorder-status-icon processing" />;
    }
  };

  // Get status text
  const getStatusText = (status) => {
    const key = (status || '').toString().replace(/_/g, '-').toLowerCase();
    switch (key) {
      case 'delivered':
        return 'Delivered';
      case 'out-for-delivery':
        return 'Out for Delivery';
      case 'shipped':
        return 'Shipped';
      case 'processing':
        return 'Processing';
      case 'order_placed':
        return 'Order Placed';
      default:
        return 'Processing';
    }
  };

  // Get overall order status
  const getOverallStatus = (status) => {
    const key = (status || '').toString().replace(/_/g, '-').toLowerCase();
    switch (key) {
      case 'delivered':
        return { text: 'Delivered', class: 'delivered' };
      case 'shipped':
      case 'out-for-delivery':
        return { text: 'In Transit', class: 'shipped' };
      default:
        return { text: 'Processing', class: 'processing' };
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `Rs ${amount.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="customertrackorder">
      <Navbar />
      
      <div className="customertrackorder-container">
        {/* Page Header */}
        <div className="customertrackorder-header">
          <h1 className="customertrackorder-page-title">Track Your Order</h1>
          <p className="customertrackorder-page-subtitle">
            Enter your order ID to track your package in real-time
          </p>
        </div>

        {/* Track Order Form */}
        <div className="customertrackorder-form-section">
          <div className="customertrackorder-form-card">
            <form onSubmit={handleTrackOrder} className="customertrackorder-form">
              <div className="customertrackorder-input-group">
                <input
                  type="text"
                  className="customertrackorder-input"
                  placeholder="Enter Order ID (e.g., ORD-1764004172589)"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  disabled={isLoading}
                />
                <button 
                  type="submit" 
                  className="customertrackorder-track-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="customertrackorder-spinner"></div>
                  ) : (
                    <>
                      <FiSearch className="customertrackorder-search-icon" />
                      Track Order
                    </>
                  )}
                </button>
              </div>
              {error && (
                <div className="customertrackorder-error">
                  <FiAlertCircle />
                  {error}
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Tracked Order Details */}
        {trackedOrder && (
          <div className="customertrackorder-results">
            {/* Order Summary */}
            <div className="customertrackorder-summary-card">
              <div className="customertrackorder-summary-header">
                <div className="customertrackorder-order-info">
                  <h3 className="customertrackorder-order-id">
                    Order #{trackedOrder.id}
                  </h3>
                  <div className={`customertrackorder-status-badge ${getOverallStatus(trackedOrder.status).class}`}>
                    {getOverallStatus(trackedOrder.status).text}
                  </div>
                </div>
              </div>

              <div className="customertrackorder-summary-content">
                <div className="customertrackorder-summary-grid">
                  <div className="customertrackorder-summary-item">
                    <span className="customertrackorder-summary-label">Order Date:</span>
                    <span className="customertrackorder-summary-value">{trackedOrder.orderDate}</span>
                  </div>
                  <div className="customertrackorder-summary-item">
                    <span className="customertrackorder-summary-label">Estimated Delivery:</span>
                    <span className="customertrackorder-summary-value">{trackedOrder.estimatedDelivery}</span>
                  </div>
                  <div className="customertrackorder-summary-item">
                    <span className="customertrackorder-summary-label">Payment Method:</span>
                    <span className="customertrackorder-summary-value">{trackedOrder.paymentMethod}</span>
                  </div>
                  <div className="customertrackorder-summary-item">
                    <span className="customertrackorder-summary-label">Total Amount:</span>
                    <span className="customertrackorder-summary-value customertrackorder-total-amount">
                      {formatCurrency(trackedOrder.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="customertrackorder-items-card">
              <h4 className="customertrackorder-section-title">Order Items</h4>
              <div className="customertrackorder-items-list">
                {trackedOrder.items.map((item) => (
                  <div key={item.id} className="customertrackorder-item">
                    <div className="customertrackorder-item-image">
                      <img src={item.image} alt={item.name} onError={(e) => e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="14" text-anchor="middle" dy=".3em" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E'} />
                    </div>
                    <div className="customertrackorder-item-details">
                      <h5 className="customertrackorder-item-name">{item.name}</h5>
                      <div className="customertrackorder-item-meta">
                        <span className="customertrackorder-item-quantity">Qty: {item.quantity}</span>
                        <span className="customertrackorder-item-price">{formatCurrency(item.price)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="customertrackorder-address-card">
              <h4 className="customertrackorder-section-title">Shipping Address</h4>
              <div className="customertrackorder-address-details">
                <FiMapPin className="customertrackorder-address-icon" />
                <div className="customertrackorder-address-content">
                  <p className="customertrackorder-address-name">{trackedOrder.shippingAddress.name}</p>
                  <p className="customertrackorder-address-street">{trackedOrder.shippingAddress.street}</p>
                  <p className="customertrackorder-address-city">
                    {trackedOrder.shippingAddress.city}, {trackedOrder.shippingAddress.province} {trackedOrder.shippingAddress.zipCode}
                  </p>
                  <p className="customertrackorder-address-phone">Phone: {trackedOrder.shippingAddress.phone}</p>
                </div>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="customertrackorder-timeline-card">
              <h4 className="customertrackorder-section-title">Tracking History</h4>
              <div className="customertrackorder-timeline">
                {trackedOrder.trackingHistory.map((event, index) => (
                  <div key={index} className={`customertrackorder-timeline-item ${event.completed ? 'completed' : ''}`}>
                    <div className="customertrackorder-timeline-icon">
                      {getStatusIcon(event.status)}
                    </div>
                    <div className="customertrackorder-timeline-content">
                      <div className="customertrackorder-timeline-header">
                        <span className="customertrackorder-timeline-title">
                          {getStatusText(event.status)}
                        </span>
                        <span className="customertrackorder-timeline-time">{event.timestamp}</span>
                      </div>
                      <p className="customertrackorder-timeline-description">{event.description}</p>
                      <p className="customertrackorder-timeline-location">{event.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        {!trackedOrder && !isLoading && (
          <div className="customertrackorder-help-section">
            <div className="customertrackorder-help-card">
              <h3 className="customertrackorder-help-title">How to Track Your Order</h3>
              <div className="customertrackorder-help-content">
                <p>You can only track orders that you've placed through Craftopia. Your order ID starts with "ORD-" followed by a number.</p>
                <p className="customertrackorder-help-note">
                  <FiAlertCircle style={{ marginRight: '8px' }} />
                  Only orders in your order history can be tracked. Please visit your Orders page to see all your orders.
                </p>
                {availableOrders.length > 0 && (
                  <div className="customertrackorder-available-orders">
                    <p className="customertrackorder-available-title">Your Available Orders:</p>
                    <div className="customertrackorder-available-list">
                      {availableOrders.map((order) => (
                        <button 
                          key={order.orderId}
                          className="customertrackorder-available-btn"
                          onClick={() => setOrderId(order.orderId)}
                        >
                          {order.orderId}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {availableOrders.length === 0 && (
                  <div className="customertrackorder-no-orders">
                    <p>You haven't placed any orders yet. Place an order to track it here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CustomerTrackOrder;