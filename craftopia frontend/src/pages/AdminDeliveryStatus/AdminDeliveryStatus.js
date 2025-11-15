import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminDeliveryStatus.css';
import { 
  FiHome, FiPlus, FiEdit, FiTrash2, FiEye,
  FiPackage, FiTruck, FiMessageCircle, FiBarChart2,
  FiSearch, FiSave, FiCheck, FiClock, FiMapPin
} from 'react-icons/fi';

const AdminDeliveryStatus = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [orders, setOrders] = useState([
    {
      id: 'ORD-1001',
      customerName: 'Ali Raza',
      customerEmail: 'ali.raza@email.com',
      customerPhone: '+92-300-1234567',
      orderDate: '2024-03-15',
      status: 'approved',
      deliveryStatus: 'delivered',
      totalAmount: 12500,
      items: [
        { id: 1, name: 'Handmade Ceramic Vase', quantity: 1, price: 8500 },
        { id: 2, name: 'Embroidered Shawl', quantity: 2, price: 2000 }
      ],
      shippingAddress: {
        street: 'House 123, Street 5',
        area: 'Gulberg',
        city: 'Lahore',
        province: 'Punjab',
        zipCode: '54000'
      },
      paymentMethod: 'Bank Transfer',
      estimatedDelivery: '2024-03-22',
      deliveryDate: '2024-03-20',
      deliveryHistory: [
        { status: 'ordered', date: '2024-03-15', time: '14:30' },
        { status: 'processing', date: '2024-03-16', time: '09:15' },
        { status: 'shipped', date: '2024-03-18', time: '14:30' },
        { status: 'out-for-delivery', date: '2024-03-20', time: '08:45' },
        { status: 'delivered', date: '2024-03-20', time: '14:15' }
      ]
    },
    {
      id: 'ORD-1002',
      customerName: 'Fatima Noor',
      customerEmail: 'fatima.noor@email.com',
      customerPhone: '+92-301-2345678',
      orderDate: '2024-03-14',
      status: 'approved',
      deliveryStatus: 'processing',
      totalAmount: 8500,
      items: [
        { id: 3, name: 'Painted Vase', quantity: 1, price: 8500 }
      ],
      shippingAddress: {
        street: 'Flat 5B, Tariq Road',
        city: 'Karachi',
        province: 'Sindh',
        zipCode: '75500'
      },
      paymentMethod: 'Cash on Delivery',
      estimatedDelivery: '2024-03-21',
      deliveryHistory: [
        { status: 'ordered', date: '2024-03-14', time: '11:20' },
        { status: 'processing', date: '2024-03-15', time: '10:45' }
      ]
    },
    {
      id: 'ORD-1003',
      customerName: 'Bilal Ahmad',
      customerEmail: 'bilal.ahmad@email.com',
      customerPhone: '+92-302-3456789',
      orderDate: '2024-03-13',
      status: 'approved',
      deliveryStatus: 'shipped',
      totalAmount: 15600,
      items: [
        { id: 4, name: 'Leather Wallet', quantity: 1, price: 5600 },
        { id: 5, name: 'Wooden Jewelry Box', quantity: 2, price: 5000 }
      ],
      shippingAddress: {
        street: 'Street 7, G-11/3',
        city: 'Islamabad',
        province: 'Islamabad Capital Territory',
        zipCode: '44000'
      },
      paymentMethod: 'JazzCash',
      estimatedDelivery: '2024-03-19',
      deliveryHistory: [
        { status: 'ordered', date: '2024-03-13', time: '16:45' },
        { status: 'processing', date: '2024-03-14', time: '08:30' },
        { status: 'shipped', date: '2024-03-16', time: '11:15' }
      ]
    }
  ]);

  const [selectedStatus, setSelectedStatus] = useState('');

  const deliveryStatuses = [
    { value: 'processing', label: 'Processing', description: 'Order is being prepared for shipment' },
    { value: 'shipped', label: 'Shipped', description: 'Order has been shipped to customer' },
    { value: 'out-for-delivery', label: 'Out for Delivery', description: 'Order is out for delivery today' },
    { value: 'delivered', label: 'Delivered', description: 'Order has been successfully delivered' },
    { value: 'delayed', label: 'Delayed', description: 'Delivery is delayed due to unforeseen circumstances' }
  ];

  const filteredOrders = orders.filter(order =>
    order.status === 'approved' && (
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
    setSelectedStatus(order.deliveryStatus);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      processing: { class: 'status-processing', label: 'Processing', icon: <FiClock /> },
      shipped: { class: 'status-shipped', label: 'Shipped', icon: <FiTruck /> },
      'out-for-delivery': { class: 'status-out-for-delivery', label: 'Out for Delivery', icon: <FiMapPin /> },
      delivered: { class: 'status-delivered', label: 'Delivered', icon: <FiCheck /> },
      delayed: { class: 'status-delayed', label: 'Delayed', icon: <FiClock /> }
    };
    
    const config = statusConfig[status] || statusConfig.processing;
    return (
      <span className={`status-badge ${config.class}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  const getNextStatusOptions = (currentStatus) => {
    const statusFlow = {
      processing: ['shipped', 'delayed'],
      shipped: ['out-for-delivery', 'delayed'],
      'out-for-delivery': ['delivered', 'delayed'],
      delivered: [],
      delayed: ['shipped', 'out-for-delivery']
    };
    
    return deliveryStatuses.filter(status => 
      statusFlow[currentStatus]?.includes(status.value)
    );
  };

  const updateDeliveryStatus = async () => {
    if (!selectedOrder) {
      alert('Please select an order to update.');
      return;
    }

    if (!selectedStatus || selectedStatus === selectedOrder.deliveryStatus) {
      alert('Please select a new status to update.');
      return;
    }

    setIsUpdating(true);
    
    setTimeout(() => {
      const currentDateTime = new Date();
      const newHistoryEntry = {
        status: selectedStatus,
        date: currentDateTime.toISOString().split('T')[0],
        time: currentDateTime.toTimeString().split(' ')[0].substring(0, 5)
      };

      const updatedOrders = orders.map(order =>
        order.id === selectedOrder.id
          ? { 
              ...order, 
              deliveryStatus: selectedStatus,
              deliveryHistory: [...order.deliveryHistory, newHistoryEntry],
              ...(selectedStatus === 'delivered' && { 
                deliveryDate: currentDateTime.toISOString().split('T')[0] 
              })
            }
          : order
      );
      
      setOrders(updatedOrders);
      setSelectedOrder(updatedOrders.find(order => order.id === selectedOrder.id));
      setIsUpdating(false);
      
      alert(`Delivery status for order ${selectedOrder.id} has been updated to ${selectedStatus}. Customer will be notified.`);
      console.log(`Notification sent to ${selectedOrder.customerEmail}: Your order ${selectedOrder.id} delivery status has been updated to ${selectedStatus}.`);
    }, 1500);
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
          <Link to="/admin-add-product"><FiPlus className="sidebar-icon"/> Add Product</Link>
          <Link to="/admin-update-product"><FiEdit className="sidebar-icon"/> Update Product</Link>
          <Link to="/admin-delete-product"><FiTrash2 className="sidebar-icon"/> Delete Product</Link>
          <Link to="/admin-view-orders"><FiEye className="sidebar-icon"/> View Orders</Link>
          <Link to="/admin-manage-orders"><FiPackage className="sidebar-icon"/> Manage Orders</Link>
          <Link to="/admin-delivery-status" className="active"><FiTruck className="sidebar-icon"/> Delivery Status</Link>
          <Link to="/admin-customer-feedback"><FiMessageCircle className="sidebar-icon"/> Customer Feedback</Link>
          <Link to="/admin-sales-report"><FiBarChart2 className="sidebar-icon"/> Sales Report</Link>
        </nav>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <h1>Update Delivery Status</h1>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </header>

        <div className="delivery-status-layout">
          <section className="orders-list-section">
            <div className="search-box">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search approved orders by ID or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="orders-list">
              <h3>Approved Orders ({filteredOrders.length})</h3>
              {filteredOrders.length === 0 ? (
                <div className="no-orders">
                  <p>No approved orders found matching your search.</p>
                </div>
              ) : (
                <div className="orders-grid">
                  {filteredOrders.map(order => (
                    <div
                      key={order.id}
                      className={`order-item ${selectedOrder?.id === order.id ? 'selected' : ''}`}
                      onClick={() => handleOrderSelect(order)}
                    >
                      <div className="order-header">
                        <span className="order-id">{order.id}</span>
                        {getStatusBadge(order.deliveryStatus)}
                      </div>
                      <div className="order-customer">
                        <strong>{order.customerName}</strong>
                        <span className="customer-email">{order.customerEmail}</span>
                      </div>
                      <div className="order-details">
                        <span className="order-amount">Rs {order.totalAmount.toLocaleString()}</span>
                      </div>
                      <div className="delivery-info">
                        <span className="estimated-delivery">
                          Est: {order.estimatedDelivery}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="status-update-section">
            {!selectedOrder ? (
              <div className="no-selection">
                <FiTruck className="no-selection-icon" />
                <h3>Select an order to update delivery status</h3>
                <p>Choose an approved order from the list to update its delivery status</p>
              </div>
            ) : (
              <div className="status-update-container">
                <div className="order-header-details">
                  <h2>Update Delivery Status</h2>
                  <div className="current-status-display">
                    {getStatusBadge(selectedOrder.deliveryStatus)}
                  </div>
                </div>

                <div className="order-info-grid">
                  <div className="info-group">
                    <label>Order ID</label>
                    <p>{selectedOrder.id}</p>
                  </div>
                  <div className="info-group">
                    <label>Customer Name</label>
                    <p>{selectedOrder.customerName}</p>
                  </div>
                  <div className="info-group">
                    <label>Customer Phone</label>
                    <p>{selectedOrder.customerPhone}</p>
                  </div>
                  <div className="info-group">
                    <label>Estimated Delivery</label>
                    <p>{selectedOrder.estimatedDelivery}</p>
                  </div>
                  {selectedOrder.deliveryDate && (
                    <div className="info-group">
                      <label>Actual Delivery</label>
                      <p className="delivered-date">{selectedOrder.deliveryDate}</p>
                    </div>
                  )}
                </div>

                <div className="shipping-address-section">
                  <h4>Shipping Address</h4>
                  <div className="address-details">
                    <p>{selectedOrder.shippingAddress.street}</p>
                    <p>{selectedOrder.shippingAddress.area}</p>
                    <p>
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.province} {selectedOrder.shippingAddress.zipCode}
                    </p>
                  </div>
                </div>

                <div className="delivery-history-section">
                  <h4>Delivery History</h4>
                  <div className="history-timeline">
                    {selectedOrder.deliveryHistory.map((history, index) => (
                      <div key={index} className="history-item">
                        <div className="history-status">
                          {getStatusBadge(history.status)}
                        </div>
                        <div className="history-datetime">
                          {history.date} at {history.time}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="status-update-form">
                  <h4>Update Delivery Status</h4>
                  <div className="form-group">
                    <label>Current Status</label>
                    <div className="current-status">
                      {getStatusBadge(selectedOrder.deliveryStatus)}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Update to New Status</label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="status-select"
                    >
                      <option value="">Select new status...</option>
                      {getNextStatusOptions(selectedOrder.deliveryStatus).map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label} - {status.description}
                        </option>
                      ))}
                    </select>
                    <small className="status-help">
                      Only valid next status options are shown based on current status.
                    </small>
                  </div>

                  <div className="update-actions">
                    <button
                      className="update-btn"
                      onClick={updateDeliveryStatus}
                      disabled={!selectedStatus || selectedStatus === selectedOrder.deliveryStatus || isUpdating}
                    >
                      <FiSave />
                      {isUpdating ? 'Updating...' : 'Update Delivery Status'}
                    </button>
                  </div>

                  {isUpdating && (
                    <div className="update-notice">
                      <p>Updating delivery status and notifying customer...</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminDeliveryStatus;
