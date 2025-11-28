import React, { useEffect, useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import './AdminMain.css';
import AdminSidebar from '../../components/AdminSideBar/AdminSideBar'

import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar 
} from 'recharts';

const AdminMain = () => {
  const navigate = useNavigate();

  const [ordersData, setOrdersData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [totalDelivered, setTotalDelivered] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    // load products count
    try {
      const p = JSON.parse(localStorage.getItem('products') || '[]');
      setTotalProducts(p.length || 0);
    } catch (err) {
      setTotalProducts(0);
    }

    // aggregate orders into monthly buckets for last 6 months
    try {
      const orders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      if (!orders || orders.length === 0) {
        // fallback dummy
        const fallbackOrders = [
          { name: 'Jan', Pending: 10, Delivered: 30 },
          { name: 'Feb', Pending: 15, Delivered: 25 },
          { name: 'Mar', Pending: 12, Delivered: 35 },
          { name: 'Apr', Pending: 20, Delivered: 40 },
          { name: 'May', Pending: 18, Delivered: 38 },
          { name: 'Jun', Pending: 25, Delivered: 45 },
        ];
        setOrdersData(fallbackOrders);
        const pending = fallbackOrders.reduce((s, r) => s + (r.Pending || 0), 0);
        const delivered = fallbackOrders.reduce((s, r) => s + (r.Delivered || 0), 0);
        setTotalPending(pending);
        setTotalDelivered(delivered);
        setTotalOrders(pending + delivered);
      } else {
        // map orders into month buckets
        const monthMap = {};
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const key = d.toLocaleString('en-US', { month: 'short' });
          monthMap[key] = { Pending: 0, Delivered: 0, name: key };
        }
        let revenueBuckets = {};
        orders.forEach(o => {
          const d = new Date(o.orderDate || o.orderDate || o.orderPlaced || Date.now());
          const key = d.toLocaleString('en-US', { month: 'short' });
          if (!monthMap[key]) {
            monthMap[key] = { Pending: 0, Delivered: 0, name: key };
          }
          const status = (o.status || '').toLowerCase();
          if (status === 'delivered') monthMap[key].Delivered += 1;
          else monthMap[key].Pending += 1;

          // revenue
          const price = Number(o.total || o.totalAmount || o.totalPrice || o.totalAmountPaid || 0) || 0;
          revenueBuckets[key] = (revenueBuckets[key] || 0) + price;
        });
        const months = Object.values(monthMap).slice(-6);
        setOrdersData(months);
        const pending = months.reduce((s, r) => s + (r.Pending || 0), 0);
        const delivered = months.reduce((s, r) => s + (r.Delivered || 0), 0);
        setTotalPending(pending);
        setTotalDelivered(delivered);
        setTotalOrders(pending + delivered);
        // revenue data from revenueBuckets
        const rev = Object.keys(revenueBuckets).slice(-4).map(k => ({ name: k, Revenue: revenueBuckets[k] }));
        setRevenueData(rev.length ? rev : [
          { name: 'Week 1', Revenue: 2000 },
          { name: 'Week 2', Revenue: 3500 },
          { name: 'Week 3', Revenue: 2800 },
          { name: 'Week 4', Revenue: 4500 },
        ]);
        const totalRev = Object.values(revenueBuckets).reduce((s, v) => s + v, 0);
        setTotalRevenue(totalRev || 0);
      }
    } catch (err) {
      // fallback
      setOrdersData([
        { name: 'Jan', Pending: 10, Delivered: 30 },
        { name: 'Feb', Pending: 15, Delivered: 25 },
        { name: 'Mar', Pending: 12, Delivered: 35 },
        { name: 'Apr', Pending: 20, Delivered: 40 },
        { name: 'May', Pending: 18, Delivered: 38 },
        { name: 'Jun', Pending: 25, Delivered: 45 },
      ]);
      setRevenueData([
        { name: 'Week 1', Revenue: 2000 },
        { name: 'Week 2', Revenue: 3500 },
        { name: 'Week 3', Revenue: 2800 },
        { name: 'Week 4', Revenue: 4500 },
      ]);
    }

    // refresh if ordersUpdated or productsUpdated happen
    const onOrdersUpdated = () => { /* trigger effect by re-running */ window.location && window.location.reload && window.location.reload(); };
    window.addEventListener('ordersUpdated', onOrdersUpdated);
    window.addEventListener('productsUpdated', onOrdersUpdated);
    return () => {
      window.removeEventListener('ordersUpdated', onOrdersUpdated);
      window.removeEventListener('productsUpdated', onOrdersUpdated);
    };
  }, []);

  const handleLogout = () => {
    navigate('/admin-login');
  };

  return (
    <div className="admin-main-container">
      {/* Sidebar */}
      <AdminSidebar />
      

      {/* Main Content */}
      <main className="main-content1">
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
