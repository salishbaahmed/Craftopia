import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';
import './CustomerOrderConfirmation.css';
import { 
  FiCheckCircle, 
  FiTruck, 
  FiCalendar,
  FiMapPin,
  FiCreditCard,
  FiAward,
  FiShare2,
  FiDownload,
  FiShoppingBag
} from 'react-icons/fi';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [showRewardsAnimation, setShowRewardsAnimation] = useState(false);
  const [earnedRewards, setEarnedRewards] = useState(0);

  // Load real order data from localStorage
  useEffect(() => {
    const savedOrderData = localStorage.getItem('orderData');
    
    if (savedOrderData) {
      try {
        const orderData = JSON.parse(savedOrderData);
        
        // Format the order details with real data from payment
        const formattedOrderDetails = {
          orderId: orderData.orderId,
          orderDate: new Date(orderData.orderDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          estimatedDelivery: new Date(orderData.estimatedDelivery).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          status: 'confirmed',
          paymentMethod: orderData.paymentMethod,
          paymentAmount: orderData.total,
          items: orderData.orderItems,
          shippingAddress: {
            name: orderData.checkoutFormData?.firstName + ' ' + orderData.checkoutFormData?.lastName,
            street: orderData.checkoutFormData?.address || '',
            city: orderData.checkoutFormData?.city || '',
            province: orderData.checkoutFormData?.province || '',
            zipCode: orderData.checkoutFormData?.zipCode || '',
            phone: orderData.checkoutFormData?.phone || ''
          },
          rewardsEarned: orderData.earnedRewards || Math.floor(orderData.total * 0.01)
        };

        setOrderDetails(formattedOrderDetails);
        setEarnedRewards(formattedOrderDetails.rewardsEarned);

        // Add order to order history array (don't overwrite, append)
        // Check if order already exists in history to avoid duplicates
        const existingOrders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
        const orderAlreadyExists = existingOrders.some(order => order.orderId === orderData.orderId);
        
        if (!orderAlreadyExists) {
          // Normalize and add explicit fields for status, delivery and tracking
          const orderRecord = {
            orderId: orderData.orderId,
            orderDate: orderData.orderDate,
            estimatedDelivery: orderData.estimatedDelivery,
            total: orderData.total,
            orderItems: orderData.orderItems || [],
            checkoutFormData: orderData.checkoutFormData || {},
            paymentMethod: orderData.paymentMethod || 'Unknown',
            // explicit fields used by other pages
            status: 'confirmed',
            deliveredDate: orderData.deliveredDate || null,
            trackingNumber: orderData.trackingNumber || null
          };

          existingOrders.unshift(orderRecord); // Add to beginning
          localStorage.setItem('orderHistory', JSON.stringify(existingOrders));
        }

        // Update reward points - add earned rewards to customer balance
        // Only process rewards if this order hasn't been processed yet (check by looking for it in reward history)
        try {
          const savedRewardsData = localStorage.getItem('customerRewards');
          if (savedRewardsData) {
            const rewardsData = JSON.parse(savedRewardsData);
            
            // Check if this order's rewards have already been processed
            const rewardHistoryEntry = (rewardsData.pointsHistory || []).find(
              h => h.description && h.description.includes(orderData.orderId)
            );
            
            // Only add rewards if not already processed
            if (!rewardHistoryEntry) {
              const earnedPoints = formattedOrderDetails.rewardsEarned;
              const newAvailablePoints = rewardsData.availablePoints + earnedPoints;
              
              // Update balance
              rewardsData.availablePoints = newAvailablePoints;
              rewardsData.totalPoints = newAvailablePoints;
              
              // Add to history
              const newHistoryEntry = {
                id: Date.now(),
                type: 'earned',
                description: `Order #${orderData.orderId} - Craftopia Purchase`,
                points: earnedPoints,
                date: new Date().toISOString(),
                status: 'completed'
              };
              
              if (!rewardsData.pointsHistory) {
                rewardsData.pointsHistory = [];
              }
              rewardsData.pointsHistory.unshift(newHistoryEntry);
              
              // If reward points were used for payment, add deduction entry
              if (orderData.paymentMethod === 'Reward Points') {
                const deductedPoints = orderData.total;
                
                // Add a deduction entry to history
                const deductionEntry = {
                  id: Date.now() - 1,
                  type: 'used',
                  description: `Reward Points Payment - Order #${orderData.orderId}`,
                  points: -deductedPoints,
                  date: new Date().toISOString(),
                  status: 'completed'
                };
                
                rewardsData.pointsHistory.unshift(deductionEntry);
                rewardsData.usedPoints = (rewardsData.usedPoints || 0) + deductedPoints;
              }
              
              localStorage.setItem('customerRewards', JSON.stringify(rewardsData));
              window.dispatchEvent(new Event('rewardsUpdated'));
            }
          }
        } catch (error) {
          console.error('Error updating rewards:', error);
        }

        // Dispatch event to notify other pages (like OrderHistory) of the new order
        window.dispatchEvent(new Event('orderPlaced'));

        // Show rewards animation after a short delay
        setTimeout(() => {
          setShowRewardsAnimation(true);
        }, 1000);
      } catch (error) {
        console.error('Error loading order data:', error);
        // Fallback to empty/default state
        setOrderDetails({
          orderId: 'ORDER-ERROR',
          orderDate: new Date().toLocaleDateString(),
          estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          status: 'error',
          paymentMethod: 'Unknown',
          paymentAmount: 0,
          items: [],
          shippingAddress: {},
          rewardsEarned: 0
        });
      }
    } else {
      // No order data found - user may have navigated directly
      setOrderDetails({
        orderId: 'NO-ORDER',
        orderDate: new Date().toLocaleDateString(),
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        status: 'no-data',
        paymentMethod: 'Unknown',
        paymentAmount: 0,
        items: [],
        shippingAddress: {},
        rewardsEarned: 0
      });
    }
  }, []);

  const formatPrice = (price) => `Rs ${price.toLocaleString()}`;

  const handleContinueShopping = () => {
    navigate('/customer');
  };

  const handleTrackOrder = () => {
    navigate('/customer-track-order');
  };

  const handleDownloadInvoice = () => {
    // Simulate invoice download
    alert('Invoice download started!');
  };

  const handleShareOrder = () => {
    // Simulate sharing functionality
    if (navigator.share) {
      navigator.share({
        title: `My Craftopia Order - ${orderDetails?.orderId}`,
        text: `I just placed an order on Craftopia! Order ID: ${orderDetails?.orderId}`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`My Craftopia Order - ${orderDetails?.orderId}`);
      alert('Order details copied to clipboard!');
    }
  };

  if (!orderDetails) {
    return (
      <div className="order-confirmation-page">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your order details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="order-confirmation-page">
      <Navbar />
      
      <div className="confirmation-container">
        {/* Success Header */}
        <div className="success-header">
          <div className="success-icon">
            <FiCheckCircle />
          </div>
          <div className="success-content">
            <h1>Order Confirmed!</h1>
            <p>Thank you for your purchase. Your order has been successfully placed.</p>
            <div className="order-id">Order ID: {orderDetails.orderId}</div>
          </div>
        </div>

        {/* Rewards Earned Section */}
        {showRewardsAnimation && (
          <div className="rewards-earned-section">
            <div className="rewards-card">
              <div className="rewards-icon2">
                <FiAward />
              </div>
              <div className="rewards-content">
                <h3>🎉 You've Earned Reward Points!</h3>
                <div className="rewards-amount">
                  +{earnedRewards} Points
                </div>
                <p className="rewards-description">
                  Your reward points have been added to your account. 
                  Use them on your next purchase!
                </p>
                <div className="rewards-breakdown">
                  <span>Earned {earnedRewards} points (1% of purchase)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="confirmation-content">
          {/* Left Column - Order Details */}
          <div className="confirmation-left">
            {/* Order Summary Card */}
            <div className="order-card">
              <h3>Order Summary</h3>
              <div className="order-items">
                {orderDetails.items.map(item => (
                  <div key={item.id} className="order-item">
                    <div className="item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="item-details">
                      <h4 className="item-name">{item.name}</h4>
                      <p className="item-quantity">Quantity: {item.quantity}</p>
                      <p className="item-price">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="order-total">
                <div className="total-row">
                  <span>Total Paid</span>
                  <span className="total-amount">{formatPrice(orderDetails.paymentAmount)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Information Card */}
            <div className="info-card">
              <div className="card-header">
                <FiTruck className="card-icon" />
                <h3>Delivery Information</h3>
              </div>
              <div className="card-content">
                <div className="info-item">
                  <FiMapPin className="info-icon" />
                  <div className="info-details">
                    <strong>Shipping Address</strong>
                    <p>{orderDetails.shippingAddress.street}</p>
                    <p>{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.province} {orderDetails.shippingAddress.zipCode}</p>
                  </div>
                </div>
                <div className="info-item">
                  <FiCalendar className="info-icon" />
                  <div className="info-details">
                    <strong>Estimated Delivery</strong>
                    <p>{orderDetails.estimatedDelivery}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Status & Actions */}
          <div className="confirmation-right">
            {/* Order Status Timeline */}
            <div className="status-card">
              <h3>Order Status</h3>
              <div className="status-timeline">
                <div className="timeline-item completed">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <strong>Order Placed</strong>
                    <span>Your order has been confirmed</span>
                    <small>{orderDetails.orderDate}</small>
                  </div>
                </div>
                <div className="timeline-item active">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <strong>Processing</strong>
                    <span>We're preparing your order</span>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <strong>Shipped</strong>
                    <span>Your order is on the way</span>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <strong>Delivered</strong>
                    <span>Expected by {orderDetails.estimatedDelivery}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="info-card">
              <div className="card-header">
                <FiCreditCard className="card-icon" />
                <h3>Payment Information</h3>
              </div>
              <div className="card-content">
                <div className="payment-details">
                  <div className="payment-item">
                    <span>Payment Method:</span>
                    <strong>{orderDetails.paymentMethod}</strong>
                  </div>
                  <div className="payment-item">
                    <span>Amount Paid:</span>
                    <strong>{formatPrice(orderDetails.paymentAmount)}</strong>
                  </div>
                  <div className="payment-item">
                    <span>Payment Status:</span>
                    <strong className="status-success">Completed</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button 
                className="btn-primary"
                onClick={handleTrackOrder}
              >
                <FiTruck />
                Track Your Order
              </button>
              <button 
                className="btn-secondary"
                onClick={handleDownloadInvoice}
              >
                <FiDownload />
                Download Invoice
              </button>
              <button 
                className="btn-outline"
                onClick={handleShareOrder}
              >
                <FiShare2 />
                Share Order
              </button>
              <button 
                className="btn-continue"
                onClick={handleContinueShopping}
              >
                <FiShoppingBag />
                Continue Shopping
              </button>
            </div>

            {/* Support Information */}
            <div className="support-card">
              <h4>Need Help?</h4>
              <p>If you have any questions about your order, our support team is here to help.</p>
              <div className="support-contacts">
                <div className="contact-item">
                  <strong>Email:</strong> support@craftopia.com
                </div>
                <div className="contact-item">
                  <strong>Phone:</strong> +92-300-CRAFTOPIA
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps Section */}
        <div className="next-steps">
          <h3>What's Next?</h3>
          <div className="steps-grid">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Order Processing</h4>
                <p>We'll start preparing your items for shipment within 24 hours.</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Shipping Updates</h4>
                <p>You'll receive tracking information once your order ships.</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Delivery</h4>
                <p>Your order will arrive by {orderDetails.estimatedDelivery}.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;