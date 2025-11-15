import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminCustomerFeedback.css';
import { 
  FiHome, FiPlus, FiEdit, FiTrash2, FiEye,
  FiPackage, FiTruck, FiMessageCircle, FiBarChart2,
  FiSearch, FiStar, FiUser, FiCalendar, FiFilter
} from 'react-icons/fi';

const AdminCustomerFeedback = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [feedbacks, setFeedbacks] = useState([
    {
      id: 'FB-1001',
      customerName: 'Ali Raza',
      customerEmail: 'ali.raza@email.com',
      orderId: 'ORD-1001',
      rating: 5,
      comment: 'Excellent quality and fast delivery! The handmade ceramic vase exceeded my expectations. Will definitely order again.',
      date: '2024-03-20',
      status: 'published',
      product: 'Handmade Ceramic Vase',
      reply: ''
    },
    {
      id: 'FB-1002',
      customerName: 'Fatima Noor',
      customerEmail: 'fatima.noor@email.com',
      orderId: 'ORD-1002',
      rating: 4,
      comment: 'Beautiful product but delivery was slightly delayed. The embroidered shawl is exactly as shown in pictures.',
      date: '2024-03-18',
      status: 'published',
      product: 'Embroidered Shawl',
      reply: ''
    },
    {
      id: 'FB-1003',
      customerName: 'Bilal Ahmad',
      customerEmail: 'bilal.ahmad@email.com',
      orderId: 'ORD-1003',
      rating: 3,
      comment: 'Product quality is good but packaging could be better. The wooden jewelry box had minor scratches.',
      date: '2024-03-15',
      status: 'published',
      product: 'Wooden Jewelry Box',
      reply: ''
    },
    {
      id: 'FB-1004',
      customerName: 'Zainab Khan',
      customerEmail: 'zainab.khan@email.com',
      orderId: 'ORD-1004',
      rating: 5,
      comment: 'Absolutely love my purchase! The wool scarf is so warm and the colors are vibrant. Great customer service!',
      date: '2024-03-12',
      status: 'published',
      product: 'Wool Scarf',
      reply: ''
    },
    {
      id: 'FB-1005',
      customerName: 'Omar Farooq',
      customerEmail: 'omar.farooq@email.com',
      orderId: 'ORD-1005',
      rating: 2,
      comment: 'Disappointed with the product quality. The resin art table arrived with cracks. Waiting for replacement.',
      date: '2024-03-10',
      status: 'pending',
      product: 'Resin Art Table',
      reply: ''
    },
    {
      id: 'FB-1006',
      customerName: 'Sara Ahmed',
      customerEmail: 'sara.ahmed@email.com',
      orderId: 'ORD-1006',
      rating: 4,
      comment: 'Good overall experience. The leather wallet is genuine and well-crafted. Delivery was on time.',
      date: '2024-03-08',
      status: 'published',
      product: 'Leather Wallet',
      reply: ''
    }
  ]);

  const handleLogout = () => navigate('/admin-login');

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = 
      feedback.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.comment.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRating = ratingFilter === 'all' || feedback.rating.toString() === ratingFilter;
    
    return matchesSearch && matchesRating;
  });

  const renderStars = (rating) => (
    <div className="stars-container">
      {[1, 2, 3, 4, 5].map(star => (
        <FiStar key={star} className={`star ${star <= rating ? 'filled' : 'empty'}`} />
      ))}
      <span className="rating-text">({rating}/5)</span>
    </div>
  );

  const getStatusBadge = (status) => {
    const statusConfig = {
      published: { class: 'status-published', label: 'Published' },
      pending: { class: 'status-pending', label: 'Pending Review' },
      archived: { class: 'status-archived', label: 'Archived' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  const handleReply = (id) => {
    const replyText = prompt('Enter your reply:');
    if (replyText !== null) {
      setFeedbacks(prev =>
        prev.map(fb => fb.id === id ? { ...fb, reply: replyText } : fb)
      );
    }
  };

  const handleArchive = (id) => {
    if (window.confirm('Are you sure you want to archive this feedback?')) {
      setFeedbacks(prev =>
        prev.map(fb => fb.id === id ? { ...fb, status: 'archived' } : fb)
      );
    }
  };

  return (
    <div className="admin-main-container">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src="/craftopia logo.png" alt="Craftopia Logo" className="sidebar-logo-img" />
          <h2>Craftopia</h2>
        </div>

        <nav className="sidebar-nav">
          <Link to="/admin"><FiHome className="sidebar-icon"/> Dashboard</Link>
          <Link to="/admin-add-product"><FiPlus className="sidebar-icon"/> Add Product</Link>
          <Link to="/admin-update-product"><FiEdit className="sidebar-icon"/> Update Product</Link>
          <Link to="/admin-delete-product"><FiTrash2 className="sidebar-icon"/> Delete Product</Link>
          <Link to="/admin-view-orders"><FiEye className="sidebar-icon"/> View Orders</Link>
          <Link to="/admin-manage-orders"><FiPackage className="sidebar-icon"/> Manage Orders</Link>
          <Link to="/admin-delivery-status"><FiTruck className="sidebar-icon"/> Delivery Status</Link>
          <Link to="/admin-customer-feedback" className="active"><FiMessageCircle className="sidebar-icon"/> Customer Feedback</Link>
          <Link to="/admin-sales-report"><FiBarChart2 className="sidebar-icon"/> Sales Report</Link>
        </nav>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <h1>Customer Feedback</h1>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </header>

        <div className="feedback-content">
          <div className="feedback-header">
            <div className="search-box">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by customer, product, or feedback..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-box">
              <FiFilter className="filter-icon" />
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>

          <div className="feedback-stats">
            <div className="stat-card">
              <div className="stat-value">{feedbacks.length}</div>
              <div className="stat-label">Total Feedback</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{feedbacks.filter(f => f.rating >= 4).length}</div>
              <div className="stat-label">Positive (4+ Stars)</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{feedbacks.filter(f => f.rating <= 2).length}</div>
              <div className="stat-label">Needs Attention</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {(feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length).toFixed(1)}
              </div>
              <div className="stat-label">Average Rating</div>
            </div>
          </div>

          <div className="feedback-list">
            {filteredFeedbacks.length === 0 ? (
              <div className="no-feedback">
                <FiMessageCircle className="no-feedback-icon" />
                <h3>No feedback found</h3>
                <p>No customer feedback matches your search criteria.</p>
              </div>
            ) : (
              <div className="feedback-grid">
                {filteredFeedbacks.map(feedback => (
                  <div key={feedback.id} className={`feedback-card ${feedback.status === 'archived' ? 'archived' : ''}`}>
                    <div className="feedback-header">
                      <div className="customer-info">
                        <div className="customer-avatar">
                          <FiUser />
                        </div>
                        <div className="customer-details">
                          <strong>{feedback.customerName}</strong>
                          <span>{feedback.customerEmail}</span>
                        </div>
                      </div>
                      <div className="feedback-meta">
                        {renderStars(feedback.rating)}
                        <div className="feedback-date">
                          <FiCalendar />
                          {feedback.date}
                        </div>
                      </div>
                    </div>

                    <div className="product-info">
                      <strong>Product:</strong> {feedback.product}
                      <span className="order-id">(Order: {feedback.orderId})</span>
                    </div>

                    <div className="feedback-comment">
                      <p>{feedback.comment}</p>
                      {feedback.reply && <div className="feedback-reply"><strong>Reply:</strong> {feedback.reply}</div>}
                    </div>

                    <div className="feedback-footer">
                      {getStatusBadge(feedback.status)}
                      <div className="feedback-actions">
                        <button className="action-btn reply-btn" onClick={() => handleReply(feedback.id)}>Reply</button>
                        <button className="action-btn archive-btn" onClick={() => handleArchive(feedback.id)}>Archive</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminCustomerFeedback;
