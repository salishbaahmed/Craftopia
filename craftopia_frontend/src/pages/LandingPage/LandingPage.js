import React, { useState, useEffect } from 'react';
import './LandingPage.css';
import './LandingPage.css';

const LandingPage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const featuredProducts = [
    {
      id: 1,
      category: "Resin Keychain",
      name: "Floral Resin Keychain",
      price: 1200,
      images: ["/placeholder.png"]
    },
    {
      id: 2,
      category: "Resin Bookmarks",
      name: "Ocean Wave Resin Bookmark",
      price: 850,
      images: ["/placeholder.png"]
    },
    {
      id: 3,
      category: "Resin Coasters",
      name: "Geometric Resin Coaster Set",
      price: 2200,
      images: ["/placeholder.png"]
    },
    {
      id: 4,
      category: "Resin Jewelry Boxes",
      name: "Mini Resin Jewelry Box",
      price: 3500,
      images: ["/placeholder.png"]
    },
    {
      id: 5,
      category: "Resin Trays",
      name: "Marble Resin Serving Tray",
      price: 4200,
      images: ["/placeholder.png"]
    },
    {
      id: 6,
      category: "Resin Cups",
      name: "Colorful Resin Tea Cup",
      price: 1800,
      images: ["/placeholder.png"]
    }
  ];

  return (
    <div className="landing-page">
      {/* ... (Header and Hero sections remain unchanged) ... */}
      <header className="header">
        <div className="header-container">
          {/* Logo */}
          <div className="logo">
            <img
              src="/Craftopia Logo2.png"
              alt="Craftopia Logo"
              className="logo-image"
            />
            <span className="logo-name">Craftopia</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-navigation">
            <a href="#home" className="nav-link">Home</a>
            <a href="#about" className="nav-link">About</a>
          </nav>

          {/* Login Section */}
          <div className="header-right">
            {/* Desktop Login Dropdown */}
            <div className="desktop-login-container">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="login-btn"
              >
                Login
              </button>

              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <a href="/admin-login" className="dropdown-item">
                    Login as Admin
                  </a>
                  <a href="/customer-login" className="dropdown-item">
                    Login as Customer
                  </a>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mobile-menu">
            <nav className="mobile-navigation">
              <a href="#home" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Home</a>
             //<a href="#about" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>About</a>
              <div className="mobile-login-options">
                <a href="/admin-login" className="mobile-login-btn admin">Admin Login</a>
                <a href="/customer-login" className="mobile-login-btn customer">Customer Login</a>
              </div>
            </nav>
          </div>
        )}
      </header>


      {/* Middle Section */}
      <section className="middle-section">
        <div className="middle-container">
          {/* Logo */}
          <div className="middle-logo-container">
            <img
              src="/craftopia logo.png"
              alt="Craftopia Logo"
              className="middle-logo-image"
            />
          </div>

          <h2 className="middle-title">Welcome to Craftopia</h2>

          <p className="middle-tagline">Connecting Artisans and Customers</p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon artist-icon">
                <span>🎨</span>
              </div>
              <h3 className="feature-title">Artist Stories</h3>
              <p className="feature-description">
                Discover the passion and stories behind each handmade creation
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon eco-icon">
                <span>🌱</span>
              </div>
              <h3 className="feature-title">Eco-Friendly</h3>
              <p className="feature-description">
                Sustainable packaging and environmentally conscious practices
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon gift-icon">
                <span>🎁</span>
              </div>
              <h3 className="feature-title">Gift Mode</h3>
              <p className="feature-description">
                Personalized wrapping and messages for special occasions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section" id="about">
        <div className="about-container">
          <h2 className="about-title">About Craftopia</h2>
          <div className="about-content">
            <div className="about-text">
              <p className="about-paragraph">
                Craftopia is an e-commerce platform dedicated to handmade products that combines
                storytelling, interactivity, and sustainability. We provide not just an online
                marketplace, but a community that connects customers with the art and the artist.
              </p>
              <p className="about-paragraph">
                Our platform enables skilled artisans and hobbyists to reach global audiences
                while providing customers with unique, meaningful products that carry personal
                stories and cultural significance.
              </p>
              <ul className="about-list">
                <li className="about-list-item">
                  <span className="list-bullet"></span>
                  Limited-edition product launches
                </li>
                <li className="about-list-item">
                  <span className="list-bullet"></span>
                  Customer reward system
                </li>
                <li className="about-list-item">
                  <span className="list-bullet"></span>
                  Interactive shopping experience
                </li>
              </ul>
            </div>
            <div className="about-highlights">
              <h3 className="highlights-title">Why Choose Craftopia?</h3>
              <div className="highlight-items">
                <div className="highlight-item authenticity">
                  <h4 className="highlight-title">Authenticity</h4>
                  <p className="highlight-description">Every product has a unique story and creator behind it</p>
                </div>
                <div className="highlight-item quality">
                  <h4 className="highlight-title">Quality</h4>
                  <p className="highlight-description">Handcrafted with attention to detail and quality materials</p>
                </div>
                <div className="highlight-item community">
                  <h4 className="highlight-title">Community</h4>
                  <p className="highlight-description">Join a growing community of artisans and craft lovers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-logo">
              <img
                src="/Craftopia Logo2.png"
                alt="Craftopia Logo"
                className="footer-logo-image"
              />
              <span className="footer-logo-name">Craftopia</span>
            </div>
            <p className="footer-description">
              Craftopia is revolutionizing the handmade marketplace by combining e-commerce
              functionality with personal connection. We're building a platform where every
              purchase tells a story and supports creative communities worldwide.
            </p>
            
            <p className="footer-copyright">
              © 2024 Craftopia. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;