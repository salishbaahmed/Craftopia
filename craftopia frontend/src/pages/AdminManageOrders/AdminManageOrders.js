import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminManageOrders.css';
import { 
  FiHome, FiPlus, FiEdit, FiTrash2, FiEye,
  FiPackage, FiTruck, FiMessageCircle, FiBarChart2,
  FiSearch, FiCheck, FiX, FiClock
} from 'react-icons/fi';

const AdminManageOrders = () => {
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
      status: 'delivered',
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
      deliveryStatus: 'delivered'
    },
    {
      id: 'ORD-1002',
      customerName: 'Fatima Noor',
      customerEmail: 'fatima.noor@email.com',
      customerPhone: '+92-301-2345678',
      orderDate: '2024-03-14',
      status: 'pending',
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
      deliveryStatus: 'pending'
    },
    {
      id: 'ORD-1003',
      customerName: 'Bilal Ahmad',
      customerEmail: 'bilal.ahmad@email.com',
      customerPhone: '+92-302-3456789',
      orderDate: '2024-03-13',
      status: 'approved',
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
      deliveryStatus: 'processing'
    },
    {
      id: 'ORD-1004',
      customerName: 'Zainab Khan',
      customerEmail: 'zainab.khan@email.com',
      customerPhone: '+92-303-4567890',
      orderDate: '2024-03-12',
      status: 'approved',
      totalAmount: 7200,
      items: [
        { id: 6, name: 'Wool Scarf', quantity: 1, price: 3200 },
        { id: 7, name: 'Candle Set', quantity: 2, price: 2000 }
      ],
      shippingAddress: {
        street: 'Model Town, Block K',
        city: 'Lahore',
        province: 'Punjab',
        zipCode: '54000'
      },
      paymentMethod: 'Credit Card',
      deliveryStatus: 'shipped'
    },
    {
      id: 'ORD-1005',
      customerName: 'Omar Farooq',
      customerEmail: 'omar.farooq@email.com',
      customerPhone: '+92-304-5678901',
      orderDate: '2024-03-11',
      status: 'approved',
      totalAmount: 18900,
      items: [
        { id: 8, name: 'Handcrafted Wall Hanging', quantity: 1, price: 12500 },
        { id: 9, name: 'Resin Art Table', quantity: 1, price: 6400 }
      ],
      shippingAddress: {
        street: 'Street 10, Bahria Town Phase 4',
        city: 'Rawalpindi',
        province: 'Punjab',
        zipCode: '46000'
      },
      paymentMethod: 'Bank Transfer',
      deliveryStatus: 'out-for-delivery'
    }
  ]);

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOrderSelect = (order) => setSelectedOrder(order);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'status-pending', label: 'Pending', icon: <FiClock /> },
      approved: { class: 'status-approved', label: 'Approved', icon: <FiCheck /> },
      rejected: { class: 'status-rejected', label: 'Rejected', icon: <FiX /> },
      processing: { class: 'status-processing', label: 'Processing', icon: <FiClock /> },
      shipped: { class: 'status-shipped', label: 'Shipped', icon: <FiTruck /> },
      'out-for-delivery': { class: 'status-out-for-delivery', label: 'Out for Delivery', icon: <FiTruck /> },
      delivered: { class: 'status-delivered', label: 'Delivered', icon: <FiCheck /> }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`status-badge ${config.class}`}>
        {config.icon} {config.label}
      </span>
    );
  };

  const updateOrderStatus = async (newStatus) => {
    if (!selectedOrder) return alert('Please select an order.');
    setIsUpdating(true);

    setTimeout(() => {
      const updatedOrders = orders.map(order =>
        order.id === selectedOrder.id ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
      setSelectedOrder({ ...selectedOrder, status: newStatus });
      setIsUpdating(false);
      alert(`Order ${selectedOrder.id} has been ${newStatus}.`);
      console.log(`Notification sent to ${selectedOrder.customerEmail}: Order ${selectedOrder.id} ${newStatus}.`);
    }, 1000);
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
          <Link to="/admin"><FiHome className="sidebar-icon"/> Dashboard</Link>
          <Link to="/admin-add-product"><FiPlus className="sidebar-icon"/> Add Product</Link>
          <Link to="/admin-update-product"><FiEdit className="sidebar-icon"/> Update Product</Link>
          <Link to="/admin-delete-product"><FiTrash2 className="sidebar-icon"/> Delete Product</Link>
          <Link to="/admin-view-orders"><FiEye className="sidebar-icon"/> View Orders</Link>
          <Link to="/admin-manage-orders" className="active"><FiPackage className="sidebar-icon"/> Manage Orders</Link>
          <Link to="/admin-delivery-status"><FiTruck className="sidebar-icon"/> Delivery Status</Link>
          <Link to="/admin-customer-feedback"><FiMessageCircle className="sidebar-icon"/> Customer Feedback</Link>
          <Link to="/admin-sales-report"><FiBarChart2 className="sidebar-icon"/> Sales Report</Link>
        </nav>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <h1>Manage Orders</h1>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </header>

        <div className="manage-orders-layout">
          <section className="orders-list-section">
            <div className="search-box">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search orders by ID, customer name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="orders-list">
              <h3>Orders ({filteredOrders.length})</h3>
              {filteredOrders.length === 0 ? (
                <div className="no-orders">
                  <p>No orders found.</p>
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
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="order-customer">
                        <strong>{order.customerName}</strong>
                        <span className="customer-email">{order.customerEmail}</span>
                      </div>
                      <div className="order-details">
                        <span className="order-date">{order.orderDate}</span>
                        <span className="order-amount">Rs {order.totalAmount.toLocaleString()}</span>
                      </div>
                      <div className="order-items">
                        {order.items.length} item(s) • {order.deliveryStatus}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="order-details-section">
            {!selectedOrder ? (
              <div className="no-selection">
                <FiPackage className="no-selection-icon" />
                <h3>Select an order to manage</h3>
                <p>Choose an order from the list to view details and update its status</p>
              </div>
            ) : (
              <div className="order-details-container">
                <div className="order-header-details">
                  <h2>Order Details</h2>
                  <div className="order-status-display">{getStatusBadge(selectedOrder.status)}</div>
                </div>

                <div className="order-info-grid">
                  <div className="info-group"><label>Order ID</label><p>{selectedOrder.id}</p></div>
                  <div className="info-group"><label>Order Date</label><p>{selectedOrder.orderDate}</p></div>
                  <div className="info-group"><label>Customer Name</label><p>{selectedOrder.customerName}</p></div>
                  <div className="info-group"><label>Customer Email</label><p>{selectedOrder.customerEmail}</p></div>
                  <div className="info-group"><label>Customer Phone</label><p>{selectedOrder.customerPhone}</p></div>
                  <div className="info-group"><label>Total Amount</label><p className="total-amount">Rs {selectedOrder.totalAmount.toLocaleString()}</p></div>
                  <div className="info-group"><label>Payment Method</label><p>{selectedOrder.paymentMethod}</p></div>
                  <div className="info-group"><label>Delivery Status</label><p>{selectedOrder.deliveryStatus}</p></div>
                </div>

                <div className="order-items-section">
                  <h4>Order Items</h4>
                  <div className="items-list">
                    {selectedOrder.items.map(item => (
                      <div key={item.id} className="order-item-row">
                        <span className="item-name">{item.name}</span>
                        <span className="item-quantity">Qty: {item.quantity}</span>
                        <span className="item-price">Rs {item.price.toLocaleString()}</span>
                        <span className="item-total">Rs {(item.quantity * item.price).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="shipping-address-section">
                  <h4>Shipping Address</h4>
                  <div className="address-details">
                    <p>{selectedOrder.shippingAddress.street}</p>
                    <p>{selectedOrder.shippingAddress.area}</p>
                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.province} {selectedOrder.shippingAddress.zipCode}</p>
                  </div>
                </div>

                <div className="order-actions-section">
                  <h4>Update Order Status</h4>
                  <p className="action-description">Update the order status and notify the customer via email.</p>
                  <div className="action-buttons">
                    <button
                      className={`action-btn approve-btn ${selectedOrder.status === 'approved' ? 'active' : ''}`}
                      onClick={() => updateOrderStatus('approved')}
                      disabled={isUpdating || selectedOrder.status === 'approved'}
                    ><FiCheck /> {isUpdating ? 'Updating...' : 'Approve Order'}</button>

                    <button
                      className={`action-btn reject-btn ${selectedOrder.status === 'rejected' ? 'active' : ''}`}
                      onClick={() => updateOrderStatus('rejected')}
                      disabled={isUpdating || selectedOrder.status === 'rejected'}
                    ><FiX /> {isUpdating ? 'Updating...' : 'Reject Order'}</button>

                    <button
                      className={`action-btn processing-btn ${selectedOrder.status === 'processing' ? 'active' : ''}`}
                      onClick={() => updateOrderStatus('processing')}
                      disabled={isUpdating || selectedOrder.status === 'processing'}
                    ><FiClock /> {isUpdating ? 'Updating...' : 'Mark as Processing'}</button>
                  </div>

                  {isUpdating && (
                    <div className="update-notice">
                      <p>Updating order status and notifying customer...</p>
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

export default AdminManageOrders;
