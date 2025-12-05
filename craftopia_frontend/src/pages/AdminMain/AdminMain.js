import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminMain.css';
import AdminSidebar from '../../components/AdminSideBar/AdminSideBar'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import api from '../../api/axios';

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
    const fetchData = async () => {
      try {
        // Fetch Products Count
        const productsResponse = await api.get('/products');
        setTotalProducts(productsResponse.data.length);
      } catch (err) {
        console.error('Error fetching product count:', err);
      }

      try {
        // Fetch Orders
        const ordersResponse = await api.get('/orders/admin/all');
        const orders = ordersResponse.data;
        processOrderData(orders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        if (err.response && err.response.status === 401) {
          navigate('/admin-login');
        }
      }
    };

    fetchData();
  }, [navigate]);

  const processOrderData = (orders) => {
    const now = new Date();
    const months = [];
    const monthMap = {};

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleString('default', { month: 'short' });
      monthMap[key] = { name: key, Pending: 0, Delivered: 0, Revenue: 0 };
      months.push(key);
    }

    let pendingCount = 0;
    let deliveredCount = 0;
    let revenueTotal = 0;

    orders.forEach(order => {
      // Calculate Totals
      const status = (order.status || '').toLowerCase();
      const deliveryStatus = (order.deliveryStatus || '').toLowerCase();

      // Determine effective status
      const isDelivered = status === 'delivered' || deliveryStatus === 'delivered';
      const isPending = !isDelivered && (status !== 'cancelled'); // Assuming anything not delivered or cancelled is pending-ish

      if (isDelivered) deliveredCount++;
      else if (isPending) pendingCount++;

      const amount = Number(order.total || order.totalAmount || 0);
      revenueTotal += amount;

      // Map to Month
      const dateStr = order.createdAt || order.orderDate;
      if (dateStr) {
        const d = new Date(dateStr);
        const key = d.toLocaleString('default', { month: 'short' });
        if (monthMap[key]) {
          if (isDelivered) monthMap[key].Delivered++;
          else if (isPending) monthMap[key].Pending++;
          monthMap[key].Revenue += amount;
        }
      }
    });

    setTotalPending(pendingCount);
    setTotalDelivered(deliveredCount);
    setTotalOrders(orders.length);
    setTotalRevenue(revenueTotal);

    // Prepare Graph Data
    const graphData = months.map(month => monthMap[month]);
    setOrdersData(graphData);
    setRevenueData(graphData); // Use same monthly data for revenue graph
  };

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
            <p>Rs {totalRevenue.toLocaleString()}</p>
          </div>
        </section>

        {/* Overview Charts */}
        <section className="overview-section">
          <h2>Overview</h2>
          <div className="overview-placeholder">
            <h3 style={{ marginBottom: '1rem' }}>Orders Status (Last 6 Months)</h3>
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

            <h3 style={{ margin: '2rem 0 1rem 0' }}>Revenue (Last 6 Months)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `Rs ${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="Revenue" fill="#14B8A6" name="Revenue (Rs)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminMain;
