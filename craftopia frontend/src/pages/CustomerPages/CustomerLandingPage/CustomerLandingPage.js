import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';
import './CustomerLandingPage.css';
import { FiSearch, FiHeart, FiShoppingCart, FiGift } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

// All products data with updated categories
const allProducts = [
  {
    id: 1,
    category: "Resin Keychain",
    name: "Floral Resin Keychain",
    description: "Beautiful transparent resin keychain with pressed flowers",
    rating: "4.8 (25 reviews)",
    price: 1200,
    badge: "Popular"
  },
  {
    id: 2,
    category: "Resin Bookmarks",
    name: "Ocean Wave Resin Bookmark",
    description: "Elegant resin bookmark with blue ocean wave design",
    rating: "4.6 (18 reviews)",
    price: 850,
    originalPrice: 1000,
    discount: "15%",
    badge: "Sale"
  },
  {
    id: 3,
    category: "Resin Coasters",
    name: "Geometric Resin Coaster Set",
    description: "Set of 4 resin coasters with geometric patterns",
    rating: "4.9 (30 reviews)",
    price: 2200
  },
  {
    id: 4,
    category: "Resin Jewelry Boxes",
    name: "Mini Resin Jewelry Box",
    description: "Small resin jewelry box with gold flakes",
    rating: "4.7 (22 reviews)",
    price: 3500,
    badge: "Limited Edition"
  },
  {
    id: 5,
    category: "Resin Trays",
    name: "Marble Resin Serving Tray",
    description: "Elegant marble-effect resin serving tray",
    rating: "4.5 (15 reviews)",
    price: 4200
  },
  {
    id: 6,
    category: "Resin Cups",
    name: "Colorful Resin Tea Cup",
    description: "Handcrafted resin cup with colorful swirls",
    rating: "4.4 (12 reviews)",
    price: 1800,
    originalPrice: 2000,
    discount: "10%"
  },
  {
    id: 7,
    category: "Resin Magnets",
    name: "Fruit-shaped Resin Magnets",
    description: "Set of 6 cute fruit-shaped resin magnets",
    rating: "4.8 (20 reviews)",
    price: 900,
    badge: "Popular"
  },
  {
    id: 8,
    category: "Resin Name Plates",
    name: "Personalized Resin Name Plate",
    description: "Custom resin name plate for desk",
    rating: "4.9 (28 reviews)",
    price: 1500
  },
  {
    id: 9,
    category: "Clay Pencil Toppers",
    name: "Animal Clay Pencil Toppers",
    description: "Set of 4 adorable animal clay pencil toppers",
    rating: "4.5 (19 reviews)",
    price: 600
  },
  {
    id: 10,
    category: "Clay Bookmarks",
    name: "Clay Flower Bookmarks",
    description: "Delicate clay flower-shaped bookmarks",
    rating: "4.7 (23 reviews)",
    price: 750,
    badge: "New"
  },
  {
    id: 11,
    category: "Clay Badges",
    name: "Emoji Clay Badges",
    description: "Set of 8 fun emoji clay badges",
    rating: "4.6 (16 reviews)",
    price: 500,
    originalPrice: 650,
    discount: "23%"
  },
  {
    id: 12,
    category: "Clay Keychains",
    name: "Mini Food Clay Keychains",
    description: "Cute miniature food clay keychains",
    rating: "4.9 (31 reviews)",
    price: 800
  },
  {
    id: 13,
    category: "Clay Desk Decor",
    name: "Clay Plant Desk Decor",
    description: "Small clay succulent plant for desk",
    rating: "4.8 (27 reviews)",
    price: 1200
  },
  {
    id: 14,
    category: "Clay Photo Holders",
    name: "Clay Cat Photo Holder",
    description: "Adorable clay cat holding photo frame",
    rating: "4.7 (21 reviews)",
    price: 950
  },
  {
    id: 15,
    category: "Customized Resin Keychains",
    name: "Custom Name Resin Keychain",
    description: "Personalized resin keychain with your name",
    rating: "4.9 (35 reviews)",
    price: 1500,
    badge: "Custom"
  },
  {
    id: 16,
    category: "Customized Resin Initial Necklaces",
    name: "Initial Resin Pendant Necklace",
    description: "Elegant resin necklace with custom initial",
    rating: "4.8 (29 reviews)",
    price: 2800
  },
  {
    id: 17,
    category: "Customized Resin Bookmarks",
    name: "Personalized Resin Bookmark",
    description: "Custom resin bookmark with name or quote",
    rating: "4.7 (24 reviews)",
    price: 1300,
    originalPrice: 1500,
    discount: "13%"
  },
  {
    id: 18,
    category: "Customized Resin Trinket Boxes",
    name: "Custom Resin Memory Box",
    description: "Personalized resin trinket box for keepsakes",
    rating: "4.9 (32 reviews)",
    price: 4500,
    badge: "Custom"
  },
  {
    id: 19,
    category: "Custom Resin Photo Coasters",
    name: "Photo Resin Coasters",
    description: "Custom resin coasters with your photos",
    rating: "4.8 (26 reviews)",
    price: 3200
  },
  {
    id: 20,
    category: "Customize Resin Name Plates",
    name: "Desk Name Plate Custom",
    description: "Personalized resin name plate for office",
    rating: "4.6 (18 reviews)",
    price: 1800
  },
  {
    id: 21,
    category: "Customized Clay Keychains",
    name: "Custom Clay Character Keychain",
    description: "Personalized clay keychain with your design",
    rating: "4.9 (33 reviews)",
    price: 1100,
    badge: "Custom"
  },
  {
    id: 22,
    category: "Customized Clay Initial Necklaces",
    name: "Clay Initial Necklace Custom",
    description: "Beautiful clay necklace with custom initial",
    rating: "4.7 (25 reviews)",
    price: 2400
  },
  {
    id: 23,
    category: "Customized Clay Bookmarks",
    name: "Personalized Clay Bookmark",
    description: "Custom clay bookmark with name or design",
    rating: "4.8 (28 reviews)",
    price: 1000
  },
  {
    id: 24,
    category: "Customized Clay Trinket Boxes",
    name: "Custom Clay Keepsake Box",
    description: "Personalized clay box for special items",
    rating: "4.9 (30 reviews)",
    price: 3800,
    badge: "Custom"
  }
];

