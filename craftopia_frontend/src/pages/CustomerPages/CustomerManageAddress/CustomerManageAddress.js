// CustomerManageAddress.js
import React, { useState, useEffect } from 'react';
import { FiMapPin, FiPlus, FiEdit2, FiTrash2, FiCheck, FiHome, FiBriefcase } from 'react-icons/fi';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';
import './CustomerManageAddress.css';
import api from '../../../api/axios';

const CustomerManageAddress = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAddress, setNewAddress] = useState({
    type: 'home',
    name: '',
    street: '',
    city: '',
    province: 'Punjab',
    zipCode: '',
    phone: '',
    isDefault: false
  });

  const provinces = ['Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 'Gilgit-Baltistan', 'Azad Kashmir'];

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/addresses');
      
      // Transform backend addresses to frontend format
      const transformedAddresses = response.data.map((addr, index) => ({
        id: index + 1,
        type: 'home', // You might want to add type to backend model
        name: addr.name || '',
        street: addr.street,
        city: addr.city,
        province: addr.state,
        zipCode: addr.zipCode,
        phone: addr.phone || '',
        isDefault: addr.isDefault
      }));
      
      setAddresses(transformedAddresses);
    } catch (err) {
      console.error('Error fetching addresses:', err);
      // If no addresses exist yet, that's okay
      if (err.response?.status !== 404) {
        alert('Failed to load addresses');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (editingAddress) {
      setEditingAddress(prev => ({ ...prev, [field]: value }));
    } else {
      setNewAddress(prev => ({ ...prev, [field]: value }));
    }
  };

  // Add new address
  const handleAddAddress = async () => {
    if (!newAddress.name || !newAddress.street || !newAddress.city || !newAddress.phone) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await api.post('/users/addresses', {
        name: newAddress.name,
        street: newAddress.street,
        city: newAddress.city,
        state: newAddress.province,
        zipCode: newAddress.zipCode,
        phone: newAddress.phone,
        country: 'Pakistan',
        isDefault: newAddress.isDefault || addresses.length === 0
      });

      // Refresh addresses list
      await fetchAddresses();

      // Reset form
      setNewAddress({
        type: 'home',
        name: '',
        street: '',
        city: '',
        province: 'Punjab',
        zipCode: '',
        phone: '',
        isDefault: false
      });
      setShowAddForm(false);
      alert('Address saved successfully!');
    } catch (error) {
      console.error('Error saving address:', error);
      alert(error.response?.data?.detail || 'Failed to save address');
    }
  };

  // Update existing address
  const handleUpdateAddress = async () => {
    if (!editingAddress.name || !editingAddress.street || !editingAddress.city || !editingAddress.phone) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await api.put(`/users/addresses/${editingAddress.id}`, {
        name: editingAddress.name,
        street: editingAddress.street,
        city: editingAddress.city,
        state: editingAddress.province,
        zipCode: editingAddress.zipCode,
        phone: editingAddress.phone,
        country: 'Pakistan',
        isDefault: editingAddress.isDefault
      });

      // Refresh addresses list
      await fetchAddresses();
      setEditingAddress(null);
      alert('Address updated successfully!');
    } catch (error) {
      console.error('Error updating address:', error);
      alert(error.response?.data?.detail || 'Failed to update address');
    }
  };

  // Delete address
  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      await api.delete(`/users/addresses/${addressId}`);
      
      // Refresh addresses list
      await fetchAddresses();
      alert('Address deleted successfully!');
    } catch (error) {
      console.error('Error deleting address:', error);
      alert(error.response?.data?.detail || 'Failed to delete address');
    }
  };

  // Set default address
  const handleSetDefault = async (addressId) => {
    const addr = addresses.find(a => a.id === addressId);
    if (!addr) return;

    try {
      await api.put(`/users/addresses/${addressId}/default`);
      
      // Refresh addresses list
      await fetchAddresses();
      alert('Default address updated successfully!');
    } catch (error) {
      console.error('Error setting default address:', error);
      alert(error.response?.data?.detail || 'Failed to update default address');
    }
  };

  // Start editing address
  const handleEditAddress = (address) => {
    setEditingAddress({ ...address });
    setShowAddForm(false);
  };

  // Cancel forms
  const handleCancel = () => {
    setShowAddForm(false);
    setEditingAddress(null);
    setNewAddress({
      type: 'home',
      name: '',
      street: '',
      city: '',
      province: 'Punjab',
      zipCode: '',
      phone: '',
      isDefault: false
    });
  };

  // Get address type icon
  const getAddressTypeIcon = (type) => {
    switch (type) {
      case 'home':
        return <FiHome className="customermanageaddress-type-icon" />;
      case 'work':
        return <FiBriefcase className="customermanageaddress-type-icon" />;
      default:
        return <FiMapPin className="customermanageaddress-type-icon" />;
    }
  };

  // Get address type label
  const getAddressTypeLabel = (type) => {
    switch (type) {
      case 'home':
        return 'Home';
      case 'work':
        return 'Work';
      default:
        return 'Other';
    }
  };

  if (loading) {
    return (
      <div className="customermanageaddress">
        <Navbar />
        <div className="customermanageaddress-container">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p>Loading addresses...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="customermanageaddress">
      <Navbar />

      <div className="customermanageaddress-container">
        {/* Page Header */}
        <div className="customermanageaddress-header">
          <h1 className="customermanageaddress-page-title">Manage Addresses</h1>
          <p className="customermanageaddress-page-subtitle">Add, edit, and manage your delivery addresses</p>
        </div>

        {/* Add New Address Button */}
        <div className="customermanageaddress-actions">
          <button
            className="customermanageaddress-add-btn"
            onClick={() => setShowAddForm(true)}
            disabled={showAddForm || editingAddress}
          >
            <FiPlus className="customermanageaddress-add-icon" />
            Add New Address
          </button>
        </div>

        {/* Add/Edit Address Form */}
        {(showAddForm || editingAddress) && (
          <div className="customermanageaddress-form-card">
            <div className="customermanageaddress-form-header">
              <h3 className="customermanageaddress-form-title">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h3>
            </div>

            <div className="customermanageaddress-form-content">
              <div className="customermanageaddress-form-grid">
                {/* Address Type */}
                <div className="customermanageaddress-form-group">
                  <label className="customermanageaddress-form-label">Address Type</label>
                  <select
                    className="customermanageaddress-form-input"
                    value={editingAddress ? editingAddress.type : newAddress.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                  >
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Full Name */}
                <div className="customermanageaddress-form-group">
                  <label className="customermanageaddress-form-label">Full Name *</label>
                  <input
                    type="text"
                    className="customermanageaddress-form-input"
                    placeholder="Enter full name"
                    value={editingAddress ? editingAddress.name : newAddress.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>

                {/* Street Address */}
                <div className="customermanageaddress-form-group customermanageaddress-full-width">
                  <label className="customermanageaddress-form-label">Street Address *</label>
                  <input
                    type="text"
                    className="customermanageaddress-form-input"
                    placeholder="House number, street, area"
                    value={editingAddress ? editingAddress.street : newAddress.street}
                    onChange={(e) => handleInputChange('street', e.target.value)}
                  />
                </div>

                {/* City */}
                <div className="customermanageaddress-form-group">
                  <label className="customermanageaddress-form-label">City *</label>
                  <input
                    type="text"
                    className="customermanageaddress-form-input"
                    placeholder="Enter city"
                    value={editingAddress ? editingAddress.city : newAddress.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                  />
                </div>

                {/* Province */}
                <div className="customermanageaddress-form-group">
                  <label className="customermanageaddress-form-label">Province *</label>
                  <select
                    className="customermanageaddress-form-input"
                    value={editingAddress ? editingAddress.province : newAddress.province}
                    onChange={(e) => handleInputChange('province', e.target.value)}
                  >
                    {provinces.map(province => (
                      <option key={province} value={province}>{province}</option>
                    ))}
                  </select>
                </div>

                {/* Zip Code */}
                <div className="customermanageaddress-form-group">
                  <label className="customermanageaddress-form-label">Zip Code</label>
                  <input
                    type="text"
                    className="customermanageaddress-form-input"
                    placeholder="Enter zip code"
                    value={editingAddress ? editingAddress.zipCode : newAddress.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  />
                </div>

                {/* Phone Number */}
                <div className="customermanageaddress-form-group customermanageaddress-full-width">
                  <label className="customermanageaddress-form-label">Phone Number *</label>
                  <input
                    type="tel"
                    className="customermanageaddress-form-input"
                    placeholder="+92 300 1234567"
                    value={editingAddress ? editingAddress.phone : newAddress.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>

                {/* Set as Default */}
                <div className="customermanageaddress-form-group customermanageaddress-full-width">
                  <label className="customermanageaddress-checkbox-label">
                    <input
                      type="checkbox"
                      className="customermanageaddress-checkbox"
                      checked={editingAddress ? editingAddress.isDefault : newAddress.isDefault}
                      onChange={(e) => handleInputChange('isDefault', e.target.checked)}
                    />
                    <span className="customermanageaddress-checkbox-custom"></span>
                    Set as default address
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="customermanageaddress-form-actions">
                <button
                  className="customermanageaddress-cancel-btn"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  className="customermanageaddress-save-btn"
                  onClick={editingAddress ? handleUpdateAddress : handleAddAddress}
                >
                  {editingAddress ? 'Update Address' : 'Save Address'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Addresses List */}
        <div className="customermanageaddress-list">
          {addresses.map((address) => (
            <div key={address.id} className="customermanageaddress-card">
              {/* Address Header */}
              <div className="customermanageaddress-card-header">
                <div className="customermanageaddress-type">
                  {getAddressTypeIcon(address.type)}
                  <span className="customermanageaddress-type-label">
                    {getAddressTypeLabel(address.type)}
                  </span>
                  {address.isDefault && (
                    <span className="customermanageaddress-default-badge">
                      <FiCheck className="customermanageaddress-default-icon" />
                      Default
                    </span>
                  )}
                </div>

                <div className="customermanageaddress-card-actions">
                  <button
                    className="customermanageaddress-edit-btn"
                    onClick={() => handleEditAddress(address)}
                    disabled={showAddForm || editingAddress}
                  >
                    <FiEdit2 className="customermanageaddress-action-icon" />
                    Edit
                  </button>
                  {!address.isDefault && (
                    <button
                      className="customermanageaddress-delete-btn"
                      onClick={() => handleDeleteAddress(address.id)}
                      disabled={showAddForm || editingAddress}
                    >
                      <FiTrash2 className="customermanageaddress-action-icon" />
                      Delete
                    </button>
                  )}
                </div>
              </div>

              {/* Address Details */}
              <div className="customermanageaddress-card-content">
                <p className="customermanageaddress-name">{address.name}</p>
                <p className="customermanageaddress-street">{address.street}</p>
                <p className="customermanageaddress-city">
                  {address.city}, {address.province} {address.zipCode}
                </p>
                <p className="customermanageaddress-phone">Phone: {address.phone}</p>
              </div>

              {/* Set Default Button */}
              {!address.isDefault && (
                <div className="customermanageaddress-card-footer">
                  <button
                    className="customermanageaddress-set-default-btn"
                    onClick={() => handleSetDefault(address.id)}
                    disabled={showAddForm || editingAddress}
                  >
                    Set as Default
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {addresses.length === 0 && !showAddForm && (
          <div className="customermanageaddress-empty">
            <FiMapPin className="customermanageaddress-empty-icon" />
            <h3 className="customermanageaddress-empty-title">No Addresses Added</h3>
            <p className="customermanageaddress-empty-text">
              You haven't added any addresses yet. Add your first address to get started.
            </p>
            <button
              className="customermanageaddress-empty-btn"
              onClick={() => setShowAddForm(true)}
            >
              Add Your First Address
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CustomerManageAddress;