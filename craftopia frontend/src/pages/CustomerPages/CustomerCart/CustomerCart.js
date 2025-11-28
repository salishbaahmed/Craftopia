import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import "./CustomerCart.css";
import { FiMinus, FiPlus, FiTrash2, FiShield, FiTruck, FiTag, FiShoppingCart } from "react-icons/fi";

const CustomerCart = () => {
  const navigate = useNavigate();

  // Load cart items from localStorage instead of dummy data
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('craftopiaCart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Validate and sanitize cart items
        return parsedCart.filter(item => item && item.id && item.price && item.quantity);
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        return [];
      }
    }
    // Return empty array if no cart data, instead of dummy data
    return [];
  });

  const [promoCode, setPromoCode] = useState("");

  // Listen for cart updates from other pages
  React.useEffect(() => {
    const handleCartUpdate = () => {
      const savedCart = localStorage.getItem('craftopiaCart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  // Save cart to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('craftopiaCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const updateQuantity = (id, qty) => {
    if (qty < 1) return;
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: qty } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((t, i) => {
    const price = i?.price || 0;
    const quantity = i?.quantity || 1;
    return t + (price * quantity);
  }, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;
  const totalItems = cartItems.reduce((total, item) => total + (item?.quantity || 0), 0);

  const format = (num) => {
    if (num === undefined || num === null) return 'Rs 0';
    return `Rs ${num.toLocaleString()}`;
  };

  const handleCheckout = () => navigate("/customer-checkout");

  return (
    <div className="cart-page">
      <Navbar />
      
      {/* Added spacing container */}
      <div className="cart-content-wrapper">
        
        {/* NEW HEADER SECTION */}
        <div className="cart-header">
          <div className="cart-header-content">
            <div className="cart-title-section">
              <div className="cart-icon-title">
                <FiShoppingCart className="cart-main-icon" />
                <h1>Shopping Cart</h1>
              </div>
              <p className="cart-subtitle">
                {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
            
            <div className="cart-stats">
              <div className="stat-item">
                <span className="stat-label">Total Items</span>
                <span className="stat-value">{totalItems}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Subtotal</span>
                <span className="stat-value">{format(subtotal)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="cart-layout">
          {/* LEFT SIDE CART LIST */}
          <div className="cart-list-section">
            <div className="section-header">
              <h3>Your Items</h3>
              <span className="item-count">({totalItems} items)</span>
            </div>
            {cartItems.length === 0 ? (
              <div className="empty-cart-message">
                <FiShoppingCart className="empty-cart-icon" />
                <h3>Your Cart is Empty</h3>
                <p>Add items from our products to get started</p>
                <button className="continue-shopping-btn" onClick={() => navigate('/customer')}>
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="cart-list">
              {cartItems.map(item => {
                if (!item || !item.id || !item.name || !item.price) return null;
                return (
                <div key={item.id} className="cart-card">
                  
                  {/* IMAGE */}
                  <div className="cart-img">
                    <img src={item.image || '/images/placeholder.png'} alt={item.name} />
                  </div>

                  {/* DETAILS */}
                  <div className="cart-info">
                    <p className="cart-category">{item.category || 'Product'}</p>
                    <h3 className="cart-name">{item.name}</h3>
                    {item.type === 'gift' && item.giftDetails && (
                      <div className="gift-info-badge">
                        <span className="gift-badge">🎁 Gift</span>
                        <p className="gift-recipient">To: <strong>{item.giftDetails.recipientName}</strong></p>
                      </div>
                    )}
                    <p className="item-unit-price">{format(item.price || 0)} total</p>

                    {/* Quantity */}
                    <div className="qty-box">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        <FiMinus />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <FiPlus />
                      </button>
                    </div>
                  </div>

                  {/* PRICE + TRASH */}
                  <div className="cart-right">
                    <p className="cart-price">{format((item.price || 0) * (item.quantity || 1))}</p>

                    <button className="delete-btn" onClick={() => removeItem(item.id)}>
                      <FiTrash2 />
                    </button>
                  </div>

                </div>
                );
              })}
              </div>
            )}
          </div>

          {/* RIGHT SIDE ORDER SUMMARY */}
          {cartItems.length > 0 && (
          <div className="summary-section">
            <div className="summary-box">
              <h3>Order Summary</h3>

              {/* PROMO */}
              <div className="promo-row">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button className="apply-btn">Apply</button>
              </div>

              <p className="promo-suggest">Try: CRAFT10 or WELCOME20</p>

              <div className="summary-line" />

              {/* PRICE TABLE */}
              <div className="summary-item">
                <span>Subtotal ({totalItems} items)</span>
                <span>{format(subtotal)}</span>
              </div>

              <div className="summary-item">
                <span>Shipping</span>
                <span className="free">FREE</span>
              </div>

              <div className="summary-item">
                <span>Tax (5%)</span>
                <span>{format(tax)}</span>
              </div>

              <div className="summary-line" />

              <div className="summary-total">
                <span>Total</span>
                <span>{format(total)}</span>
              </div>

              <button className="checkout-btn" onClick={handleCheckout}>
                Proceed to Checkout
              </button>

              <div className="benefits">
                <p><FiShield /> Secure checkout</p>
                <p><FiTruck /> Fast & reliable delivery</p>
                <p><FiTag /> Best price guarantee</p>
              </div>

            </div>
          </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CustomerCart;