const categories = [
  "All Products",
  "Resin Keychain",
  "Resin Bookmarks",
  "Resin Coasters",
  "Resin Jewelry Boxes",
  "Resin Trays",
  "Resin Cups",
  "Resin Magnets",
  "Resin Name Plates",
  "Clay Pencil Toppers",
  "Clay Bookmarks",
  "Clay Badges",
  "Clay Keychains",
  "Clay Desk Decor",
  "Clay Photo Holders",
  "Customized Resin Keychains",
  "Customized Resin Initial Necklaces",
  "Customized Resin Bookmarks",
  "Customized Resin Trinket Boxes",
  "Custom Resin Photo Coasters",
  "Customize Resin Name Plates",
  "Customized Clay Keychains",
  "Customized Clay Initial Necklaces",
  "Customized Clay Bookmarks",
  "Customized Clay Trinket Boxes"
];

const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under PKR 1,000", min: 0, max: 1000 },
  { label: "PKR 1,000 - PKR 2,000", min: 1000, max: 2000 },
  { label: "PKR 2,001 - PKR 3,500", min: 2001, max: 3500 },
  { label: "Over PKR 3,500", min: 3501, max: Infinity }
];

const CustomerLandingPage = () => {
  // State management
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0]);
  const [filteredProducts, setFilteredProducts] = useState(allProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [showCartNotification, setShowCartNotification] = useState(false);
  const navigate = useNavigate();

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('craftopiaWishlist');
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (err) {
        console.error('Error parsing wishlist from localStorage', err);
        setWishlist([]);
      }
    }
  }, []);

  // Persist wishlist to localStorage when it changes and notify listeners
  useEffect(() => {
    try {
      localStorage.setItem('craftopiaWishlist', JSON.stringify(wishlist));
      window.dispatchEvent(new Event('wishlistUpdated'));
    } catch (err) {
      console.error('Error saving wishlist to localStorage', err);
    }
  }, [wishlist]);

  // Filter products based on category, price range, and search query
  useEffect(() => {
    let filtered = allProducts;

    // Filter by category
    if (selectedCategory !== "All Products") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= selectedPriceRange.min && product.price <= selectedPriceRange.max
    );

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, selectedPriceRange, searchQuery]);

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  // Handle price range selection
  const handlePriceRangeSelect = (priceRange) => {
    setSelectedPriceRange(priceRange);
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory("All Products");
    setSelectedPriceRange(priceRanges[0]);
    setSearchQuery("");
  };

  // Format price for display
  const formatPrice = (price) => {
    return `PKR ${price.toLocaleString()}`;
  };

  // Add to cart functionality - store in localStorage and show notification
  const addToCart = (product) => {
    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('craftopiaCart') || '[]');
    
    // Check if product already exists in cart
    const existingItem = existingCart.find(item => item.id === product.id && item.type !== 'gift');
    
    if (existingItem) {
      // If product exists, increase quantity
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      // Add new product to cart
      existingCart.push({
        ...product,
        quantity: 1,
        type: 'product',
        image: '/images/placeholder.png' // Default image since products don't have images in data
      });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('craftopiaCart', JSON.stringify(existingCart));
    
    // Trigger cart update event for other components
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Show notification
    setShowCartNotification(true);
    setTimeout(() => setShowCartNotification(false), 3000);
  };

  // Add to wishlist functionality
  const toggleWishlist = (product) => {
    const isInWishlist = wishlist.some(item => item.id === product.id);

    if (isInWishlist) {
      setWishlist(prev => prev.filter(item => item.id !== product.id));
    } else {
      // store minimal product info to wishlist, including inStock status
      const entry = { 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        category: product.category, 
        image: product.image || '/images/placeholder.png',
        inStock: true, // All products in landing page are in stock by default
        rating: 5,
        reviews: 0,
        addedDate: new Date().toLocaleDateString()
      };
      setWishlist(prev => [...prev, entry]);
    }
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  // Handle Send Gift navigation
  const handleSendGift = (product) => {
    // Store the selected product in localStorage to pass to Send Gift page
    localStorage.setItem('selectedGiftProduct', JSON.stringify(product));
    navigate('/customer-send-gift');
  };

  return (
    <div className="landing-page">
      <Navbar />
      
      {/* Cart Notification */}
      {showCartNotification && (
        <div className="cart-notification">
          <FiShoppingCart className="notification-icon" />
          <span>Item added to cart!</span>
        </div>
      )}

      <main className="main-content">
        <section className="hero-section" id="home">
          <div className="hero-content">
            <h1 className="hero-title">Welcome Back!</h1>
            <p className="hero-subtitle">
              Discover unique handmade resin and clay crafts by artisans
            </p>
          </div>
        </section>

        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search resin keychains, clay bookmarks, custom products..."
            className="search-input"
            value={searchQuery}
            onChange={handleSearch}
          />
          <button className="search-button">
            <FiSearch />
          </button>
        </div>

        <div className="container main-grid">
          <aside className="filter-sidebar">
            <div className="filter-sidebar-content">
              {/* Active Filters Display */}
              <div className="filter-active-section">
                <h4 className="filter-active-title">Active Filters</h4>
                <div className="filter-active-tags">
                  {selectedCategory !== "All Products" && (
                    <span className="filter-active-tag">
                      Category: {selectedCategory}
                      <button 
                        className="filter-remove-btn"
                        onClick={() => setSelectedCategory("All Products")}
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {selectedPriceRange.label !== "All Prices" && (
                    <span className="filter-active-tag">
                      Price: {selectedPriceRange.label}
                      <button 
                        className="filter-remove-btn"
                        onClick={() => setSelectedPriceRange(priceRanges[0])}
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>
                {(selectedCategory !== "All Products" || selectedPriceRange.label !== "All Prices") && (
                  <button className="filter-clear-all" onClick={resetFilters}>
                    Clear All Filters
                  </button>
                )}
              </div>

              {/* Categories Section */}
              <div className="filter-category-section">
                <h3 className="filter-section-title">Categories</h3>
                <ul className="filter-category-list">
                  {categories.map((category, index) => (
                    <li key={index} className="filter-category-item">
                      <button 
                        className={`filter-category-button ${selectedCategory === category ? 'filter-category-active' : ''}`}
                        onClick={() => handleCategorySelect(category)}
                      >
                        <span className="filter-category-text">{category}</span>
                        {category !== "All Products" && (
                          <span className="filter-category-count">
                            ({allProducts.filter(p => p.category === category).length})
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Range Section */}
              <div className="filter-price-section">
                <h3 className="filter-section-title">Price Range</h3>
                <ul className="filter-price-list">
                  {priceRanges.map((range, index) => (
                    <li key={index} className="filter-price-item">
                      <button 
                        className={`filter-price-button ${selectedPriceRange.label === range.label ? 'filter-price-active' : ''}`}
                        onClick={() => handlePriceRangeSelect(range)}
                      >
                        {range.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <button className="filter-show-all" onClick={resetFilters}>
                Show All Items
              </button>
            </div>
          </aside>

          <section className="products-section">
            <div className="products-header">
              <h2>Handmade Resin & Clay Crafts</h2>
              <div className="results-info">
                Showing {filteredProducts.length} of {allProducts.length} products
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="no-products">
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms</p>
                <button className="reset-filters-btn" onClick={resetFilters}>
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="product-card">
                    <div className="product-image">
                      {product.badge && (
                        <div className={`product-badge ${product.badge === 'Sale' ? 'sale' : 
                                          product.badge === 'Limited Edition' ? 'limited' : 
                                          product.badge === 'Custom' ? 'custom' : 'popular'}`}>
                          {product.badge}
                        </div>
                      )}
                      <button 
                        className={`like-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                        onClick={() => toggleWishlist(product)}
                      >
                        <FiHeart />
                      </button>
                      <div className="image-placeholder">
                        {product.category}
                      </div>
                    </div>
                    <div className="product-info">
                      <p className="product-category">{product.category}</p>
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-description">{product.description}</p>
                      <div className="product-rating">⭐ {product.rating}</div>
                      <div className="product-price">
                        <span className="current-price">{formatPrice(product.price)}</span>
                        {product.originalPrice && (
                          <>
                            <span className="original-price">{formatPrice(product.originalPrice)}</span>
                            {product.discount && (
                              <span className="discount">{product.discount}</span>
                            )}
                          </>
                        )}
                      </div>
                      <div className="product-actions">
                        <button 
                          className="add-to-cart-btn"
                          onClick={() => addToCart(product)}
                        >
                          <FiShoppingCart className="btn-icon" />
                          Add to Cart
                        </button>
                        <button 
                          className="send-gift-btn"
                          onClick={() => handleSendGift(product)}
                        >
                          <FiGift className="btn-icon" />
                          Send as Gift
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CustomerLandingPage;