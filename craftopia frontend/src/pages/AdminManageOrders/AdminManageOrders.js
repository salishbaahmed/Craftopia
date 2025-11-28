import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminManageOrders.css';
import AdminSidebar from '../../components/AdminSideBar/AdminSideBar'
import { 
  FiPackage, FiTruck,
  FiSearch, FiCheck, FiX, FiClock
} from 'react-icons/fi';

const DEFAULT_ORDERS = [
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
  }
];

const AdminManageOrders = () => {
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
  }, []);

  const filteredOrders1 = orders1.filter(order =>
    ((order.id || order.orderId || '').toString().toLowerCase().includes(searchTerm1.toLowerCase())) ||
    ((order.customerName || (order.checkoutFormData && order.checkoutFormData.fullName) || '').toString().toLowerCase().includes(searchTerm1.toLowerCase())) ||
    ((order.customerEmail || (order.checkoutFormData && order.checkoutFormData.email) || '').toString().toLowerCase().includes(searchTerm1.toLowerCase()))
  );

  const handleOrderSelect1 = (order) => setSelectedOrder1(order);

  const getStatusBadge1 = (status) => {
    const statusConfig1 = {
      pending: { class: 'status-pending1', label: 'Pending', icon: <FiClock /> },
      approved: { class: 'status-approved1', label: 'Approved', icon: <FiCheck /> },
      rejected: { class: 'status-rejected1', label: 'Rejected', icon: <FiX /> },
      processing: { class: 'status-processing1', label: 'Processing', icon: <FiClock /> },
      shipped: { class: 'status-shipped1', label: 'Shipped', icon: <FiTruck /> },
      'out-for-delivery': { class: 'status-out-for-delivery1', label: 'Out for Delivery', icon: <FiTruck /> },
      delivered: { class: 'status-delivered1', label: 'Delivered', icon: <FiCheck /> }
    };
    
    const config = statusConfig1[status] || statusConfig1.pending;
    return (
      <span className={`status-badge1 ${config.class}`}>
        {config.icon} {config.label}
      </span>
    );
  };

  const updateOrderStatus1 = async (newStatus) => {
    if (!selectedOrder1) return alert('Please select an order.');
    setIsUpdating1(true);

    setTimeout(() => {
      const deliveryStatuses = ['processing', 'shipped', 'out-for-delivery', 'delivered', 'delayed'];
      const updatedOrders1 = orders1.map(order => {
        const idA = order.id || order.orderId;
        const idB = selectedOrder1.id || selectedOrder1.orderId;
        if (idA === idB) {
          // only update deliveryStatus when newStatus is part of delivery flow
          if (deliveryStatuses.includes(newStatus)) {
            return { ...order, status: newStatus, deliveryStatus: newStatus };
          }
          return { ...order, status: newStatus };
        }
        return order;
      });
      setOrders1(updatedOrders1);
      setSelectedOrder1({ ...selectedOrder1, status: newStatus, deliveryStatus: newStatus });
      try {
        localStorage.setItem('orderHistory', JSON.stringify(updatedOrders1));
        window.dispatchEvent(new CustomEvent('ordersUpdated', { detail: { orders: updatedOrders1 } }));
      } catch (err) {
        // ignore
      }
      setIsUpdating1(false);
      alert(`Order ${selectedOrder1.id || selectedOrder1.orderId} has been ${newStatus}.`);
      console.log(`Notification sent to ${selectedOrder1.customerEmail}: Order ${selectedOrder1.id || selectedOrder1.orderId} ${newStatus}.`);
    }, 1000);
  };

  const handleLogout1 = () => navigate('/admin-login');

  return (
    <div className="admin-main-container1">
      {/* Sidebar */}
      <AdminSidebar />

      <main className="main-content1">
        <header className="main-header1">
          <h1>Manage Orders</h1>
          <button className="logout-btn1" onClick={handleLogout1}>Logout</button>
        </header>

        <div className="manage-orders-layout1">
          <section className="orders-list-section1">
            <div className="search-box1">
              <FiSearch className="search-icon1" />
              <input
                type="text"
                placeholder="Search orders by ID, customer name, or email..."
                value={searchTerm1}
                onChange={(e) => setSearchTerm1(e.target.value)}
                className="search-input1"
              />
            </div>

            <div className="orders-list1">
              <h3>Orders ({filteredOrders1.length})</h3>
              {filteredOrders1.length === 0 ? (
                <div className="no-orders1">
                  <p>No orders found.</p>
                </div>
              ) : (
                <div className="orders-grid1">
                  {filteredOrders1.map(order => {
                    const id = order.id || order.orderId || '';
                    const customerName = order.customerName || (order.checkoutFormData && order.checkoutFormData.fullName) || 'Customer';
                    const customerEmail = order.customerEmail || (order.checkoutFormData && order.checkoutFormData.email) || '';
                    const items = order.items || order.orderItems || [];
                    const total = order.totalAmount || order.total || order.totalPrice || 0;
                    const status = order.status || order.orderStatus || '';
                    const delivery = order.deliveryStatus || status || '';
                    const date = order.orderDate || order.orderPlaced || '';
                    return (
                      <div
                        key={id}
                        className={`order-item1 ${((selectedOrder1 && (selectedOrder1.id || selectedOrder1.orderId)) === id) ? 'selected1' : ''}`}
                        onClick={() => handleOrderSelect1(order)}
                      >
                        <div className="order-header1">
                          <span className="order-id1">{id}</span>
                          {getStatusBadge1(status)}
                        </div>
                        <div className="order-customer1">
                          <strong>{customerName}</strong>
                          <span className="customer-email1">{customerEmail}</span>
                        </div>
                        <div className="order-details1">
                          <span className="order-date1">{date}</span>
                          <span className="order-amount1">Rs {Number(total).toLocaleString()}</span>
                        </div>
                        <div className="order-items1">
                          {items.length} item(s) • {delivery}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          <section className="order-details-section1">
            {!selectedOrder1 ? (
              <div className="no-selection1">
                <FiPackage className="no-selection-icon1" />
                <h3>Select an order to manage</h3>
                <p>Choose an order from the list to view details and update its status</p>
              </div>
            ) : (
              <div className="order-details-container1">
                {(() => {
                  const id = selectedOrder1.id || selectedOrder1.orderId || '';
                  const date = selectedOrder1.orderDate || selectedOrder1.orderPlaced || '';
                  const customerName = selectedOrder1.customerName || (selectedOrder1.checkoutFormData && selectedOrder1.checkoutFormData.fullName) || '';
                  const customerEmail = selectedOrder1.customerEmail || (selectedOrder1.checkoutFormData && selectedOrder1.checkoutFormData.email) || '';
                  const customerPhone = selectedOrder1.customerPhone || (selectedOrder1.checkoutFormData && selectedOrder1.checkoutFormData.phone) || '';
                  const total = selectedOrder1.totalAmount || selectedOrder1.total || selectedOrder1.totalPrice || 0;
                  const paymentMethod = selectedOrder1.paymentMethod || selectedOrder1.payment || '';
                  const delivery = selectedOrder1.deliveryStatus || selectedOrder1.status || '';
                  const items = selectedOrder1.items || selectedOrder1.orderItems || [];
                  const addr = selectedOrder1.shippingAddress || selectedOrder1.checkoutFormData || {};
                  return (
                    <>
                      <div className="order-header-details1">
                        <h2>Order Details</h2>
                        <div className="order-status-display1">{getStatusBadge1(selectedOrder1.status || selectedOrder1.orderStatus)}</div>
                      </div>

                      <div className="order-info-grid1">
                        <div className="info-group1"><label>Order ID</label><p>{id}</p></div>
                        <div className="info-group1"><label>Order Date</label><p>{date}</p></div>
                        <div className="info-group1"><label>Customer Name</label><p>{customerName}</p></div>
                        <div className="info-group1"><label>Customer Email</label><p>{customerEmail}</p></div>
                        <div className="info-group1"><label>Customer Phone</label><p>{customerPhone}</p></div>
                        <div className="info-group1"><label>Total Amount</label><p className="total-amount1">Rs {Number(total).toLocaleString()}</p></div>
                        <div className="info-group1"><label>Payment Method</label><p>{paymentMethod}</p></div>
                        <div className="info-group1"><label>Delivery Status</label><p>{delivery}</p></div>
                      </div>

                      <div className="order-items-section1">
                        <h4>Order Items</h4>
                        <div className="items-list1">
                          {items.map(item => (
                            <div key={item.id || item.productId || Math.random()} className="order-item-row1">
                              <span className="item-name1">{item.name || item.title || 'Item'}</span>
                              <span className="item-quantity1">Qty: {item.quantity || item.qty || 1}</span>
                              <span className="item-price1">Rs {Number(item.price || item.unitPrice || 0).toLocaleString()}</span>
                              <span className="item-total1">Rs {Number((item.quantity || item.qty || 1) * (item.price || item.unitPrice || 0)).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="shipping-address-section1">
                        <h4>Shipping Address</h4>
                        <div className="address-details1">
                          <p>{addr.street || addr.addressLine1 || ''}</p>
                          <p>{addr.area || addr.addressLine2 || ''}</p>
                          <p>{addr.city || ''}, {addr.province || addr.state || ''} {addr.zipCode || addr.postalCode || ''}</p>
                        </div>
                      </div>
                    </>
                  );
                })()}

                <div className="order-actions-section1">
                  <h4>Update Order Status</h4>
                  <p className="action-description1">Update the order status and notify the customer via email.</p>
                  <div className="action-buttons1">
                    <button
                      className={`action-btn1 approve-btn1 ${selectedOrder1.status === 'approved' ? 'active1' : ''}`}
                      onClick={() => updateOrderStatus1('approved')}
                      disabled={isUpdating1 || selectedOrder1.status === 'approved'}
                    ><FiCheck /> {isUpdating1 ? 'Updating...' : 'Approve Order'}</button>

                    <button
                      className={`action-btn1 reject-btn1 ${selectedOrder1.status === 'rejected' ? 'active1' : ''}`}
                      onClick={() => updateOrderStatus1('rejected')}
                      disabled={isUpdating1 || selectedOrder1.status === 'rejected'}
                    ><FiX /> {isUpdating1 ? 'Updating...' : 'Reject Order'}</button>

                    <button
                      className={`action-btn1 processing-btn1 ${selectedOrder1.status === 'processing' ? 'active1' : ''}`}
                      onClick={() => updateOrderStatus1('processing')}
                      disabled={isUpdating1 || selectedOrder1.status === 'processing'}
                    ><FiClock /> {isUpdating1 ? 'Updating...' : 'Mark as Processing'}</button>
                  </div>

                  {isUpdating1 && (
                    <div className="update-notice1">
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