import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';
import api from '../../../api/axios';
import { useAuth } from '../../../context/AuthContext';
import './CustomerMakePayment.css';
import {
  FiCreditCard,
  FiDollarSign,
  FiSmartphone,
  FiTruck,
  FiCheck,
  FiLock,
  FiArrowLeft,
  FiShield,
  FiAward,
  FiStar
} from 'react-icons/fi';

const CustomerMakePayment = () => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, processing, success, failed
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  // Load customer reward points from localStorage
  const [customerRewards, setCustomerRewards] = useState(() => {
    try {
      const savedRewardsData = localStorage.getItem('customerRewards');
      if (savedRewardsData) {
        const rewardsData = JSON.parse(savedRewardsData);
        return rewardsData.availablePoints || 5000;
      }
      return 5000; // Default if no data exists
    } catch (error) {
      console.error('Error loading rewards:', error);
      return 5000;
    }
  });

  // Load checkout data from localStorage
  const [orderSummary] = useState(() => {
    const savedCheckout = localStorage.getItem('checkoutData');
    if (savedCheckout) {
      try {
        const checkoutData = JSON.parse(savedCheckout);
        return {
          items: checkoutData.orderItems,
          subtotal: checkoutData.subtotal,
          discount: checkoutData.subtotal * 0.10,
          shipping: 0,
          tax: (checkoutData.subtotal - (checkoutData.subtotal * 0.10)) * 0.05,
          total: checkoutData.total,
          checkoutFormData: checkoutData.formData
        };
      } catch (error) {
        console.error('Error loading checkout data:', error);
        // Fallback to empty items
        return {
          items: [],
          subtotal: 0,
          discount: 0,
          shipping: 0,
          tax: 0,
          total: 0,
          checkoutFormData: {}
        };
      }
    }
    return {
      items: [],
      subtotal: 0,
      discount: 0,
      shipping: 0,
      tax: 0,
      total: 0,
      checkoutFormData: {}
    };
  });

  // Calculate if rewards can cover the total
  const canUseRewards = customerRewards >= orderSummary.total;
  const remainingRewards = customerRewards - orderSummary.total;

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <FiCreditCard />,
      description: 'Pay securely with your card'
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: <FiDollarSign />,
      description: 'Pay when you receive your order'
    },
    {
      id: 'rewards',
      name: 'Use Reward Points',
      icon: <FiAward />,
      description: `Use your ${customerRewards.toLocaleString()} reward points`,
      disabled: !canUseRewards
    },
    {
      id: 'wallet',
      name: 'Mobile Wallet',
      icon: <FiSmartphone />,
      description: 'Pay using your mobile wallet'
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: <FiDollarSign />,
      description: 'Transfer directly from your bank'
    }
  ];

  const formatPrice = (price) => `Rs ${price.toLocaleString()}`;

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Function to update rewards balance and save to localStorage
  const updateRewards = (newBalance) => {
    try {
      const savedRewardsData = localStorage.getItem('customerRewards');
      if (savedRewardsData) {
        const rewardsData = JSON.parse(savedRewardsData);
        rewardsData.availablePoints = newBalance;
        rewardsData.totalPoints = newBalance;
        localStorage.setItem('customerRewards', JSON.stringify(rewardsData));
        setCustomerRewards(newBalance);
        // Dispatch event to notify other pages of reward update
        window.dispatchEvent(new Event('rewardsUpdated'));
      }
    } catch (error) {
      console.error('Error updating rewards balance:', error);
    }
  };

  const { user } = useAuth();

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    // Common function to create order in backend
    const createBackendOrder = async (paymentMethod) => {
      try {
        if (!user) {
          console.log('User not logged in, skipping backend order creation');
          return `ORD-${Date.now()}`; // Return local ID for guests
        }

        const orderPayload = {
          items: orderSummary.items.map(item => ({
            productId: String(item.id), // Convert to string to match backend expectation
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image || ''
          })),
          shippingAddress: orderSummary.checkoutFormData || {},
          subtotal: orderSummary.subtotal,
          discount: orderSummary.discount,
          tax: orderSummary.tax,
          total: orderSummary.total,
          paymentStatus: 'Paid'
        };

        console.log('Creating backend order with payload:', JSON.stringify(orderPayload, null, 2));
        const response = await api.post('/orders/', orderPayload);
        console.log('Backend order created:', response.data);
        return response.data.id;
      } catch (error) {
        console.error('Error creating backend order:', error);
        console.error('Error response:', error.response?.data);
        // Fallback to local ID if backend fails, so user still sees confirmation
        return `ORD-${Date.now()}-OFFLINE`;
      }
    };

    if (selectedMethod === 'cod') {
      // Direct success for Cash on Delivery
      setPaymentStatus('processing');
      setTimeout(async () => {
        const orderId = await createBackendOrder('Cash on Delivery');

        setPaymentStatus('success');
        setTimeout(() => {
          // Store order data for confirmation page (include earned rewards = 1% of total)
          const orderData = {
            orderId: orderId,
            orderItems: orderSummary.items,
            subtotal: orderSummary.subtotal,
            discount: orderSummary.discount,
            tax: orderSummary.tax,
            total: orderSummary.total,
            paymentMethod: 'Cash on Delivery',
            checkoutFormData: orderSummary.checkoutFormData,
            orderDate: new Date().toISOString(),
            estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            earnedRewards: Math.floor(orderSummary.total * 0.01)
          };
          localStorage.setItem('orderData', JSON.stringify(orderData));
          localStorage.removeItem('craftopiaCart'); // Clear cart after successful order
          window.dispatchEvent(new Event('cartUpdated')); // Notify cart context
          navigate('/customer-order-confirmation');
        }, 2000);
      }, 1500);
      return;
    }

    if (selectedMethod === 'rewards') {
      // Process reward points payment
      setPaymentStatus('processing');
      setTimeout(async () => {
        // Deduct reward points
        const newRewardBalance = customerRewards - orderSummary.total;
        updateRewards(newRewardBalance);

        const orderId = await createBackendOrder('Reward Points');

        setPaymentStatus('success');
        setTimeout(() => {
          // Store order data for confirmation page
          const orderData = {
            orderId: orderId,
            orderItems: orderSummary.items,
            subtotal: orderSummary.subtotal,
            discount: orderSummary.discount,
            tax: orderSummary.tax,
            total: orderSummary.total,
            paymentMethod: 'Reward Points',
            checkoutFormData: orderSummary.checkoutFormData,
            orderDate: new Date().toISOString(),
            estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            earnedRewards: Math.floor(orderSummary.total * 0.01) // 1% cashback
          };
          localStorage.setItem('orderData', JSON.stringify(orderData));
          localStorage.removeItem('craftopiaCart'); // Clear cart after successful order
          window.dispatchEvent(new Event('cartUpdated')); // Notify cart context
          navigate('/customer-order-confirmation');
        }, 2000);
      }, 1500);
      return;
    }

    // For other payment methods, simulate processing
    setPaymentStatus('processing');

    // Simulate API call to payment gateway
    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate random success/failure for demo
          const isSuccess = Math.random() > 0.2; // 80% success rate
          if (isSuccess) {
            resolve();
          } else {
            reject(new Error('Payment declined by bank'));
          }
        }, 2000);
      });

      const orderId = await createBackendOrder(selectedMethod === 'card' ? 'Credit/Debit Card' : selectedMethod === 'wallet' ? 'Mobile Wallet' : 'Bank Transfer');

      setPaymentStatus('success');
      setTimeout(() => {
        // Store order data for confirmation page
        const orderData = {
          orderId: orderId,
          orderItems: orderSummary.items,
          subtotal: orderSummary.subtotal,
          discount: orderSummary.discount,
          tax: orderSummary.tax,
          total: orderSummary.total,
          paymentMethod: selectedMethod === 'card' ? 'Credit/Debit Card' : selectedMethod === 'wallet' ? 'Mobile Wallet' : 'Bank Transfer',
          checkoutFormData: orderSummary.checkoutFormData,
          orderDate: new Date().toISOString(),
          estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          earnedRewards: Math.floor(orderSummary.total * 0.01) // 1% cashback
        };
        localStorage.setItem('orderData', JSON.stringify(orderData));
        localStorage.removeItem('craftopiaCart'); // Clear cart after successful order
        window.dispatchEvent(new Event('cartUpdated')); // Notify cart context
        navigate('/customer-order-confirmation');
      }, 2000);
    } catch (error) {
      setPaymentStatus('failed');
    }
  };

  const handleCancelPayment = () => {
    navigate('/customer-checkout');
  };

  const handleBackToCheckout = () => {
    navigate('/customer-checkout');
  };

  const renderPaymentForm = () => {
    if (selectedMethod === 'card') {
      return (
        <div className="card-payment-form">
          <div className="form-group">
            <label htmlFor="cardholderName">Cardholder Name *</label>
            <input
              type="text"
              id="cardholderName"
              name="cardholderName"
              placeholder="John Doe"
              value={cardDetails.cardholderName}
              onChange={handleCardInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cardNumber">Card Number *</label>
            <div className="input-with-icon">
              <FiCreditCard className="input-icon" />
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.cardNumber}
                onChange={handleCardInputChange}
                maxLength="19"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expiryDate">Expiry Date *</label>
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                placeholder="MM/YY"
                value={cardDetails.expiryDate}
                onChange={handleCardInputChange}
                maxLength="5"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cvv">CVV *</label>
              <div className="input-with-icon">
                <FiLock className="input-icon" />
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  placeholder="123"
                  value={cardDetails.cvv}
                  onChange={handleCardInputChange}
                  maxLength="3"
                  required
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (selectedMethod === 'cod') {
      return (
        <div className="cod-info">
          <div className="cod-icon">
            <FiTruck />
          </div>
          <h3>Cash on Delivery</h3>
          <p>Pay with cash when your order is delivered to your doorstep.</p>
          <div className="cod-features">
            <div className="feature">
              <FiCheck />
              <span>No upfront payment required</span>
            </div>
            <div className="feature">
              <FiCheck />
              <span>Pay when you receive items</span>
            </div>
            <div className="feature">
              <FiCheck />
              <span>100% secure and reliable</span>
            </div>
          </div>
        </div>
      );
    }

    if (selectedMethod === 'rewards') {
      return (
        <div className="rewards-info">
          <div className="rewards-icon1">
            <FiAward />
          </div>
          <h3>Use Reward Points</h3>
          <div className="rewards-balance">
            <div className="balance-item">
              <span>Available Reward Points:</span>
              <strong>{customerRewards.toLocaleString()} points</strong>
            </div>
            <div className="balance-item">
              <span>Order Total:</span>
              <strong>{orderSummary.total.toLocaleString()} points</strong>
            </div>
            <div className="balance-divider"></div>
            <div className="balance-item remaining">
              <span>Remaining Points:</span>
              <strong>{remainingRewards.toLocaleString()} points</strong>
            </div>
          </div>
          <div className="rewards-features">
            <div className="feature">
              <FiCheck />
              <span>Instant payment processing</span>
            </div>
            <div className="feature">
              <FiCheck />
              <span>No additional forms required</span>
            </div>
            <div className="feature">
              <FiCheck />
              <span>Points will be deducted immediately</span>
            </div>
          </div>
          {!canUseRewards && (
            <div className="rewards-warning">
              <FiStar />
              <p>You need {orderSummary.total - customerRewards} more points to use this payment method.</p>
            </div>
          )}
        </div>
      );
    }

    if (selectedMethod === 'wallet') {
      return (
        <div className="wallet-info">
          <div className="wallet-icon">
            <FiSmartphone />
          </div>
          <h3>Mobile Wallet</h3>
          <p>Coming soon! We're working on integrating mobile wallet payments.</p>
        </div>
      );
    }

    if (selectedMethod === 'bank') {
      return (
        <div className="bank-info">
          <div className="bank-icon">
            <FiDollarSign />
          </div>
          <h3>Bank Transfer</h3>
          <p>Coming soon! Direct bank transfer option will be available shortly.</p>
        </div>
      );
    }
  };

  // Calculate display total based on payment method
  const getDisplayTotal = () => {
    if (selectedMethod === 'rewards' && canUseRewards) {
      return 0;
    }
    return orderSummary.total;
  };

  const displayTotal = getDisplayTotal();

  return (
    <div className="payment-page">
      <Navbar />

      <div className="payment-container">
        {/* Header Section */}
        <div className="payment-header">
          <button className="back-button" onClick={handleBackToCheckout}>
            <FiArrowLeft />
            Back to Checkout
          </button>
          <div className="header-content">
            <h1>Make Payment</h1>
            <p>Complete your purchase securely</p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="progress-indicator">
          <div className="progress-step completed">
            <div className="step-icon">
              <FiTruck />
            </div>
            <span className="step-label">Shipping</span>
          </div>
          <div className="progress-line completed"></div>
          <div className="progress-step active">
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

        <div className="payment-content">
          {/* Left Section - Payment Methods & Form */}
          <div className="payment-left">
            <form className="payment-form" onSubmit={handlePaymentSubmit}>
              {/* Payment Methods */}
              <div className="payment-methods">
                <h3>Select Payment Method</h3>
                <div className="methods-grid">
                  {paymentMethods.map(method => (
                    <div
                      key={method.id}
                      className={`method-card ${selectedMethod === method.id ? 'selected' : ''} ${method.disabled ? 'disabled' : ''
                        }`}
                      onClick={() => !method.disabled && setSelectedMethod(method.id)}
                    >
                      <div className="method-icon">
                        {method.icon}
                      </div>
                      <div className="method-info">
                        <h4>{method.name}</h4>
                        <p>{method.description}</p>
                        {method.disabled && (
                          <div className="disabled-message">
                            Insufficient reward points
                          </div>
                        )}
                      </div>
                      <div className="method-radio">
                        <div className={`radio-dot ${selectedMethod === method.id ? 'active' : ''}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Form */}
              <div className="payment-form-section">
                <div className="form-header">
                  <FiShield className="form-icon" />
                  <h3>
                    {selectedMethod === 'card' && 'Card Details'}
                    {selectedMethod === 'cod' && 'Cash on Delivery'}
                    {selectedMethod === 'rewards' && 'Use Reward Points'}
                    {selectedMethod === 'wallet' && 'Mobile Wallet'}
                    {selectedMethod === 'bank' && 'Bank Transfer'}
                  </h3>
                </div>
                {renderPaymentForm()}
              </div>

              {/* Payment Actions */}
              <div className="payment-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleCancelPayment}
                  disabled={paymentStatus === 'processing'}
                >
                  Cancel Payment
                </button>
                <button
                  type="submit"
                  className="pay-button"
                  disabled={paymentStatus === 'processing' || (selectedMethod === 'rewards' && !canUseRewards)}
                >
                  {paymentStatus === 'processing' ? (
                    <>
                      <div className="loading-spinner"></div>
                      Processing...
                    </>
                  ) : selectedMethod === 'rewards' ? (
                    `Pay with ${orderSummary.total.toLocaleString()} Points`
                  ) : (
                    `Pay ${formatPrice(displayTotal)}`
                  )}
                </button>
              </div>

              {/* Payment Status Messages */}
              {paymentStatus === 'failed' && (
                <div className="payment-status error">
                  <p>Payment failed. Please check your details and try again.</p>
                  <button
                    className="retry-button"
                    onClick={() => setPaymentStatus('idle')}
                  >
                    Try Again
                  </button>
                </div>
              )}

              {paymentStatus === 'success' && (
                <div className="payment-status success">
                  <FiCheck className="status-icon" />
                  <p>
                    {selectedMethod === 'rewards'
                      ? 'Payment successful with reward points! Redirecting...'
                      : 'Payment successful! Redirecting to confirmation...'
                    }
                  </p>
                </div>
              )}

              {/* Security Notice */}
              <div className="security-notice">
                <FiShield />
                <span>Your payment information is secure and encrypted</span>
              </div>
            </form>
          </div>

          {/* Right Section - Order Summary */}
          <div className="payment-right">
            <div className="order-summary">
              <h3>Order Summary</h3>

              <div className="order-items">
                {orderSummary.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-info">
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
                  <span>{formatPrice(orderSummary.subtotal)}</span>
                </div>
                <div className="price-row discount1">
                  <span>Discount (10%):</span>
                  <span>-{formatPrice(orderSummary.discount)}</span>
                </div>
                <div className="price-row shipping">
                  <span>Shipping:</span>
                  <span>FREE</span>
                </div>
                <div className="price-row">
                  <span>Tax (5%):</span>
                  <span>{formatPrice(orderSummary.tax)}</span>
                </div>

                {/* Reward Points Payment Line */}
                {selectedMethod === 'rewards' && canUseRewards && (
                  <>
                    <div className="summary-divider"></div>
                    <div className="price-row rewards-payment">
                      <span>Paid with Reward Points:</span>
                      <span>-{formatPrice(orderSummary.total)}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="summary-divider"></div>

              <div className="total-row">
                <span>Total Amount</span>
                <span>
                  {selectedMethod === 'rewards' && canUseRewards ? (
                    <span className="free">FREE</span>
                  ) : (
                    formatPrice(displayTotal)
                  )}
                </span>
              </div>

              {/* Reward Points Info */}
              {selectedMethod === 'rewards' && (
                <div className="rewards-summary">
                  <div className="rewards-breakdown">
                    <div className="reward-item">
                      <span>Current Points:</span>
                      <strong>{customerRewards.toLocaleString()}</strong>
                    </div>
                    <div className="reward-item">
                      <span>Points Used:</span>
                      <strong>-{orderSummary.total.toLocaleString()}</strong>
                    </div>
                    <div className="reward-item remaining">
                      <span>Remaining Points:</span>
                      <strong>{remainingRewards.toLocaleString()}</strong>
                    </div>
                  </div>
                </div>
              )}

              <div className="delivery-info">
                <h4>Delivery Information</h4>
                <p>John Doe</p>
                <p>123 Main Street, Lahore, Punjab 54000</p>
                <p>+92-300-1234567</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CustomerMakePayment;