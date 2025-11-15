import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminDeleteProduct.css';
import { 
  FiHome, FiPlus, FiEdit, FiTrash2, FiEye,
  FiPackage, FiTruck, FiMessageCircle, FiBarChart2,
  FiSearch, FiX
} from 'react-icons/fi';

const DeleteProduct = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // Dummy product data
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Handmade Ceramic Mug',
      category: 'Pottery & Ceramics',
      price: 25,
      stock: 15,
      image: '/images/placeholder-product.png',
      description: 'Beautiful hand-painted ceramic mug with unique patterns',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'Wooden Jewelry Box',
      category: 'Woodworking',
      price: 45,
      stock: 8,
      image: '/images/placeholder-product.png',
      description: 'Handcrafted wooden jewelry box with intricate carvings',
      createdAt: '2024-02-03'
    },
    {
      id: 3,
      name: 'Hand-knitted Scarf',
      category: 'Knitting & Crochet',
      price: 32,
      stock: 22,
      image: '/images/placeholder-product.png',
      description: 'Warm and cozy hand-knitted scarf with wool blend',
      createdAt: '2024-01-28'
    },
    {
      id: 4,
      name: 'Artisan Soap Set',
      category: 'Candles & Soaps',
      price: 18,
      stock: 30,
      image: '/images/placeholder-product.png',
      description: 'Natural artisan soap set with essential oils',
      createdAt: '2024-02-10'
    },
    {
      id: 5,
      name: 'Leather Wallet',
      category: 'Leather Goods',
      price: 55,
      stock: 12,
      image: '/images/placeholder-product.png',
      description: 'Genuine leather wallet with multiple card slots',
      createdAt: '2024-01-20'
    },
    {
      id: 6,
      name: 'Hand-painted Canvas',
      category: 'Painting & Art',
      price: 120,
      stock: 3,
      image: '/images/placeholder-product.png',
      description: 'Original hand-painted canvas artwork',
      createdAt: '2024-02-05'
    }
  ]);

  // Filter products based on search
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleProductSelection = (productId) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const selectAllProducts = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(product => product.id));
    }
  };

  const handleDelete = async () => {
    if (selectedProducts.length === 0) {
      alert('Please select at least one product to delete');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedProducts.length} product(s)? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    
    // Simulate API call
    setTimeout(() => {
      setProducts(prev => prev.filter(product => !selectedProducts.includes(product.id)));
      setSelectedProducts([]);
      setIsDeleting(false);
      alert(`Successfully deleted ${selectedProducts.length} product(s)`);
    }, 1500);
  };

  const handleLogout = () => {
    navigate('/admin-login');
  };

  return (
    <div className="admin-main-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src="/craftopia logo.png" alt="Craftopia Logo" className="sidebar-logo-img" />
          <h2>Craftopia</h2>
        </div>

        <nav className="sidebar-nav">
          <Link to="/admin"><FiHome className="sidebar-icon"/> Dashboard</Link>
          <Link to="/admin-add-product"><FiPlus className="sidebar-icon"/> Add Product</Link>
          <Link to="/admin-update-product"><FiEdit className="sidebar-icon"/> Update Product</Link>
          <Link to="/admin-delete-product" className="active"><FiTrash2 className="sidebar-icon"/> Delete Product</Link>
          <Link to="/admin-view-orders"><FiEye className="sidebar-icon"/> View Orders</Link>
          <Link to="/admin-manage-orders"><FiPackage className="sidebar-icon"/> Manage Orders</Link>
          <Link to="/admin-delivery-status"><FiTruck className="sidebar-icon"/> Delivery Status</Link>
          <Link to="/admin-customer-feedback"><FiMessageCircle className="sidebar-icon"/> Customer Feedback</Link>
          <Link to="/admin-sales-report"><FiBarChart2 className="sidebar-icon"/> Sales Report</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="main-header">
          <h1>Delete Products</h1>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </header>

        {/* Search and Controls */}
        <section className="controls-section">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search products by name, category, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="actions-bar">
            <div className="selection-info">
              <span>{selectedProducts.length} product(s) selected</span>
            </div>
            <div className="action-buttons">
              <button
                className="select-all-btn"
                onClick={selectAllProducts}
              >
                {selectedProducts.length === filteredProducts.length ? 'Deselect All' : 'Select All'}
              </button>
              <button
                className="delete-btn"
                onClick={handleDelete}
                disabled={selectedProducts.length === 0 || isDeleting}
              >
                {isDeleting ? 'Deleting...' : `Delete Selected (${selectedProducts.length})`}
              </button>
            </div>
          </div>
        </section>

        {/* Products List */}
        <section className="products-section">
          <div className="products-header">
            <h2>Products ({filteredProducts.length})</h2>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="no-products">
              <p>No products found matching your search.</p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  className={`product-card ${selectedProducts.includes(product.id) ? 'selected' : ''}`}
                  onClick={() => toggleProductSelection(product.id)}
                >
                  <div className="product-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => {}}
                    />
                  </div>
                  
                  <div className="product-image">
                    <img src={product.image} alt={product.name} />
                  </div>
                  
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-category">{product.category}</p>
                    <p className="product-description">{product.description}</p>
                    
                    <div className="product-details">
                      <span className="product-price">Rs{product.price}</span>
                      <span className="product-stock">Stock: {product.stock}</span>
                      <span className="product-date">Added: {product.createdAt}</span>
                    </div>
                  </div>

                  <div className="product-actions">
                    <button
                      className="quick-delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProducts([product.id]);
                        setTimeout(() => handleDelete(), 100);
                      }}
                      title="Delete this product"
                    >
                      <FiX />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Bulk Delete Warning */}
        {selectedProducts.length > 0 && (
          <div className="delete-warning">
            <div className="warning-content">
              <FiTrash2 className="warning-icon" />
              <div>
                <h4>Delete {selectedProducts.length} Product(s)</h4>
                <p>This action cannot be undone. All selected products will be permanently removed from the system.</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DeleteProduct;