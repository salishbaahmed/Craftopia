import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiStar, FiArrowLeft, FiCheck } from 'react-icons/fi';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';
import './CustomerProductRating.css';

const CustomerProductRating = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderItem, setOrderItem] = useState(null);

  // Sample order data (same as in CustomerOrders) - memoized to prevent recreation
  const sampleOrders = useMemo(() => ({
    '402-912': {
      id: '402-912',
      date: 'Nov 22, 2025',
      amount: 1245.99,
      status: 'Delivered',
      items: [
        {
          id: 1,
          name: 'Handmade Ceramic Coffee Mug - Teal Blue',
          price: 1245.99,
          quantity: 1,
          image: '/images/mug.jpg',
          category: 'Home & Kitchen'
        }
      ]
    },
    '401-847': {
      id: '401-847',
      date: 'Nov 18, 2025',
      amount: 2382.50,
      status: 'Shipped',
      items: [
        {
          id: 1,
          name: 'Natural Woven Storage Basket',
          price: 1599.99,
          quantity: 1,
          image: '/images/basket.jpg',
          category: 'Home Decor'
        },
        {
          id: 2,
          name: 'Wooden Photo Frame Set',
          price: 782.51,
          quantity: 1,
          image: '/images/frames.jpg',
          category: 'Home Decor'
        }
      ]
    },
    '401-632': {
      id: '401-632',
      date: 'Nov 15, 2025',
      amount: 1027.00,
      status: 'Delivered',
      items: [
        {
          id: 1,
          name: 'Macrame Wall Hanging - Bohemian Style',
          price: 1027.00,
          quantity: 1,
          image: '/images/macrame.jpg',
          category: 'Wall Decor'
        }
      ]
    },
    '400-521': {
      id: '400-521',
      date: 'Nov 10, 2025',
      amount: 1165.75,
      status: 'Processing',
      items: [
        {
          id: 1,
          name: 'Ceramic Dinner Plate Set',
          price: 1165.75,
          quantity: 1,
          image: '/images/plates.jpg',
          category: 'Kitchenware'
        }
      ]
    }
  }), []);

  // Get order and product data from navigation state or URL params
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const orderId = searchParams.get('orderId');
    const productId = searchParams.get('productId');

    // If coming from CustomerOrders with state
    if (location.state?.orderItem) {
      setOrderItem(location.state.orderItem);
    } 
    // If coming via URL parameters
    else if (orderId && productId) {
      const order = sampleOrders[orderId];
      if (order) {
        const item = order.items.find(item => item.id === parseInt(productId));
        if (item) {
          setOrderItem({
            ...item,
            orderId: order.id,
            orderDate: order.date
          });
        }
      }
    }
  }, [location, sampleOrders]);

  // Handle star click for rating
  const handleStarClick = (starValue) => {
    setRating(starValue);
  };

  // Handle star hover for preview
  const handleStarHover = (starValue) => {
    setHoverRating(starValue);
  };

  // Handle star leave
  const handleStarLeave = () => {
    setHoverRating(0);
  };

  // Handle review submission
  const handleSubmitReview = (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Please select a rating before submitting.');
      return;
    }

    // Build feedback record to persist in localStorage so admin can view it
    try {
      const feedbacksRaw = localStorage.getItem('customerFeedbacks');
      const feedbacks = feedbacksRaw ? JSON.parse(feedbacksRaw) : [];

      // Try to pull customer info from checkoutData if available
      let customerName = '';
      let customerEmail = '';
      try {
        const checkoutRaw = localStorage.getItem('checkoutData');
        if (checkoutRaw) {
          const checkout = JSON.parse(checkoutRaw);
          const fd = checkout.formData || {};
          customerName = `${fd.firstName || ''} ${fd.lastName || ''}`.trim();
          customerEmail = fd.email || '';
        }
      } catch (err) {
        // ignore
      }

      const newFeedback = {
        id: `FB-${Date.now()}`,
        customerName: customerName || '',
        customerEmail: customerEmail || '',
        orderId: String(orderItem?.orderId || ''),
        productId: orderItem?.id ?? null,
        product: orderItem?.name || '',
        rating,
        comment: review || '',
        date: new Date().toISOString(),
        status: 'published',
        reply: ''
      };

      feedbacks.push(newFeedback);
      localStorage.setItem('customerFeedbacks', JSON.stringify(feedbacks));

      setIsSubmitted(true);
    } catch (err) {
      console.error('Error saving feedback to localStorage:', err);
      alert('Failed to save feedback locally.');
    }
  };

  // Handle back to orders
  const handleBackToOrders = () => {
    navigate('/customer-orders');
  };

  // Render stars
  const renderStars = () => {
    const stars = [];
    const displayRating = hoverRating || rating;

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <div
          key={i}
          className={`customerproductrating-star ${
            i <= displayRating ? 'customerproductrating-star-filled' : 'customerproductrating-star-empty'
          }`}
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => handleStarHover(i)}
          onMouseLeave={handleStarLeave}
        >
          <FiStar />
        </div>
      );
    }

    return stars;
  };

  if (!orderItem) {
    return (
      <div className="customerproductrating">
        <Navbar />
        <div className="customerproductrating-container">
          <div className="customerproductrating-error">
            <h2>Product Not Found</h2>
            <p>Unable to find the product to rate. Please go back to your orders and try again.</p>
            <button 
              className="customerproductrating-back-btn"
              onClick={handleBackToOrders}
            >
              <FiArrowLeft /> Back to Orders
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="customerproductrating">
      <Navbar />
      
      <div className="customerproductrating-container">
        {/* Page Header */}
        <div className="customerproductrating-header">
          <button 
            className="customerproductrating-back-btn"
            onClick={handleBackToOrders}
          >
            <FiArrowLeft /> Back to Orders
          </button>
          <h1 className="customerproductrating-page-title">Rate Product</h1>
          <p className="customerproductrating-page-subtitle">
            Share your experience with this product
          </p>
        </div>

        {/* Product Information */}
        <div className="customerproductrating-product-card">
          <div className="customerproductrating-product-header">
            <h2 className="customerproductrating-product-title">Product Details</h2>
            <span className="customerproductrating-order-info">
              Order #{orderItem.orderId} • {orderItem.orderDate}
            </span>
          </div>
          
          <div className="customerproductrating-product-content">
            <div className="customerproductrating-product-image">
              <div className="customerproductrating-image-placeholder">
                <FiStar />
              </div>
            </div>
            <div className="customerproductrating-product-details">
              <h3 className="customerproductrating-product-name">{orderItem.name}</h3>
              <p className="customerproductrating-product-category">{orderItem.category}</p>
              <div className="customerproductrating-product-meta">
                <span className="customerproductrating-product-price">
                  RS.{orderItem.price.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="customerproductrating-product-quantity">Quantity: {orderItem.quantity}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rating Form */}
        {!isSubmitted ? (
          <div className="customerproductrating-form-card">
            <form onSubmit={handleSubmitReview} className="customerproductrating-form">
              {/* Star Rating */}
              <div className="customerproductrating-rating-section">
                <h3 className="customerproductrating-section-title">
                  How would you rate this product?
                </h3>
                <div className="customerproductrating-stars-container">
                  <div className="customerproductrating-stars">
                    {renderStars()}
                  </div>
                  <div className="customerproductrating-rating-text">
                    {rating > 0 ? (
                      <span className="customerproductrating-rating-value">
                        {rating} {rating === 1 ? 'star' : 'stars'}
                      </span>
                    ) : (
                      <span className="customerproductrating-rating-placeholder">
                        Tap to rate
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Review Description */}
              <div className="customerproductrating-review-section">
                <label htmlFor="review" className="customerproductrating-review-label">
                  Share your experience (optional)
                </label>
                <textarea
                  id="review"
                  className="customerproductrating-review-textarea"
                  placeholder="Tell us what you liked about this product, how you're using it, or any suggestions for improvement..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  rows="6"
                />
                <div className="customerproductrating-review-counter">
                  {review.length}/500 characters
                </div>
              </div>

              {/* Form Actions */}
              <div className="customerproductrating-form-actions">
                <button 
                  type="button"
                  className="customerproductrating-cancel-btn"
                  onClick={handleBackToOrders}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="customerproductrating-submit-btn"
                  disabled={rating === 0}
                >
                  Submit Rating
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Success Message */
          <div className="customerproductrating-success-card">
            <div className="customerproductrating-success-icon">
              <FiCheck />
            </div>
            <h2 className="customerproductrating-success-title">Thank You!</h2>
            <p className="customerproductrating-success-message">
              Your rating has been submitted successfully. Your feedback helps other customers make better purchasing decisions.
            </p>
            <div className="customerproductrating-success-actions">
              <button 
                className="customerproductrating-back-to-orders-btn"
                onClick={handleBackToOrders}
              >
                Back to Orders
              </button>
              <button 
                className="customerproductrating-continue-shopping-btn"
                onClick={() => navigate('/')}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}

        {/* Rating Guidelines */}
        <div className="customerproductrating-guidelines">
          <h3 className="customerproductrating-guidelines-title">Rating Guidelines</h3>
          <div className="customerproductrating-guidelines-list">
            <div className="customerproductrating-guideline">
              <span className="customerproductrating-guideline-star">★</span>
              <span>1 Star: Poor - Product did not meet expectations</span>
            </div>
            <div className="customerproductrating-guideline">
              <span className="customerproductrating-guideline-star">★★</span>
              <span>2 Stars: Fair - Product needs improvement</span>
            </div>
            <div className="customerproductrating-guideline">
              <span className="customerproductrating-guideline-star">★★★</span>
              <span>3 Stars: Good - Product met basic expectations</span>
            </div>
            <div className="customerproductrating-guideline">
              <span className="customerproductrating-guideline-star">★★★★</span>
              <span>4 Stars: Very Good - Product exceeded expectations</span>
            </div>
            <div className="customerproductrating-guideline">
              <span className="customerproductrating-guideline-star">★★★★★</span>
              <span>5 Stars: Excellent - Product far exceeded expectations</span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CustomerProductRating;