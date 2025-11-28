import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDeleteProduct.css';
import AdminSidebar from '../../components/AdminSideBar/AdminSideBar'
import {
  FiTrash2,
  FiSearch, FiX
} from 'react-icons/fi';
import api from '../../api/axios';

const DeleteProduct = () => {
  const navigate = useNavigate();
  const [searchTerm1, setSearchTerm1] = useState('');
  const [selectedProducts1, setSelectedProducts1] = useState([]);
  const [isDeleting1, setIsDeleting1] = useState(false);

  const [products1, setProducts1] = useState([]);

  // Derived state for filtered products
  const filteredProducts1 = products1.filter(product =>
    product.name.toLowerCase().includes(searchTerm1.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm1.toLowerCase())
  );

  const toggleProductSelection1 = (productId) => {
    setSelectedProducts1(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const selectAllProducts1 = () => {
    if (selectedProducts1.length === filteredProducts1.length) {
      setSelectedProducts1([]);
    } else {
      setSelectedProducts1(filteredProducts1.map(p => p.id));
    }
  };



  // ...

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts1(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setProducts1([]);
      }
    };
    fetchProducts();
  }, []);

  // ...

  const handleDelete1 = async () => {
    if (selectedProducts1.length === 0) {
      alert('Please select at least one product to delete');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedProducts1.length} product(s)? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting1(true);

    try {
      // Delete products one by one (or use a bulk delete endpoint if available)
      // Since we defined DELETE /api/products/{id}, we'll loop through them.
      await Promise.all(selectedProducts1.map(id => api.delete(`/products/${id}`)));

      const updated = products1.filter(product => !selectedProducts1.includes(product.id));
      setProducts1(updated);
      setSelectedProducts1([]);
      alert(`Successfully deleted ${selectedProducts1.length} product(s)`);
    } catch (error) {
      console.error('Error deleting products:', error);
      alert('Failed to delete some products. Please try again.');
    } finally {
      setIsDeleting1(false);
    }
  };

  const handleLogout1 = () => {
    navigate('/admin-login');
  };

  return (
    <div className="admin-main-container1">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="main-content1">
        <header className="main-header1">
          <h1>Delete Products</h1>
          <button className="logout-btn1" onClick={handleLogout1}>Logout</button>
        </header>

        {/* Search and Controls */}
        <section className="controls-section1">
          <div className="search-box1">
            <FiSearch className="search-icon1" />
            <input
              type="text"
              placeholder="Search products by name, category, or description..."
              value={searchTerm1}
              onChange={(e) => setSearchTerm1(e.target.value)}
              className="search-input1"
            />
          </div>

          <div className="actions-bar1">
            <div className="selection-info1">
              <span>{selectedProducts1.length} product(s) selected</span>
            </div>
            <div className="action-buttons1">
              <button
                className="select-all-btn1"
                onClick={selectAllProducts1}
              >
                {selectedProducts1.length === filteredProducts1.length ? 'Deselect All' : 'Select All'}
              </button>
              <button
                className="delete-btn1"
                onClick={handleDelete1}
                disabled={selectedProducts1.length === 0 || isDeleting1}
              >
                {isDeleting1 ? 'Deleting...' : `Delete Selected (${selectedProducts1.length})`}
              </button>
            </div>
          </div>
        </section>

        {/* Products List */}
        <section className="products-section1">
          <div className="products-header1">
            <h2>Products ({filteredProducts1.length})</h2>
          </div>

          {filteredProducts1.length === 0 ? (
            <div className="no-products1">
              <p>No products found matching your search.</p>
            </div>
          ) : (
            <div className="products-grid1">
              {filteredProducts1.map(product => (
                <div
                  key={product.id}
                  className={`product-card1 ${selectedProducts1.includes(product.id) ? 'selected1' : ''}`}
                  onClick={() => toggleProductSelection1(product.id)}
                >
                  <div className="product-checkbox1">
                    <input
                      type="checkbox"
                      checked={selectedProducts1.includes(product.id)}
                      onChange={() => { }}
                    />
                  </div>

                  <div className="product-image1">
                    <img src={product.image} alt={product.name} />
                  </div>

                  <div className="product-info1">
                    <h3 className="product-name1">{product.name}</h3>
                    <p className="product-category1">{product.category}</p>
                    <p className="product-description1">{product.description}</p>

                    <div className="product-details1">
                      <span className="product-price1">Rs{product.price}</span>
                      <span className="product-stock1">Stock: {product.stock}</span>
                      <span className="product-date1">Added: {product.createdAt}</span>
                    </div>
                  </div>

                  <div className="product-actions1">
                    <button
                      className="quick-delete-btn1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProducts1([product.id]);
                        setTimeout(() => handleDelete1(), 100);
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
        {selectedProducts1.length > 0 && (
          <div className="delete-warning1">
            <div className="warning-content1">
              <FiTrash2 className="warning-icon1" />
              <div>
                <h4>Delete {selectedProducts1.length} Product(s)</h4>
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