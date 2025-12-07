import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';
import './CustomerWishlist.css';
import {
  FiShare2,
  FiFilter,
  FiHeart,
  FiSearch,
  FiTrash2,
  FiCheck,
  FiPackage,
  FiDollarSign,
  FiArchive,
  FiShoppingCart
} from 'react-icons/fi';

const CustomerWishlist = () => {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCartNotification, setShowCartNotification] = useState(false);

  const [wishlistItems, setWishlistItems] = useState([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('craftopiaWishlist');
    if (saved) {
      try {
        setWishlistItems(JSON.parse(saved));
      } catch (err) {
        console.error('Error parsing wishlist from localStorage', err);
        setWishlistItems([]);
      }
    }
  }, []);

  // Listen for wishlist updates from other pages
  useEffect(() => {
    const handler = () => {
      const saved = localStorage.getItem('craftopiaWishlist');
      if (saved) {
        try {
          setWishlistItems(JSON.parse(saved));
        } catch (err) {
          console.error('Error parsing wishlist from localStorage', err);
        }
      } else {
        setWishlistItems([]);
      }
    };
    window.addEventListener('wishlistUpdated', handler);
    return () => window.removeEventListener('wishlistUpdated', handler);
  }, []);

  const totalValue = wishlistItems.reduce((sum, item) => sum + item.price, 0);
  const inStockCount = wishlistItems.filter(item => item.inStock).length;

  const filteredItems = wishlistItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  };

  const toggleItemSelection = (itemId) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const addToCart = (item) => {
    // add to craftopiaCart in localStorage
    const existingCart = JSON.parse(localStorage.getItem('craftopiaCart') || '[]');
    const existing = existingCart.find(ci => ci.id === item.id && ci.type !== 'gift');
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      existingCart.push({ ...item, quantity: 1, type: 'product', image: item.image || '/images/placeholder.png' });
    }
    localStorage.setItem('craftopiaCart', JSON.stringify(existingCart));
    window.dispatchEvent(new Event('cartUpdated'));
    setShowCartNotification(true);
    setTimeout(() => setShowCartNotification(false), 2000);
  };

  const shareWishlist = () => {
    alert('Wishlist shared!');
  };

  const removeItem = (itemId) => {
    const updated = wishlistItems.filter(item => item.id !== itemId);
    setWishlistItems(updated);
    setSelectedItems(prev => prev.filter(id => id !== itemId));
    localStorage.setItem('craftopiaWishlist', JSON.stringify(updated));
  };

  const formatPrice = (price) => `Rs ${price.toLocaleString()}`;
  const renderStars = (rating) => '★'.repeat(rating) + '☆'.repeat(5 - rating);

  if (wishlistItems.length === 0) {
    return (
      <div className="wishlist-page">
        <Navbar />
        <div className="wishlist-container">
          <div className="wishlist-header">
            <button className="back-button" onClick={() => navigate('/customer')}>Back to Shopping</button>
            <h1>My Wishlist</h1>
          </div>
          <div className="empty-wishlist">
            <div className="empty-heart"><FiHeart /></div>
            <h2>Your wishlist is empty</h2>
            <p>Start adding items you love to your wishlist</p>
            <button className="shop-now-btn" onClick={() => navigate('/customer')}>Start Shopping</button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <Navbar />

      {/* Cart Notification */}
      {showCartNotification && (
        <div className="cart-notification">
          <FiShoppingCart className="notification-icon" />
          <span>Item added to cart!</span>
        </div>
      )}

      <div className="wishlist-container">
        <div className="wishlist-header-main">
          <div className="header-content">
            <h1>My Wishlist</h1>
            <p>{wishlistItems.length} items saved for later</p>
          </div>
        </div>

        <div className="wishlist-grid-new">
          {filteredItems.map(item => (
            <div key={item.id} className="wishlist-item-new">
              {item.discount && <div className="discount-badge">{item.discount}% OFF</div>}

              <div className="customer-product-image-placeholder1">Product Image</div>

              <div className="product-info">
                <h3 className="product-title">{item.name}</h3>
                <div className="product-rating">
                  <span className="stars">{renderStars(item.rating)}</span>
                  <span className="reviews">({item.reviews})</span>
                </div>

                <div className="product-price">
                  <span className="current-price">{formatPrice(item.price)}</span>
                  {item.originalPrice && <span className="original-price">{formatPrice(item.originalPrice)}</span>}
                </div>

                {item.inStock && item.stockLeft && <p className="stock-info">Only {item.stockLeft} left in stock</p>}

                <button onClick={() => addToCart(item)} disabled={!item.inStock} className={`add-to-cart-btn ${item.inStock ? '' : 'out-of-stock'}`}>
                  {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>

                <div className="item-footer">
                  <span className="added-date">Added {item.addedDate}</span>
                  <button onClick={() => removeItem(item.id)} className="delete-btn"><FiTrash2 /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="empty-search-state">
            <FiHeart className="empty-icon" />
            <h3>No items found</h3>
            <p>Try adjusting your search terms</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CustomerWishlist;
