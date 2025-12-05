import React, { useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import './AdminCustomerFeedback.css';
import AdminSidebar from '../../components/AdminSideBar/AdminSideBar'
import { 
  FiMessageCircle, 
  FiSearch, FiStar, FiUser, FiCalendar, FiFilter
} from 'react-icons/fi';

const AdminCustomerFeedback = () => {
  const navigate = useNavigate();
  const [searchTerm1, setSearchTerm1] = useState('');
  const [ratingFilter1, setRatingFilter1] = useState('all');

  // Keep the last saved JSON string to avoid clobbering existing storage with
  // our fallback sample on mount. We'll only persist when the JSON actually
  // differs from what's stored.
  const lastSavedRef = React.useRef(null);

  const [feedbacks1, setFeedbacks1] = useState(() => {
    try {
      const saved = localStorage.getItem('customerFeedbacks');
      if (saved) {
        lastSavedRef.current = saved;
        return JSON.parse(saved);
      }
    } catch (err) {
      console.error('Error reading customer feedbacks from localStorage:', err);
    }

    // Fallback sample data if none in localStorage
    return [
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
      }
    ];
  });

  // Ensure we always prefer live localStorage contents on mount (in case they were added
  // by another page during the session). This fixes a case where the fallback sample
  // would appear even when `localStorage.customerFeedbacks` exists.
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('customerFeedbacks');
      if (!saved) return;
      const parsed = JSON.parse(saved);

      // If parsed is an object with a feedbacks array, normalize it
      if (Array.isArray(parsed) && parsed.length >= 0) {
        setFeedbacks1(parsed);
        lastSavedRef.current = saved;
      } else if (parsed && Array.isArray(parsed.feedbacks)) {
        setFeedbacks1(parsed.feedbacks);
        lastSavedRef.current = JSON.stringify(parsed.feedbacks);
      }
    } catch (err) {
      console.error('Error parsing customerFeedbacks on mount:', err);
    }
  }, []);

  const handleLogout1 = () => navigate('/admin-login');

  const filteredFeedbacks1 = feedbacks1.filter(feedback => {
    const matchesSearch = 
      feedback.customerName.toLowerCase().includes(searchTerm1.toLowerCase()) ||
      feedback.product.toLowerCase().includes(searchTerm1.toLowerCase()) ||
      feedback.comment.toLowerCase().includes(searchTerm1.toLowerCase());
    
    const matchesRating = ratingFilter1 === 'all' || feedback.rating.toString() === ratingFilter1;
    
    return matchesSearch && matchesRating;
  });

  const renderStars1 = (rating) => (
    <div className="stars-container1">
      {[1, 2, 3, 4, 5].map(star => (
        <FiStar key={star} className={`star1 ${star <= rating ? 'filled1' : 'empty1'}`} />
      ))}
      <span className="rating-text1">({rating}/5)</span>
    </div>
  );

  const getStatusBadge1 = (status) => {
    const statusConfig1 = {
      published: { class: 'status-published1', label: 'Published' },
      pending: { class: 'status-pending1', label: 'Pending Review' },
      archived: { class: 'status-archived1', label: 'Archived' }
    };
    
    const config = statusConfig1[status] || statusConfig1.pending;
    return <span className={`status-badge1 ${config.class}`}>{config.label}</span>;
  };

  const handleReply1 = (id) => {
    const replyText = prompt('Enter your reply:');
    if (replyText !== null) {
      setFeedbacks1(prev =>
        prev.map(fb => fb.id === id ? { ...fb, reply: replyText } : fb)
      );
    }
  };

  const handleArchive1 = (id) => {
    if (window.confirm('Are you sure you want to archive this feedback?')) {
      setFeedbacks1(prev =>
        prev.map(fb => fb.id === id ? { ...fb, status: 'archived' } : fb)
      );
    }
  };

  // Persist feedbacks to localStorage whenever they change
  React.useEffect(() => {
    try {
      const current = JSON.stringify(feedbacks1 || []);
      const existing = localStorage.getItem('customerFeedbacks');

      // Only write when the content actually changed to avoid overwriting
      // a real stored value with our fallback sample on initial mount.
      if (existing === null || current !== existing || lastSavedRef.current !== current) {
        localStorage.setItem('customerFeedbacks', current);
        lastSavedRef.current = current;
      }
    } catch (err) {
      console.error('Error saving customer feedbacks to localStorage:', err);
    }
  }, [feedbacks1]);

  return (
    <div className="admin-main-container1">
      {/* Sidebar */}
      <AdminSidebar />

      <main className="main-content1">
        <header className="main-header1">
          <h1>Customer Feedback</h1>
          <button className="logout-btn1" onClick={handleLogout1}>Logout</button>
        </header>

        <div className="feedback-content1">
          <div className="feedback-header1">
            <div className="search-box1">
              <FiSearch className="search-icon1" />
              <input
                type="text"
                placeholder="Search by customer, product, or feedback..."
                value={searchTerm1}
                onChange={(e) => setSearchTerm1(e.target.value)}
                className="search-input1"
              />
            </div>

            <div className="filter-box1">
              <FiFilter className="filter-icon1" />
              <select
                value={ratingFilter1}
                onChange={(e) => setRatingFilter1(e.target.value)}
                className="filter-select1"
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

          <div className="feedback-stats1">
            <div className="stat-card1">
              <div className="stat-value1">{feedbacks1.length}</div>
              <div className="stat-label1">Total Feedback</div>
            </div>
            <div className="stat-card1">
              <div className="stat-value1">{feedbacks1.filter(f => f.rating >= 4).length}</div>
              <div className="stat-label1">Positive (4+ Stars)</div>
            </div>
            <div className="stat-card1">
              <div className="stat-value1">{feedbacks1.filter(f => f.rating <= 2).length}</div>
              <div className="stat-label1">Needs Attention</div>
            </div>
            <div className="stat-card1">
              <div className="stat-value1">
                {(feedbacks1.reduce((acc, f) => acc + f.rating, 0) / feedbacks1.length).toFixed(1)}
              </div>
              <div className="stat-label1">Average Rating</div>
            </div>
          </div>

          <div className="feedback-list1">
            {filteredFeedbacks1.length === 0 ? (
              <div className="no-feedback1">
                <FiMessageCircle className="no-feedback-icon1" />
                <h3>No feedback found</h3>
                <p>No customer feedback matches your search criteria.</p>
              </div>
            ) : (
              <div className="feedback-grid1">
                {filteredFeedbacks1.map(feedback => (
                  <div key={feedback.id} className={`feedback-card1 ${feedback.status === 'archived' ? 'archived1' : ''}`}>
                    <div className="feedback-header1">
                      <div className="customer-info1">
                        <div className="customer-avatar1">
                          <FiUser />
                        </div>
                        <div className="customer-details1">
                          <strong>{feedback.customerName}</strong>
                          <span>{feedback.customerEmail}</span>
                        </div>
                      </div>
                      <div className="feedback-meta1">
                        {renderStars1(feedback.rating)}
                        <div className="feedback-date1">
                          <FiCalendar />
                          {feedback.date}
                        </div>
                      </div>
                    </div>

                    <div className="product-info1">
                      <strong>Product:</strong> {feedback.product}
                      <span className="order-id1">(Order: {feedback.orderId})</span>
                    </div>

                    <div className="feedback-comment1">
                      <p>{feedback.comment}</p>
                      {feedback.reply && <div className="feedback-reply1"><strong>Reply:</strong> {feedback.reply}</div>}
                    </div>

                    <div className="feedback-footer1">
                      {getStatusBadge1(feedback.status)}
                      <div className="feedback-actions1">
                        <button className="action-btn1 reply-btn1" onClick={() => handleReply1(feedback.id)}>Reply</button>
                        <button className="action-btn1 archive-btn1" onClick={() => handleArchive1(feedback.id)}>Archive</button>
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