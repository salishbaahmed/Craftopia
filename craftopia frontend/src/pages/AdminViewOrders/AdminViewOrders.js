import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminViewOrders.css';
import AdminSidebar from '../../components/AdminSideBar/AdminSideBar'
import {

  FiSearch, FiFilter
} from 'react-icons/fi';
import api from '../../api/axios';

const AdminViewOrders = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleLogout = () => navigate('/admin-login');

  const [orders, setOrders] = useState([]);



  // ...

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders/admin/all');
        setOrders(response.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setOrders([]);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const name = (order.customerName || (order.checkoutFormData && order.checkoutFormData.fullName) || '').toString().toLowerCase();
    const id = (order.id || order.orderId || '').toString().toLowerCase();
    const stat = (order.status || order.orderStatus || '').toString();
    const matchesSearch = name.includes(searchTerm.toLowerCase()) || id.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || stat === statusFilter;
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
      {/* Sidebar */}
      <AdminSidebar />

      <main className="main-content1">
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
                  {filteredOrders.map(order => {
                    const id = order.id || order.orderId || '';
                    const customerName = order.customerName || (order.checkoutFormData && order.checkoutFormData.fullName) || 'Customer';
                    const customerEmail = order.customerEmail || (order.checkoutFormData && order.checkoutFormData.email) || '';
                    const items = order.items || order.orderItems || [];
                    const total = order.totalAmount || order.total || order.totalPrice || order.totalPaid || 0;
                    const status = order.status || order.orderStatus || '';
                    const delivery = order.deliveryStatus || status || '';
                    const date = order.orderDate || order.orderPlaced || '';
                    return (
                      <tr key={id}>
                        <td className="order-id">{id}</td>
                        <td>
                          <div className="customer-info">
                            <strong>{customerName}</strong>
                            <span>{customerEmail}</span>
                          </div>
                        </td>
                        <td>
                          <div className="items-info">
                            {items.map(item => (
                              <div key={item.id || item.productId || Math.random()} className="item-row">
                                {item.name || item.title || 'Item'} (x{item.quantity || item.qty || 1})
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="total-amount">Rs {Number(total).toLocaleString()}</td>
                        <td>{getStatusBadge(status)}</td>
                        <td>{getDeliveryStatusBadge(delivery)}</td>
                        <td>{date}</td>
                      </tr>
                    );
                  })}
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
