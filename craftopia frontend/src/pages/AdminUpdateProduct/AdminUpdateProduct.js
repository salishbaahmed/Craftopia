import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminUpdateProduct.css';
import {
  FiHome, FiPlus, FiEdit, FiTrash2, FiEye,
  FiPackage, FiTruck, FiMessageCircle, FiBarChart2,
  FiSearch, FiSave, FiX, FiUpload
} from 'react-icons/fi';

const AdminUpdateProduct = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Handmade Ceramic Mug',
      category: 'Pottery & Ceramics',
      price: 2599,
      stock: 15,
      images: ['/images/placeholder-product.png'],
      description: 'Beautiful hand-painted ceramic mug with unique patterns',
      materials: 'Clay, Glaze',
      dimensions: '4x4x6 inches',
      weight: '0.4',
      careInstructions: 'Hand wash only. Do not microwave.',
      tags: 'ceramic, mug, handmade, painted',
      artistStory: 'Made by artisan Ayesha, blending modern art with traditional pottery.',
      limitedEdition: true,
      launchDate: '2024-05-12'
    },
    {
      id: 2,
      name: 'Wooden Jewelry Box',
      category: 'Woodworking',
      price: 4550,
      stock: 8,
      images: ['/api/placeholder/200/200'],
      description: 'Handcrafted jewelry box with intricate carvings',
      materials: 'Oak Wood, Brass',
      dimensions: '8x6x4 inches',
      weight: '1.2',
      careInstructions: 'Dust with dry cloth. Avoid moisture.',
      tags: 'wood, jewelry box, handcrafted, carved',
      artistStory: 'Crafted by Bilal who has 15 years of woodworking experience.',
      limitedEdition: false,
      launchDate: ''
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    materials: '',
    dimensions: '',
    weight: '',
    careInstructions: '',
    tags: '',
    artistStory: '',
    limitedEdition: false,
    launchDate: ''
  });

  const [images, setImages] = useState([]);

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

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setIsEditing(false);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      materials: product.materials,
      dimensions: product.dimensions,
      weight: product.weight,
      careInstructions: product.careInstructions,
      tags: product.tags,
      artistStory: product.artistStory || '',
      limitedEdition: product.limitedEdition || false,
      launchDate: product.launchDate || ''
    });
    setImages(product.images.map((img, index) => ({
      id: index,
      url: img,
      isExisting: true
    })));
  };

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
      preview: URL.createObjectURL(file),
      isExisting: false
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleSave = () => {
    if (!selectedProduct) return;
    setIsSaving(true);

    setTimeout(() => {
      const updatedProducts = products.map(p =>
        p.id === selectedProduct.id
          ? {
              ...p,
              ...formData,
              price: parseInt(formData.price),
              stock: parseInt(formData.stock),
              images: images.map(img => img.isExisting ? img.url : img.preview)
            }
          : p
      );
      setProducts(updatedProducts);
      setSelectedProduct(updatedProducts.find(p => p.id === selectedProduct.id));
      setIsEditing(false);
      setIsSaving(false);
      alert('Product updated successfully!');
    }, 1500);
  };

  const handleCancel = () => {
    if (selectedProduct) handleProductSelect(selectedProduct);
    setIsEditing(false);
  };

  const handleLogout = () => navigate('/admin-login');

  return (
    <div className="admin-main-container">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src="/craftopia logo.png" alt="Craftopia Logo" className="sidebar-logo-img" />
          <h2>Craftopia</h2>
        </div>

        <nav className="sidebar-nav">
          <Link to="/admin"><FiHome className="sidebar-icon" /> Dashboard</Link>
          <Link to="/admin-add-product"><FiPlus className="sidebar-icon" /> Add Product</Link>
          <Link to="/admin-update-product" className="active"><FiEdit className="sidebar-icon" /> Update Product</Link>
          <Link to="/admin-delete-product"><FiTrash2 className="sidebar-icon" /> Delete Product</Link>
          <Link to="/admin-view-orders"><FiEye className="sidebar-icon" /> View Orders</Link>
          <Link to="/admin-manage-orders"><FiPackage className="sidebar-icon" /> Manage Orders</Link>
          <Link to="/admin-delivery-status"><FiTruck className="sidebar-icon" /> Delivery Status</Link>
          <Link to="/admin-customer-feedback"><FiMessageCircle className="sidebar-icon" /> Customer Feedback</Link>
          <Link to="/admin-sales-report"><FiBarChart2 className="sidebar-icon" /> Sales Report</Link>
        </nav>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <h1>Update Products</h1>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </header>

        <div className="update-product-layout">
          <section className="products-list-section">
            <div className="search-box">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search products to update..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="products-list">
              <h3>Select Product to Update ({filteredProducts.length})</h3>
              {filteredProducts.length === 0 ? (
                <div className="no-products">
                  <p>No products found matching your search.</p>
                </div>
              ) : (
                <div className="products-grid">
                  {filteredProducts.map(product => (
                    <div
                      key={product.id}
                      className={`product-item ${selectedProduct?.id === product.id ? 'selected' : ''}`}
                      onClick={() => handleProductSelect(product)}
                    >
                      <div className="product-item-image">
                        <img src={product.images[0]} alt={product.name} />
                      </div>
                      <div className="product-item-info">
                        <h4>{product.name}</h4>
                        <p className="category">{product.category}</p>
                        <p className="price">Rs {product.price}</p>
                        <p className="stock">Stock: {product.stock}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="edit-form-section">
            {!selectedProduct ? (
              <div className="no-selection">
                <FiEdit className="no-selection-icon" />
                <h3>Select a product to update</h3>
                <p>Choose a product from the list to edit its details</p>
              </div>
            ) : (
              <div className="edit-form-container">
                <div className="form-header">
                  <h2>Edit Product</h2>
                  {!isEditing ? (
                    <button className="edit-btn" onClick={() => setIsEditing(true)}>
                      <FiEdit /> Edit Product
                    </button>
                  ) : (
                    <div className="form-actions-header">
                      <button className="cancel-btn" onClick={handleCancel} disabled={isSaving}>
                        <FiX /> Cancel
                      </button>
                      <button className="save-btn" onClick={handleSave} disabled={isSaving}>
                        <FiSave /> {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  )}
                </div>

                <div className="product-form">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Product Name</label>
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} disabled={!isEditing} />
                    </div>

                    <div className="form-group">
                      <label>Category</label>
                      <select name="category" value={formData.category} onChange={handleInputChange} disabled={!isEditing}>
                        <option value="">Select a category</option>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Price (Rs)</label>
                      <input type="number" name="price" value={formData.price} onChange={handleInputChange} disabled={!isEditing} />
                    </div>

                    <div className="form-group">
                      <label>Stock Quantity</label>
                      <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} disabled={!isEditing} />
                    </div>

                    <div className="form-group full-width">
                      <label>Description</label>
                      <textarea name="description" value={formData.description} onChange={handleInputChange} disabled={!isEditing} rows="3" />
                    </div>

                    <div className="form-group full-width">
                      <label>Materials Used</label>
                      <input type="text" name="materials" value={formData.materials} onChange={handleInputChange} disabled={!isEditing} />
                    </div>

                    <div className="form-group">
                      <label>Dimensions</label>
                      <input type="text" name="dimensions" value={formData.dimensions} onChange={handleInputChange} disabled={!isEditing} />
                    </div>

                    <div className="form-group">
                      <label>Weight (kg)</label>
                      <input type="number" name="weight" value={formData.weight} onChange={handleInputChange} disabled={!isEditing} />
                    </div>

                    <div className="form-group full-width">
                      <label>Care Instructions</label>
                      <textarea name="careInstructions" value={formData.careInstructions} onChange={handleInputChange} disabled={!isEditing} />
                    </div>

                    <div className="form-group full-width">
                      <label>Tags</label>
                      <input type="text" name="tags" value={formData.tags} onChange={handleInputChange} disabled={!isEditing} />
                    </div>

                    <div className="form-group full-width">
                      <label>Artist Story / Biography</label>
                      <textarea
                        name="artistStory"
                        value={formData.artistStory}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        rows="3"
                        placeholder="Share the background or story of the artist..."
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>
                        <input
                          type="checkbox"
                          name="limitedEdition"
                          checked={formData.limitedEdition}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        /> Limited Edition
                      </label>
                    </div>

                    {formData.limitedEdition && (
                      <div className="form-group">
                        <label>Launch Date</label>
                        <input
                          type="date"
                          name="launchDate"
                          value={formData.launchDate}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                    )}
                  </div>

                  <div className="image-management">
                    <label>Product Images</label>
                    <div className="images-section">
                      {isEditing && (
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
                            <span>Add More Images</span>
                            <small>Max 5 images total</small>
                          </label>
                        </div>
                      )}

                      <div className="image-preview-grid">
                        {images.map(img => (
                          <div key={img.id} className="image-preview">
                            <img src={img.preview || img.url} alt="Preview" />
                            {isEditing && (
                              <button className="remove-image-btn" onClick={() => removeImage(img.id)}>
                                <FiX />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminUpdateProduct;
