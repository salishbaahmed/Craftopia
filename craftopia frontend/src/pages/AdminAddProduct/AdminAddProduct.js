import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminAddProduct.css';
import AdminSidebar from '../../components/AdminSideBar/AdminSideBar'
import {
  FiUpload, FiX
} from 'react-icons/fi';
import api from '../../api/axios';

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
    'Resin Keychain',
    'Resin Bookmarks',
    'Resin Coasters',
    'Resin Jewelry Boxes',
    'Resin Trays',
    'Resin Cups',
    'Resin Magnets',
    'Resin Name Plates',
    'Clay Pencil Toppers',
    'Clay Bookmarks',
    'Clay Badges',
    'Clay Keychains',
    'Clay Desk Decor',
    'Clay Photo Holders',
    'Customized Resin Keychains',
    'Customized Resin Initial Necklaces',
    'Customized Resin Bookmarks',
    'Customized Resin Trinket Boxes',
    'Custom Resin Photo Coasters',
    'Customize Resin Name Plates',
    'Customized Clay Keychains',
    'Customized Clay Initial Necklaces',
    'Customized Clay Bookmarks',
    'Customized Clay Trinket Boxes',
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

    try {
      const formDataToSend = new FormData();

      // Append all text fields
      Object.keys(formData).forEach(key => {
        if (key === 'limitedEdition') {
          formDataToSend.append(key, formData[key]);
        } else if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append images
      images.forEach(img => {
        if (img.file) {
          formDataToSend.append('images', img.file);
        }
      });

      await api.post('/products', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Product added successfully!');
      navigate('/admin');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    navigate('/admin-login');
  };

  return (
    <div className="admin-main-container">
      {/* Sidebar */}
      <AdminSidebar />

      <main className="main-content1">
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
