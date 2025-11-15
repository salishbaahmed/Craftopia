import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminViewOrders.css';
import {
  FiHome, FiPlus, FiEdit, FiTrash2, FiEye,
  FiPackage, FiTruck, FiMessageCircle, FiBarChart2,
  FiSearch, FiFilter
} from 'react-icons/fi';

const AdminViewOrders = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleLogout = () => navigate('/admin-login');

  const [orders] = useState([
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
        province: 'ICT',
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'status-pending', label: 'Pending' },
      approved: { class: 'status-approved', label: 'Approved' },
      rejected: { class: 'status-rejected', label: 'Rejected' },
      processing: { class: 'status-processing', label: 'Processing' },
      shipped: { class: 'status-shipped', label: 'Shipped' },
      'out-for-delivery': { class: 'status-out-for-delivery', label: 'Out for Delivery' },
      delivered: { class: 'status-delivered', label: 'Delivered' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  const getDeliveryStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'delivery-pending', label: 'Pending' },
      processing: { class: 'delivery-processing', label: 'Processing' },
      shipped: { class: 'delivery-shipped', label: 'Shipped' },
      'out-for-delivery': { class: 'delivery-out-for-delivery', label: 'Out for Delivery' },
      delivered: { class: 'delivery-delivered', label: 'Delivered' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <span className={`delivery-status-badge ${config.class}`}>{config.label}</span>;
  };

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
          <Link to="/admin-update-product"><FiEdit className="sidebar-icon" /> Update Product</Link>
          <Link to="/admin-delete-product"><FiTrash2 className="sidebar-icon" /> Delete Product</Link>
          <Link to="/admin-view-orders" className="active"><FiEye className="sidebar-icon" /> View Orders</Link>
          <Link to="/admin-manage-orders"><FiPackage className="sidebar-icon" /> Manage Orders</Link>
          <Link to="/admin-delivery-status"><FiTruck className="sidebar-icon" /> Delivery Status</Link>
          <Link to="/admin-customer-feedback"><FiMessageCircle className="sidebar-icon" /> Customer Feedback</Link>
          <Link to="/admin-sales-report"><FiBarChart2 className="sidebar-icon" /> Sales Report</Link>
        </nav>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <h1>View Orders</h1>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </header>

        <div className="orders-content">
          <div className="orders-header">
            <div className="search-box">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by Order ID or Customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-box">
              <FiFilter className="filter-icon" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="out-for-delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>

          <div className="orders-table-container">
            {filteredOrders.length === 0 ? (
              <div className="no-orders">
                <p>No orders found matching your criteria.</p>
              </div>
            ) : (
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total (Rs)</th>
                    <th>Order Status</th>
                    <th>Delivery Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order.id}>
                      <td className="order-id">{order.id}</td>
                      <td>
                        <div className="customer-info">
                          <strong>{order.customerName}</strong>
                          <span>{order.customerEmail}</span>
                        </div>
                      </td>
                      <td>
                        <div className="items-info">
                          {order.items.map(item => (
                            <div key={item.id} className="item-row">
                              {item.name} (x{item.quantity})
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="total-amount">Rs {order.totalAmount.toLocaleString()}</td>
                      <td>{getStatusBadge(order.status)}</td>
                      <td>{getDeliveryStatusBadge(order.deliveryStatus)}</td>
                      <td>{order.orderDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminViewOrders;
