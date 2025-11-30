import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';
import './CustomerSendGift.css';
import { FiGift, FiMessageSquare, FiPackage, FiCheck, FiArrowLeft, FiShoppingCart } from 'react-icons/fi';

// Import images for wrapping papers


const CustomerSendGift = () => {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [giftOptions, setGiftOptions] = useState({
    wrappingPaper: '',
    giftCard: '',
    giftMessage: '',
    recipientName: '',
    recipientEmail: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCartNotification, setShowCartNotification] = useState(false);

  // Available gift options
  const wrappingPapers = [
    { id: 'floral', name: 'Floral Pattern', price: 200, image: '/wrappingpapers/Flower.png' },
    { id: 'geometric', name: 'Geometric Design', price: 150, image: '/wrappingpapers/geometric.png' },
    { id: 'classic-dots', name: 'Classic Dots', price: 180, image: '/wrappingpapers/dots.png' },
    { id: 'festive-red', name: 'Festive Red', price: 220, image: '/wrappingpapers/red.png' },
    { id: 'sparkle', name: 'Sparkle Gold', price: 300, image: '/wrappingpapers/gold.png' },
    { id: 'elegant', name: 'Elegant White', price: 250, image: '/wrappingpapers/white.png' },
    { id: 'none', name: 'No Wrapping', price: 0, image: null }
  ];

  const giftCards = [
    { id: 'birthday', name: 'Birthday Card', price: 100, image: '/giftcards/birthday.png' },
    { id: 'anniversary', name: 'Anniversary Card', price: 120, image: '/giftcards/anniversary.png' },
    { id: 'congratulations', name: 'Congratulations Card', price: 110, image: '/giftcards/congratulations.png' },
    { id: 'general-greeting', name: 'General Greeting Card', price: 90, image: '/giftcards/greeting.png' },
    { id: 'thank-you', name: 'Thank You Card', price: 100, image: '/giftcards/thankyou.png' },
    { id: 'classic', name: 'Classic White Card', price: 80, image: '/giftcards/white.png' },
    { id: 'none', name: 'No Gift Card', price: 0, image: null }
  ];

  // Load selected product from localStorage
  useEffect(() => {
    const savedProduct = localStorage.getItem('selectedGiftProduct');
    if (savedProduct) {
      setSelectedProduct(JSON.parse(savedProduct));
    } else {
      // Redirect back if no product selected
      navigate('/customer');
    }
  }, [navigate]);

  // Calculate total price
  const calculateTotalPrice = () => {
    if (!selectedProduct) return 0;

    const wrappingPrice = wrappingPapers.find(wp => wp.id === giftOptions.wrappingPaper)?.price || 0;
    const cardPrice = giftCards.find(gc => gc.id === giftOptions.giftCard)?.price || 0;

    return selectedProduct.price + wrappingPrice + cardPrice;
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setGiftOptions(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!giftOptions.recipientName.trim()) {
      newErrors.recipientName = 'Recipient name is required';
    }

    if (!giftOptions.recipientEmail.trim()) {
      newErrors.recipientEmail = 'Recipient email is required';
    } else if (!/\S+@\S+\.\S+/.test(giftOptions.recipientEmail)) {
      newErrors.recipientEmail = 'Email is invalid';
    }

    if (!giftOptions.giftMessage.trim()) {
      newErrors.giftMessage = 'Gift message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle gift submission
  const handleSubmitGift = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create gift order object
      const giftOrder = {
        product: selectedProduct,
        giftOptions: {
          ...giftOptions,
          wrappingPaper: wrappingPapers.find(wp => wp.id === giftOptions.wrappingPaper),
          giftCard: giftCards.find(gc => gc.id === giftOptions.giftCard)
        },
        totalPrice: calculateTotalPrice(),
        orderDate: new Date().toISOString(),
        orderId: `GIFT-${Date.now()}`
      };

      // Save to localStorage (simulating backend storage)
      const existingGiftOrders = JSON.parse(localStorage.getItem('giftOrders') || '[]');
      localStorage.setItem('giftOrders', JSON.stringify([...existingGiftOrders, giftOrder]));

      // Add to cart - structure it to match regular product format for display
      const existingCart = JSON.parse(localStorage.getItem('craftopiaCart') || '[]');
      const wrappingPaper = wrappingPapers.find(wp => wp.id === giftOptions.wrappingPaper);
      const giftCard = giftCards.find(gc => gc.id === giftOptions.giftCard);

      const cartItem = {
        id: Date.now(), // Unique ID for this cart item
        name: `${selectedProduct.name} (Gift)`,
        category: selectedProduct.category,
        description: selectedProduct.description || '',
        price: calculateTotalPrice(), // Total price including wrapping and card
        quantity: 1,
        type: 'gift',
        image: selectedProduct.image || '/images/placeholder.png',
        originalPrice: selectedProduct.originalPrice || null,
        // Store gift details for reference
        giftDetails: {
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          productPrice: selectedProduct.price,
          recipientName: giftOptions.recipientName,
          recipientEmail: giftOptions.recipientEmail,
          giftMessage: giftOptions.giftMessage,
          wrappingPaper: wrappingPaper ? wrappingPaper.name : 'None',
          wrappingPrice: wrappingPaper ? wrappingPaper.price : 0,
          giftCard: giftCard ? giftCard.name : 'None',
          giftCardPrice: giftCard ? giftCard.price : 0,
          orderId: giftOrder.orderId
        }
      };

      localStorage.setItem('craftopiaCart', JSON.stringify([...existingCart, cartItem]));

      // Trigger cart update event
      window.dispatchEvent(new Event('cartUpdated'));

      // Show cart notification
      setShowCartNotification(true);
      setTimeout(() => setShowCartNotification(false), 3000);

      setShowSuccess(true);
      setTimeout(() => {
        navigate('/customer-cart');
      }, 3000);

    } catch (error) {
      console.error('Error submitting gift order:', error);
      alert('There was an error processing your gift order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Your gift selections will be lost.')) {
      navigate('/customer');
    }
  };

  if (!selectedProduct) {
    return (
      <div className="sendgift-page">
        <Navbar />
        <div className="sendgift-loading-container">
          <p>Loading product details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="sendgift-page">
        <Navbar />
        <div className="sendgift-success-container">
          <div className="sendgift-success-icon">
            <FiCheck />
          </div>
          <h2>Gift Order Successful!</h2>
          <p>Your gift has been added to the cart.</p>
          <p>Redirecting to cart...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="sendgift-page">
      <Navbar />

      {/* Cart Notification */}
      {showCartNotification && (
        <div className="sendgift-cart-notification">
          <FiShoppingCart className="sendgift-notification-icon" />
          <span>Gift added to cart!</span>
        </div>
      )}

      <main className="sendgift-main">
        <div className="sendgift-container">
          <div className="sendgift-header">
            <button
              className="sendgift-back-button"
              onClick={() => navigate('/customer')}
            >
              <FiArrowLeft />
              Back to Products
            </button>
            <h1>
              <FiGift className="sendgift-header-icon" />
              Send as Gift
            </h1>
            <p>Make your gift special with personalized options</p>
          </div>

          <div className="sendgift-content">
            {/* Product Summary */}
            <div className="sendgift-product-summary-section">
              <h3>Selected Product</h3>
              <div className="sendgift-product-summary">
                <div className="sendgift-product-image-summary">
                  <div className="sendgift-image-placeholder">
                    {selectedProduct.category}
                  </div>
                </div>
                <div className="sendgift-product-details-summary">
                  <h4>{selectedProduct.name}</h4>
                  <p className="sendgift-product-category">{selectedProduct.category}</p>
                  <p className="sendgift-product-description">{selectedProduct.description}</p>
                  <div className="sendgift-product-price-summary">
                    <span className="sendgift-price">PKR {selectedProduct.price.toLocaleString()}</span>
                    {selectedProduct.originalPrice && (
                      <span className="sendgift-original-price">
                        PKR {selectedProduct.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Gift Options Form */}
            <form className="sendgift-options-form" onSubmit={handleSubmitGift}>
              {/* Recipient Information */}
              <div className="sendgift-form-section">
                <h3>
                  <FiMessageSquare className="sendgift-section-icon" />
                  Recipient Information
                </h3>

                <div className="sendgift-form-row">
                  <div className="sendgift-form-group">
                    <label htmlFor="recipientName">Recipient Name *</label>
                    <input
                      type="text"
                      id="recipientName"
                      value={giftOptions.recipientName}
                      onChange={(e) => handleInputChange('recipientName', e.target.value)}
                      className={errors.recipientName ? 'sendgift-error' : ''}
                      placeholder="Enter recipient's full name"
                    />
                    {errors.recipientName && (
                      <span className="sendgift-error-message">{errors.recipientName}</span>
                    )}
                  </div>

                  <div className="sendgift-form-group">
                    <label htmlFor="recipientEmail">Recipient Email *</label>
                    <input
                      type="email"
                      id="recipientEmail"
                      value={giftOptions.recipientEmail}
                      onChange={(e) => handleInputChange('recipientEmail', e.target.value)}
                      className={errors.recipientEmail ? 'sendgift-error' : ''}
                      placeholder="Enter recipient's email address"
                    />
                    {errors.recipientEmail && (
                      <span className="sendgift-error-message">{errors.recipientEmail}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Wrapping Paper Selection */}
              <div className="sendgift-form-section">
                <h3>
                  <FiPackage className="sendgift-section-icon" />
                  Wrapping Paper
                </h3>
                <p className="sendgift-section-description">Choose how you'd like your gift to be wrapped</p>

                <div className="sendgift-options-grid">
                  {wrappingPapers.map((paper) => (
                    <label key={paper.id} className="sendgift-option-card">
                      <input
                        type="radio"
                        name="wrappingPaper"
                        value={paper.id}
                        checked={giftOptions.wrappingPaper === paper.id}
                        onChange={(e) => handleInputChange('wrappingPaper', e.target.value)}
                      />
                      <div className="sendgift-option-content">
                        <div className="sendgift-option-preview sendgift-wrapping-preview">
                          {paper.image ? (
                            <img
                              src={paper.image}
                              alt={paper.name}
                              className="sendgift-option-image"
                            />
                          ) : (
                            <div className="sendgift-no-image">{paper.name}</div>
                          )}
                        </div>
                        <div className="sendgift-option-details">
                          <span className="sendgift-option-name">{paper.name}</span>
                          <span className="sendgift-option-price">
                            {paper.price > 0 ? `+PKR ${paper.price}` : 'Free'}
                          </span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Gift Card Selection */}
              <div className="sendgift-form-section">
                <h3>
                  <FiGift className="sendgift-section-icon" />
                  Gift Card
                </h3>
                <p className="sendgift-section-description">Select a gift card to include with your present</p>

                <div className="sendgift-options-grid">
                  {giftCards.map((card) => (
                    <label key={card.id} className="sendgift-option-card">
                      <input
                        type="radio"
                        name="giftCard"
                        value={card.id}
                        checked={giftOptions.giftCard === card.id}
                        onChange={(e) => handleInputChange('giftCard', e.target.value)}
                      />
                      <div className="sendgift-option-content">
                        <div className="sendgift-option-preview sendgift-card-preview">
                          {card.image ? (
                            <img
                              src={card.image}
                              alt={card.name}
                              className="sendgift-option-image"
                            />
                          ) : (
                            <div className="sendgift-no-image">{card.name}</div>
                          )}
                        </div>
                        <div className="sendgift-option-details">
                          <span className="sendgift-option-name">{card.name}</span>
                          <span className="sendgift-option-price">
                            {card.price > 0 ? `+PKR ${card.price}` : 'Free'}
                          </span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Gift Message */}
              <div className="sendgift-form-section">
                <h3>
                  <FiMessageSquare className="sendgift-section-icon" />
                  Gift Message
                </h3>
                <div className="sendgift-form-group">
                  <label htmlFor="giftMessage">Personal Message *</label>
                  <textarea
                    id="giftMessage"
                    value={giftOptions.giftMessage}
                    onChange={(e) => handleInputChange('giftMessage', e.target.value)}
                    className={errors.giftMessage ? 'sendgift-error' : ''}
                    placeholder="Write a heartfelt message for the recipient..."
                    rows="4"
                  />
                  {errors.giftMessage && (
                    <span className="sendgift-error-message">{errors.giftMessage}</span>
                  )}
                  <div className="sendgift-character-count">
                    {giftOptions.giftMessage.length}/500 characters
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="sendgift-order-summary-section">
                <h3>Order Summary</h3>
                <div className="sendgift-order-summary">
                  <div className="sendgift-summary-row">
                    <span>Product Price:</span>
                    <span>PKR {selectedProduct.price.toLocaleString()}</span>
                  </div>
                  {giftOptions.wrappingPaper && giftOptions.wrappingPaper !== 'none' && (
                    <div className="sendgift-summary-row">
                      <span>Wrapping Paper:</span>
                      <span>
                        +PKR {wrappingPapers.find(wp => wp.id === giftOptions.wrappingPaper)?.price.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {giftOptions.giftCard && giftOptions.giftCard !== 'none' && (
                    <div className="sendgift-summary-row">
                      <span>Gift Card:</span>
                      <span>
                        +PKR {giftCards.find(gc => gc.id === giftOptions.giftCard)?.price.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="sendgift-summary-divider"></div>
                  <div className="sendgift-summary-row sendgift-total">
                    <span>Total Amount:</span>
                    <span>PKR {calculateTotalPrice().toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="sendgift-form-actions">
                <button
                  type="button"
                  className="sendgift-cancel-button"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="sendgift-submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Adding to Cart...' : 'Add Gift to Cart'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CustomerSendGift;