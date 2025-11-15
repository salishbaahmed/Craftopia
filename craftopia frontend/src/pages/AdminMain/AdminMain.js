import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminMain.css';
import { 
  FiHome, FiPlus, FiEdit, FiTrash2, FiEye,
  FiPackage, FiTruck, FiMessageCircle, FiBarChart2 
} from 'react-icons/fi';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar 
} from 'recharts';

const AdminMain = () => {
  const navigate = useNavigate();

  // Dummy data 
  const ordersData = [
    { name: 'Jan', Pending: 10, Delivered: 30 },
    { name: 'Feb', Pending: 15, Delivered: 25 },
    { name: 'Mar', Pending: 12, Delivered: 35 },
    { name: 'Apr', Pending: 20, Delivered: 40 },
    { name: 'May', Pending: 18, Delivered: 38 },
    { name: 'Jun', Pending: 25, Delivered: 45 },
  ];

  const revenueData = [
    { name: 'Week 1', Revenue: 2000 },
    { name: 'Week 2', Revenue: 3500 },
    { name: 'Week 3', Revenue: 2800 },
    { name: 'Week 4', Revenue: 4500 },
  ];

  const totalProducts = 248; 
  const totalPending = ordersData.reduce((acc, cur) => acc + cur.Pending, 0);
  const totalDelivered = ordersData.reduce((acc, cur) => acc + cur.Delivered, 0);
  const totalRevenue = revenueData.reduce((acc, cur) => acc + cur.Revenue, 0);
  const totalOrders = totalPending + totalDelivered;

  const handleLogout = () => {
    navigate('/admin-login');
  };

  return (
    <div className="admin-main-container">
      {/* Sidebar */}
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
          <Link to="/admin-delivery-status"><FiTruck className="sidebar-icon"/> Delivery Status</Link>
          <Link to="/admin-customer-feedback"><FiMessageCircle className="sidebar-icon"/> Customer Feedback</Link>
          <Link to="/admin-sales-report"><FiBarChart2 className="sidebar-icon"/> Sales Report</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="main-header">
          <h1>Admin Dashboard</h1>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </header>

        {/* Stats Cards */}
        <section className="stats-grid">
          <div className="stat-card">
            <h3>Total Products</h3>
            <p>{totalProducts}</p>
          </div>
          <div className="stat-card">
            <h3>Total Orders</h3>
            <p>{totalOrders}</p>
          </div>
          <div className="stat-card">
            <h3>Pending Orders</h3>
            <p>{totalPending}</p>
          </div>
          <div className="stat-card">
            <h3>Delivered Orders</h3>
            <p>{totalDelivered}</p>
          </div>
          <div className="stat-card">
            <h3>Revenue</h3>
            <p>${totalRevenue.toLocaleString()}</p>
          </div>
        </section>

        {/* Overview Charts */}
        <section className="overview-section">
          <h2>Overview</h2>
          <div className="overview-placeholder">
            <h3 style={{marginBottom: '1rem'}}>Orders Status</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={ordersData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Pending" stroke="#f59e0b" strokeWidth={2} />
                <Line type="monotone" dataKey="Delivered" stroke="#14B8A6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>

            <h3 style={{margin: '2rem 0 1rem 0'}}>Revenue</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Revenue" fill="#14B8A6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminMain;
