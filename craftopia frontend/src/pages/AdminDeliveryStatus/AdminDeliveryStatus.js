import React, { useState, useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';
import './AdminDeliveryStatus.css';
import AdminSidebar from '../../components/AdminSideBar/AdminSideBar'
import { 
  FiTruck, 
  FiSearch, FiSave, FiCheck, FiClock, FiMapPin
} from 'react-icons/fi';

const DEFAULT_ORDERS = [
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
  }
];

const AdminDeliveryStatus = () => {
  const navigate = useNavigate();
  const [searchTerm1, setSearchTerm1] = useState('');
  const [selectedOrder1, setSelectedOrder1] = useState(null);
  const [isUpdating1, setIsUpdating1] = useState(false);

  const [orders1, setOrders1] = useState([]);
  

  useEffect(() => {
    try {
      const stored = localStorage.getItem('orderHistory');
      if (stored) {
        const parsed = JSON.parse(stored);
        setOrders1(parsed.length ? parsed : DEFAULT_ORDERS);
      } else {
        setOrders1(DEFAULT_ORDERS);
      }
    } catch (err) {
      setOrders1(DEFAULT_ORDERS);
    }

    const onOrdersUpdated = () => {
      try {
        const latest = JSON.parse(localStorage.getItem('orderHistory') || '[]');
        setOrders1(latest);
      } catch (err) {
        // ignore
      }
    };
    window.addEventListener('ordersUpdated', onOrdersUpdated);
    return () => window.removeEventListener('ordersUpdated', onOrdersUpdated);
  }, []);

  const [selectedStatus1, setSelectedStatus1] = useState('');

  const deliveryStatuses1 = [
    { value: 'processing', label: 'Processing', description: 'Order is being prepared for shipment' },
    { value: 'shipped', label: 'Shipped', description: 'Order has been shipped to customer' },
    { value: 'out-for-delivery', label: 'Out for Delivery', description: 'Order is out for delivery today' },
    { value: 'delivered', label: 'Delivered', description: 'Order has been successfully delivered' },
    { value: 'delayed', label: 'Delayed', description: 'Delivery is delayed due to unforeseen circumstances' }
  ];

  const filteredOrders1 = orders1.filter(order => {
    const statusOk = (order.status || order.orderStatus || '').toString() === 'approved' || (order.deliveryStatus || '').toString() === 'approved';
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
      delayed: { class: 'status-delayed1', label: 'Delayed', icon: <FiClock /> }
    };
    
    const config = statusConfig1[status] || statusConfig1.processing;
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
      delayed: ['shipped', 'out-for-delivery']
    };
    // if currentStatus is not in the flow map (eg. 'approved' or undefined), fall back to 'processing'
    const key = statusFlow1[currentStatus] ? currentStatus : 'processing';
    return deliveryStatuses1.filter(status => statusFlow1[key]?.includes(status.value));
  };

  const updateDeliveryStatus1 = async () => {
    if (!selectedOrder1) {
      alert('Please select an order to update.');
      return;
    }

    if (!selectedStatus1 || selectedStatus1 === selectedOrder1.deliveryStatus) {
      alert('Please select a new status to update.');
      return;
    }

    setIsUpdating1(true);
    
    setTimeout(() => {
      const currentDateTime = new Date();
      const newHistoryEntry = {
        status: selectedStatus1,
        date: currentDateTime.toISOString().split('T')[0],
        time: currentDateTime.toTimeString().split(' ')[0].substring(0, 5)
      };

      const updatedOrders1 = orders1.map(order => {
        const idA = order.id || order.orderId;
        const idB = selectedOrder1.id || selectedOrder1.orderId;
        if (idA === idB) {
          const history = Array.isArray(order.deliveryHistory) ? [...order.deliveryHistory, newHistoryEntry] : [newHistoryEntry];
          const updated = {
            ...order,
            deliveryStatus: selectedStatus1,
            deliveryHistory: history
          };
          if (selectedStatus1 === 'delivered') {
            updated.deliveredDate = currentDateTime.toISOString().split('T')[0];
          }
          return updated;
        }
        return order;
      });

      setOrders1(updatedOrders1);
      setSelectedOrder1(updatedOrders1.find(o => (o.id || o.orderId) === (selectedOrder1.id || selectedOrder1.orderId)));
      try {
        localStorage.setItem('orderHistory', JSON.stringify(updatedOrders1));
        window.dispatchEvent(new CustomEvent('ordersUpdated', { detail: { orders: updatedOrders1 } }));
      } catch (err) {
        // ignore
      }
      setIsUpdating1(false);

      alert(`Delivery status for order ${selectedOrder1.id || selectedOrder1.orderId} has been updated to ${selectedStatus1}. Customer will be notified.`);
      console.log(`Notification sent to ${selectedOrder1.customerEmail}: Your order ${selectedOrder1.id || selectedOrder1.orderId} delivery status has been updated to ${selectedStatus1}.`);
    }, 1500);
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
                    return (
                      <div
                        key={oid || Math.random()}
                        className={`order-item1 ${isSelected ? 'selected1' : ''}`}
                        onClick={() => handleOrderSelect1(order)}
                      >
                        <div className="order-header1">
                          <span className="order-id1">{oid}</span>
                          {getStatusBadge1(order.deliveryStatus)}
                        </div>
                        <div className="order-customer1">
                          <strong>{customerName}</strong>
                          <span className="customer-email1">{customerEmail}</span>
                        </div>
                        <div className="order-details1">
                          <span className="order-amount1">Rs {Number(order.totalAmount || order.total || 0).toLocaleString()}</span>
                        </div>
                        <div className="delivery-info1">
                          <span className="estimated-delivery1">Est: {order.estimatedDelivery}</span>
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
                <div className="order-header-details1">
                  <h2>Update Delivery Status</h2>
                  <div className="current-status-display1">
                    {getStatusBadge1(selectedOrder1.deliveryStatus)}
                  </div>
                </div>

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
                    <p>{selectedOrder1.estimatedDelivery}</p>
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
                      </div>
                    </div>

                <div className="status-update-form1">
                  <h4>Update Delivery Status</h4>
                  <div className="form-group1">
                    <label>Current Status</label>
                    <div className="current-status1">
                      {getStatusBadge1(selectedOrder1.deliveryStatus)}
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
                      {getNextStatusOptions1(selectedOrder1.deliveryStatus).map(status => (
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
                      disabled={!selectedStatus1 || selectedStatus1 === selectedOrder1.deliveryStatus || isUpdating1}
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