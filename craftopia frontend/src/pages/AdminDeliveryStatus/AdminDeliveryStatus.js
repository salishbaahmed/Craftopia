import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDeliveryStatus.css';
import AdminSidebar from '../../components/AdminSideBar/AdminSideBar'
import {
  FiTruck,
  FiSearch, FiSave, FiCheck, FiClock, FiMapPin
} from 'react-icons/fi';
import api from '../../api/axios';

const AdminDeliveryStatus = () => {
  const navigate = useNavigate();
  const [searchTerm1, setSearchTerm1] = useState('');
  const [selectedOrder1, setSelectedOrder1] = useState(null);
  const [isUpdating1, setIsUpdating1] = useState(false);

  const [orders1, setOrders1] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders/admin/all');
        setOrders1(response.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        if (err.response && err.response.status === 401) {
          navigate('/admin-login');
        }
        setOrders1([]);
      }
    };
    fetchOrders();
  }, [navigate]);

  const [selectedStatus1, setSelectedStatus1] = useState('');

  const deliveryStatuses1 = [
    { value: 'processing', label: 'Processing', description: 'Order is being prepared for shipment' },
    { value: 'shipped', label: 'Shipped', description: 'Order has been shipped to customer' },
    { value: 'out-for-delivery', label: 'Out for Delivery', description: 'Order is out for delivery today' },
    { value: 'delivered', label: 'Delivered', description: 'Order has been successfully delivered' },
    { value: 'delayed', label: 'Delayed', description: 'Delivery is delayed due to unforeseen circumstances' }
  ];

  const filteredOrders1 = orders1.filter(order => {
    // Show orders that are approved or already in delivery process
    const status = (order.status || order.orderStatus || '').toString().toLowerCase();
    const deliveryStatus = (order.deliveryStatus || '').toString().toLowerCase();

    const statusOk = status === 'approved' ||
      ['processing', 'shipped', 'out-for-delivery', 'delivered', 'delayed'].includes(status) ||
      ['processing', 'shipped', 'out-for-delivery', 'delivered', 'delayed'].includes(deliveryStatus);

    if (!statusOk) return false;

    const id = (order.id || order.orderId || '').toString().toLowerCase();
    const name = (order.customerName || (order.checkoutFormData && order.checkoutFormData.fullName) || '').toString().toLowerCase();
    const email = (order.customerEmail || (order.checkoutFormData && order.checkoutFormData.email) || '').toString().toLowerCase();
    return id.includes(searchTerm1.toLowerCase()) || name.includes(searchTerm1.toLowerCase()) || email.includes(searchTerm1.toLowerCase());
  });

  const handleOrderSelect1 = (order) => {
    setSelectedOrder1(order);
    // clear selected status so admin explicitly picks next delivery status
    setSelectedStatus1('');
  };

  const getStatusBadge1 = (status) => {
    const statusConfig1 = {
      processing: { class: 'status-processing1', label: 'Processing', icon: <FiClock /> },
      shipped: { class: 'status-shipped1', label: 'Shipped', icon: <FiTruck /> },
      'out-for-delivery': { class: 'status-out-for-delivery1', label: 'Out for Delivery', icon: <FiMapPin /> },
      delivered: { class: 'status-delivered1', label: 'Delivered', icon: <FiCheck /> },
      delayed: { class: 'status-delayed1', label: 'Delayed', icon: <FiClock /> },
      pending: { class: 'status-pending1', label: 'Pending', icon: <FiClock /> }, // Fallback
      approved: { class: 'status-approved1', label: 'Approved', icon: <FiCheck /> } // Fallback
    };

    const normalizedStatus = (status || 'processing').toLowerCase();
    const config = statusConfig1[normalizedStatus] || statusConfig1.processing;
    return (
      <span className={`status-badge1 ${config.class}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  const getNextStatusOptions1 = (currentStatus) => {
    const statusFlow1 = {
      processing: ['shipped', 'delayed'],
      shipped: ['out-for-delivery', 'delayed'],
      'out-for-delivery': ['delivered', 'delayed'],
      delivered: [],
      delayed: ['shipped', 'out-for-delivery'],
      approved: ['processing'] // Allow transition from approved to processing
    };

    const normalizedStatus = (currentStatus || 'approved').toLowerCase();
    // if currentStatus is not in the flow map, fall back to 'approved' or 'processing'
    const key = statusFlow1[normalizedStatus] ? normalizedStatus : 'processing';
    return deliveryStatuses1.filter(status => statusFlow1[key]?.includes(status.value));
  };

  const updateDeliveryStatus1 = async () => {
    if (!selectedOrder1) {
      alert('Please select an order to update.');
      return;
    }

    const currentDeliveryStatus = selectedOrder1.deliveryStatus || selectedOrder1.status;

    if (!selectedStatus1 || selectedStatus1 === currentDeliveryStatus) {
      alert('Please select a new status to update.');
      return;
    }

    setIsUpdating1(true);

    try {
      const currentDateTime = new Date();
      const newHistoryEntry = {
        status: selectedStatus1,
        date: currentDateTime.toISOString().split('T')[0],
        time: currentDateTime.toTimeString().split(' ')[0].substring(0, 5)
      };

      const history = Array.isArray(selectedOrder1.deliveryHistory) ? [...selectedOrder1.deliveryHistory, newHistoryEntry] : [newHistoryEntry];

      const payload = {
        deliveryStatus: selectedStatus1,
        deliveryHistory: history
      };

      if (selectedStatus1 === 'delivered') {
        payload.deliveryDate = currentDateTime.toISOString().split('T')[0];
      }

      // We can also set estimated delivery if needed, but for now let's keep it simple or calculate it
      if (selectedStatus1 === 'processing' && !selectedOrder1.estimatedDelivery) {
        // Set estimated delivery to 7 days from now
        const estDate = new Date();
        estDate.setDate(estDate.getDate() + 7);
        payload.estimatedDelivery = estDate.toISOString().split('T')[0];
      }

      const id = selectedOrder1.id || selectedOrder1.orderId;
      const response = await api.patch(`/orders/admin/${id}/delivery-status`, payload);
      const updatedOrder = response.data;

      const updatedOrders1 = orders1.map(order =>
        (order.id === id || order.orderId === id) ? updatedOrder : order
      );

      setOrders1(updatedOrders1);
      setSelectedOrder1(updatedOrder);

      alert(`Delivery status for order ${id} has been updated to ${selectedStatus1}. Customer will be notified.`);
    } catch (err) {
      console.error('Error updating delivery status:', err);
      alert('Failed to update delivery status.');
    } finally {
      setIsUpdating1(false);
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
          <h1>Update Delivery Status</h1>
          <button className="logout-btn1" onClick={handleLogout1}>Logout</button>
        </header>

        <div className="delivery-status-layout1">
          <section className="orders-list-section1">
            <div className="search-box1">
              <FiSearch className="search-icon1" />
              <input
                type="text"
                placeholder="Search approved orders by ID or customer..."
                value={searchTerm1}
                onChange={(e) => setSearchTerm1(e.target.value)}
                className="search-input1"
              />
            </div>

            <div className="orders-list1">
              <h3>Approved Orders ({filteredOrders1.length})</h3>
              {filteredOrders1.length === 0 ? (
                <div className="no-orders1">
                  <p>No approved orders found matching your search.</p>
                </div>
              ) : (
                <div className="orders-grid1">
                  {filteredOrders1.map((order) => {
                    const oid = order.id || order.orderId || '';
                    const customerName = order.customerName || (order.checkoutFormData && order.checkoutFormData.fullName) || '';
                    const customerEmail = order.customerEmail || (order.checkoutFormData && order.checkoutFormData.email) || '';
                    const isSelected = (selectedOrder1 && (selectedOrder1.id || selectedOrder1.orderId)) === oid;
                    const displayStatus = order.deliveryStatus || order.status || 'pending';

                    return (
                      <div
                        key={oid || Math.random()}
                        className={`order-item1 ${isSelected ? 'selected1' : ''}`}
                        onClick={() => handleOrderSelect1(order)}
                      >
                        <div className="order-header1">
                          <span className="order-id1">{oid}</span>
                          {getStatusBadge1(displayStatus)}
                        </div>
                        <div className="order-customer1">
                          <strong>{customerName}</strong>
                          <span className="customer-email1">{customerEmail}</span>
                        </div>
                        <div className="order-details1">
                          <span className="order-amount1">Rs {Number(order.totalAmount || order.total || 0).toLocaleString()}</span>
                        </div>
                        <div className="delivery-info1">
                          <span className="estimated-delivery1">Est: {order.estimatedDelivery || 'N/A'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          <section className="status-update-section1">
            {!selectedOrder1 ? (
              <div className="no-selection1">
                <FiTruck className="no-selection-icon1" />
                <h3>Select an order to update delivery status</h3>
                <p>Choose an approved order from the list to update its delivery status</p>
              </div>
            ) : (
              <div className="status-update-container1">
                {(() => {
                  const displayStatus = selectedOrder1.deliveryStatus || selectedOrder1.status || 'pending';
                  return (
                    <div className="order-header-details1">
                      <h2>Update Delivery Status</h2>
                      <div className="current-status-display1">
                        {getStatusBadge1(displayStatus)}
                      </div>
                    </div>
                  );
                })()}

                <div className="order-info-grid1">
                  <div className="info-group1">
                    <label>Order ID</label>
                    <p>{(selectedOrder1 && (selectedOrder1.id || selectedOrder1.orderId)) || ''}</p>
                  </div>
                  <div className="info-group1">
                    <label>Customer Name</label>
                    <p>{(selectedOrder1 && (selectedOrder1.customerName || (selectedOrder1.checkoutFormData && selectedOrder1.checkoutFormData.fullName) || `${(selectedOrder1.checkoutFormData && selectedOrder1.checkoutFormData.firstName) || ''} ${(selectedOrder1.checkoutFormData && selectedOrder1.checkoutFormData.lastName) || ''}`.trim())) || ''}</p>
                  </div>
                  <div className="info-group1">
                    <label>Customer Phone</label>
                    <p>{(selectedOrder1 && (selectedOrder1.customerPhone || (selectedOrder1.checkoutFormData && (selectedOrder1.checkoutFormData.phone || selectedOrder1.checkoutFormData.phoneNumber)) || selectedOrder1.customerPhone)) || ''}</p>
                  </div>
                  <div className="info-group1">
                    <label>Estimated Delivery</label>
                    <p>{selectedOrder1.estimatedDelivery || 'N/A'}</p>
                  </div>
                  {selectedOrder1.deliveryDate && (
                    <div className="info-group1">
                      <label>Actual Delivery</label>
                      <p className="delivered-date1">{selectedOrder1.deliveryDate}</p>
                    </div>
                  )}
                </div>

                <div className="shipping-address-section1">
                  <h4>Shipping Address</h4>
                  <div className="address-details1">
                    {(() => {
                      const addr = selectedOrder1.shippingAddress || selectedOrder1.checkoutFormData || {};
                      return (
                        <>
                          <p>{addr.street || addr.addressLine1 || ''}</p>
                          <p>{addr.area || addr.addressLine2 || ''}</p>
                          <p>{addr.city || ''}, {addr.province || addr.state || ''} {addr.zipCode || addr.postalCode || ''}</p>
                        </>
                      );
                    })()}
                  </div>
                </div>

                <div className="delivery-history-section1">
                  <h4>Delivery History</h4>
                  <div className="history-timeline1">
                    {(selectedOrder1.deliveryHistory || []).map((history, index) => (
                      <div key={index} className="history-item1">
                        <div className="history-status1">
                          {getStatusBadge1(history.status)}
                        </div>
                        <div className="history-datetime1">
                          {history.date} at {history.time}
                        </div>
                      </div>
                    ))}
                    {(!selectedOrder1.deliveryHistory || selectedOrder1.deliveryHistory.length === 0) && (
                      <p>No delivery history available.</p>
                    )}
                  </div>
                </div>

                <div className="status-update-form1">
                  <h4>Update Delivery Status</h4>
                  <div className="form-group1">
                    <label>Current Status</label>
                    <div className="current-status1">
                      {getStatusBadge1(selectedOrder1.deliveryStatus || selectedOrder1.status)}
                    </div>
                  </div>

                  <div className="form-group1">
                    <label>Update to New Status</label>
                    <select
                      value={selectedStatus1}
                      onChange={(e) => setSelectedStatus1(e.target.value)}
                      className="status-select1"
                    >
                      <option value="">Select new status...</option>
                      {getNextStatusOptions1(selectedOrder1.deliveryStatus || selectedOrder1.status).map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label} - {status.description}
                        </option>
                      ))}
                    </select>
                    <small className="status-help1">
                      Only valid next status options are shown based on current status.
                    </small>
                  </div>

                  <div className="update-actions1">
                    <button
                      className="update-btn1"
                      onClick={updateDeliveryStatus1}
                      disabled={!selectedStatus1 || selectedStatus1 === (selectedOrder1.deliveryStatus || selectedOrder1.status) || isUpdating1}
                    >
                      <FiSave />
                      {isUpdating1 ? 'Updating...' : 'Update Delivery Status'}
                    </button>
                  </div>

                  {isUpdating1 && (
                    <div className="update-notice1">
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