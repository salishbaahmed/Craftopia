import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminAddProduct.css';
import { 
  FiHome, FiPlus, FiEdit, FiTrash2, FiEye,
  FiPackage, FiTruck, FiMessageCircle, FiBarChart2,
  FiUpload, FiX
} from 'react-icons/fi';

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    tags: '',
    materials: '',
    dimensions: '',
    weight: '',
    careInstructions: '',
    artistStory: '',
    limitedEdition: false,
    launchDate: ''
  });
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Pottery & Ceramics',
    'Jewelry & Accessories',
    'Textiles & Fabrics',
    'Woodworking',
    'Painting & Art',
    'Candles & Soaps',
    'Home Decor',
    'Paper Crafts',
    'Leather Goods',
    'Metal Crafts',
    'Knitting & Crochet',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }
    const newImages = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      console.log('Product Data:', { ...formData, images });
      alert('Product added successfully!');
      setIsSubmitting(false);
      navigate('/admin');
    }, 2000);
  };

  const handleLogout = () => {
    navigate('/admin-login');
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
          <Link to="/admin-add-product" className="active"><FiPlus className="sidebar-icon"/> Add Product</Link>
          <Link to="/admin-update-product"><FiEdit className="sidebar-icon"/> Update Product</Link>
          <Link to="/admin-delete-product"><FiTrash2 className="sidebar-icon"/> Delete Product</Link>
          <Link to="/admin-view-orders"><FiEye className="sidebar-icon"/> View Orders</Link>
          <Link to="/admin-manage-orders"><FiPackage className="sidebar-icon"/> Manage Orders</Link>
          <Link to="/admin-delivery-status"><FiTruck className="sidebar-icon"/> Delivery Status</Link>
          <Link to="/admin-customer-feedback"><FiMessageCircle className="sidebar-icon"/> Customer Feedback</Link>
          <Link to="/admin-sales-report"><FiBarChart2 className="sidebar-icon"/> Sales Report</Link>
        </nav>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <h1>Add New Product</h1>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </header>

        <section className="product-form-section">
          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Product Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter product name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="price">Price (Rs) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="1"
                  placeholder="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="stock">Stock Quantity *</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                  min="0"
                  placeholder="0"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="description">Product Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  placeholder="Describe the product, its features, and unique qualities..."
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="artistStory">Artist Story / Biography</label>
                <textarea
                  id="artistStory"
                  name="artistStory"
                  value={formData.artistStory}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Share the story of the artist or creation of this product..."
                />
              </div>

              <div className="form-group full-width">
                <label>
                  <input
                    type="checkbox"
                    name="limitedEdition"
                    checked={formData.limitedEdition}
                    onChange={handleInputChange}
                  /> Limited Edition
                </label>
              </div>

              {formData.limitedEdition && (
                <div className="form-group">
                  <label htmlFor="launchDate">Launch Date</label>
                  <input
                    type="date"
                    id="launchDate"
                    name="launchDate"
                    value={formData.launchDate}
                    onChange={handleInputChange}
                  />
                </div>
              )}

              <div className="form-group full-width">
                <label htmlFor="materials">Materials Used</label>
                <input
                  type="text"
                  id="materials"
                  name="materials"
                  value={formData.materials}
                  onChange={handleInputChange}
                  placeholder="e.g., Clay, Wood, Fabric, etc."
                />
              </div>

              <div className="form-group">
                <label htmlFor="dimensions">Dimensions</label>
                <input
                  type="text"
                  id="dimensions"
                  name="dimensions"
                  value={formData.dimensions}
                  onChange={handleInputChange}
                  placeholder="e.g., 10x5x3 inches"
                />
              </div>

              <div className="form-group">
                <label htmlFor="weight">Weight (kg)</label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  min="0"
                  step="0.1"
                  placeholder="0.0"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="careInstructions">Care Instructions</label>
                <textarea
                  id="careInstructions"
                  name="careInstructions"
                  value={formData.careInstructions}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Instructions for maintaining and cleaning the product..."
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="tags">Tags</label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="e.g., handmade, eco-friendly, vintage, custom (separate with commas)"
                />
              </div>
            </div>

            <div className="image-upload-section">
              <label>Product Images *</label>
              <div className="image-upload-area">
                <input
                  type="file"
                  id="image-upload"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="image-input"
                />
                <label htmlFor="image-upload" className="upload-label">
                  <FiUpload className="upload-icon" />
                  <span>Click to upload images</span>
                  <small>Maximum 5 images, PNG, JPG, JPEG up to 5MB each</small>
                </label>
              </div>

              {images.length > 0 && (
                <div className="image-preview-grid">
                  {images.map(image => (
                    <div key={image.id} className="image-preview">
                      <img src={image.preview} alt="Preview" />
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => removeImage(image.id)}
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate('/admin-dashboard')}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding Product...' : 'Add Product'}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default AddProduct;
