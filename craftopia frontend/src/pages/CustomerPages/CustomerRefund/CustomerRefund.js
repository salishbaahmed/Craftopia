// CustomerRefund.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiFileText, FiCheck, FiInfo, FiArrowLeft, FiPackage, FiCalendar } from 'react-icons/fi';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';
import './CustomerRefund.css';

const CustomerRefund = () => {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedReason, setSelectedReason] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Eligible products will be loaded from orderHistory (localStorage)
  const [eligibleProducts, setEligibleProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadEligibleProducts = () => {
    try {
      const raw = localStorage.getItem('orderHistory');
      if (!raw) {
        setEligibleProducts([]);
        setIsLoading(false);
        return;
      }

      const orders = JSON.parse(raw || '[]');
      const products = [];
      const now = new Date();

      orders.forEach((order) => {
        // determine delivered date: prefer explicit deliveredDate, otherwise use estimatedDelivery
        const deliveredDateStr = order.deliveredDate || order.estimatedDelivery || order.orderDate;
        const deliveredDate = deliveredDateStr ? new Date(deliveredDateStr) : null;

        // consider delivered if deliveredDate exists and is <= today
        if (!deliveredDate || deliveredDate > now) return;

        // only include items delivered within last 30 days
        const daysSinceDelivery = Math.floor((now - deliveredDate) / (1000 * 60 * 60 * 24));
        if (daysSinceDelivery > 30) return;

        if (Array.isArray(order.orderItems)) {
          order.orderItems.forEach((item, idx) => {
            products.push({
              id: `${order.orderId}-${idx}`,
              name: item.name,
              quantity: item.quantity || 1,
              price: item.price || 0,
              orderId: order.orderId,
              orderDate: order.orderDate,
              deliveryDate: deliveredDate.toISOString(),
              image: item.image || '',
              category: item.category || item.categoryName || 'Craftopia Product',
              status: order.status || 'delivered'
            });
          });
        }
      });

      setEligibleProducts(products);
    } catch (err) {
      console.error('Error loading eligible products from orderHistory:', err);
      setEligibleProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEligibleProducts();
    const onOrderPlaced = () => loadEligibleProducts();
    window.addEventListener('orderPlaced', onOrderPlaced);
    return () => window.removeEventListener('orderPlaced', onOrderPlaced);
  }, []);

  const refundReasons = [
    'Damaged Item',
    'Wrong Item Received',
    'Doesn\'t Match Description',
    'Changed My Mind',
    'Found Better Price',
    'Quality Issue',
    'Other'
  ];

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setSelectedReason('');
    setAdditionalDetails('');
  };

  const handleBackToProducts = () => {
    setSelectedProduct(null);
    setSelectedReason('');
    setAdditionalDetails('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedReason) {
      alert('Please select a reason for refund.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Refund request submitted:', {
        product: selectedProduct,
        reason: selectedReason,
        details: additionalDetails
      });

      // Persist refund request locally so user can see history
      try {
        const existing = JSON.parse(localStorage.getItem('refundRequests') || '[]');
        const refundRequest = {
          id: Date.now(),
          orderId: selectedProduct.orderId,
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          reason: selectedReason,
          details: additionalDetails,
          requestedAt: new Date().toISOString(),
          status: 'pending'
        };
        existing.unshift(refundRequest);
        localStorage.setItem('refundRequests', JSON.stringify(existing));
        // notify other parts of app
        window.dispatchEvent(new Event('refundRequested'));
      } catch (err) {
        console.error('Error saving refund request:', err);
      }

      alert('Refund request submitted successfully!');
      navigate('/customer-orders');
    } catch (error) {
      console.error('Error submitting refund request:', error);
      alert('Failed to submit refund request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/customer-orders');
  };

  const formatCurrency = (amount) => {
    return `RS.${amount.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Product Selection View
  if (isLoading && !selectedProduct) {
    return (
      <div className="customerrefund">
        <Navbar />
        <div className="customerrefund-container">
          <div className="customerrefund-loading">
            <div className="customerrefund-spinner"></div>
            <p>Loading eligible products...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <div className="customerrefund">
        <Navbar />
        
        <div className="customerrefund-container">
          <div className="customerrefund-content">
            {/* Header Section */}
            <div className="customerrefund-header">
              <button 
                className="customerrefund-back-btn"
                onClick={handleCancel}
                type="button"
              >
                <FiArrowLeft /> Back to Orders
              </button>
              <div className="customerrefund-header-content">
                <div className="customerrefund-header-icon">
                  <FiFileText />
                </div>
                <h1 className="customerrefund-title">Request a Refund</h1>
                <p className="customerrefund-subtitle">
                  Select a product to start your refund process
                </p>
              </div>
            </div>

            {/* Eligible Products Section */}
            <div className="customerrefund-products-section">
              <div className="customerrefund-section-header">
                <h2 className="customerrefund-section-title">Eligible Products</h2>
                <p className="customerrefund-section-subtitle">
                  Products delivered within the last 30 days that are eligible for refund
                </p>
              </div>

              <div className="customerrefund-products-grid">
                {eligibleProducts.map((product) => (
                  <div 
                    key={product.id}
                    className="customerrefund-product-card"
                    onClick={() => handleProductSelect(product)}
                  >
                    <div className="customerrefund-product-image">
                      <div className="customerrefund-image-placeholder">
                        <FiPackage />
                      </div>
                    </div>
                    <div className="customerrefund-product-info">
                      <h3 className="customerrefund-product-name">{product.name}</h3>
                      <p className="customerrefund-product-category">{product.category}</p>
                      <div className="customerrefund-product-meta">
                        <span className="customerrefund-product-quantity">Qty: {product.quantity}</span>
                        <span className="customerrefund-product-price">{formatCurrency(product.price)}</span>
                      </div>
                      <div className="customerrefund-product-order">
                        <FiCalendar className="customerrefund-calendar-icon" />
                        <span>Order #{product.orderId} • Delivered {formatDate(product.deliveryDate)}</span>
                      </div>
                    </div>
                    <div className="customerrefund-product-eligibility">
                      <span className="customerrefund-eligible-tag">
                        <FiCheck /> Eligible for Refund
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {eligibleProducts.length === 0 && (
                <div className="customerrefund-no-products">
                  <p>No products are currently eligible for refund.</p>
                  <p>Products must be delivered within the last 30 days to be eligible.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Refund Form View
  return (
    <div className="customerrefund">
      <Navbar />
      
      <div className="customerrefund-container">
        <div className="customerrefund-content">
          {/* Header Section */}
          <div className="customerrefund-header">
            <button 
              className="customerrefund-back-btn"
              onClick={handleBackToProducts}
              type="button"
            >
              <FiArrowLeft /> Back to Products
            </button>
            <div className="customerrefund-header-content">
              <div className="customerrefund-header-icon">
                <FiFileText />
              </div>
              <h1 className="customerrefund-title">Request a Refund</h1>
              <p className="customerrefund-subtitle">
                Tell us why you'd like to return this item
              </p>
            </div>
          </div>

          {/* Selected Product Card */}
          <div className="customerrefund-selected-product">
            <div className="customerrefund-product-card selected">
              <div className="customerrefund-product-image">
                <div className="customerrefund-image-placeholder">
                  <FiPackage />
                </div>
              </div>
              <div className="customerrefund-product-info">
                <h3 className="customerrefund-product-name">{selectedProduct.name}</h3>
                <p className="customerrefund-product-category">{selectedProduct.category}</p>
                <div className="customerrefund-product-meta">
                  <span className="customerrefund-product-quantity">Qty: {selectedProduct.quantity}</span>
                  <span className="customerrefund-product-price">{formatCurrency(selectedProduct.price)}</span>
                </div>
                <div className="customerrefund-product-order">
                  <FiCalendar className="customerrefund-calendar-icon" />
                  <span>Order #{selectedProduct.orderId} • Delivered {formatDate(selectedProduct.deliveryDate)}</span>
                </div>
              </div>
              <div className="customerrefund-product-eligibility">
                <span className="customerrefund-eligible-tag">
                  <FiCheck /> Eligible for Refund
                </span>
              </div>
            </div>
          </div>

          {/* Refund Form */}
          <form onSubmit={handleSubmit} className="customerrefund-form">
            {/* Reason for Refund Section */}
            <div className="customerrefund-form-section">
              <label htmlFor="refund-reason" className="customerrefund-form-label">
                Reason for Refund <span className="customerrefund-required">*</span>
              </label>
              <select
                id="refund-reason"
                className="customerrefund-select"
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                required
              >
                <option value="">Select a reason</option>
                {refundReasons.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
            </div>

            {/* Additional Details Section */}
            <div className="customerrefund-form-section">
              <label htmlFor="additional-details" className="customerrefund-form-label">
                Additional Details
              </label>
              <textarea
                id="additional-details"
                className="customerrefund-textarea"
                placeholder="Please provide any additional information that would help us process your request..."
                value={additionalDetails}
                onChange={(e) => setAdditionalDetails(e.target.value)}
                rows="5"
                maxLength="500"
              />
              <div className="customerrefund-character-counter">
                {additionalDetails.length} characters
              </div>
            </div>

            {/* Refund Summary Card */}
            <div className="customerrefund-summary-card">
              <h3 className="customerrefund-summary-title">Refund Summary</h3>
              <div className="customerrefund-summary-row">
                <span className="customerrefund-summary-label">Estimated Refund Amount</span>
                <span className="customerrefund-summary-value">
                  {formatCurrency(selectedProduct.price * selectedProduct.quantity)}
                </span>
              </div>
              <div className="customerrefund-summary-info">
                <FiInfo className="customerrefund-info-icon" />
                <span>Refund will be processed to your original payment method within 5-7 business days.</span>
              </div>
            </div>

            {/* Important Information Box */}
            <div className="customerrefund-important-info">
              <h4 className="customerrefund-important-title">Important Information</h4>
              <ul className="customerrefund-important-list">
                <li>Items must be returned within 30 days of delivery</li>
                <li>Products should be unused and in original packaging</li>
                <li>Refunds are processed within 5-7 business days of approval</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="customerrefund-form-actions">
              <button
                type="button"
                className="customerrefund-cancel-btn"
                onClick={handleBackToProducts}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="customerrefund-submit-btn"
                disabled={isSubmitting || !selectedReason}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CustomerRefund;