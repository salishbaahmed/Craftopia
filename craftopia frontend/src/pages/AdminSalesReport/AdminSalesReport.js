import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminSalesReport.css';
import AdminSidebar from '../../components/AdminSideBar/AdminSideBar'
import {
  FiBarChart2,
  FiFilter, FiDownload, FiTrendingUp, FiDollarSign,
  FiShoppingBag, FiUsers, FiCalendar
} from 'react-icons/fi';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import api from '../../api/axios';

const AdminSalesReport = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('');
  const [selectedYear, setSelectedYear] = useState(String(new Date().getFullYear()));



  // ...

  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalDelivered: 0,
    averageOrderValue: 0,
    successRate: 0
  });

  const [chartData, setChartData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Summary
        const summaryRes = await api.get('/analytics/summary');
        setSummary({
          ...summaryRes.data,
          successRate: summaryRes.data.totalOrders > 0 ? (summaryRes.data.totalDelivered / summaryRes.data.totalOrders) * 100 : 0 // Backend might not send successRate, calculate if needed or update backend
        });

        // Fetch Top Products
        const topProductsRes = await api.get('/analytics/top-products');
        setTopProducts(topProductsRes.data);

      } catch (err) {
        console.error('Error fetching analytics data:', err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchSalesData = async () => {
      if (!dateRange) return;
      try {
        const period = dateRange === 'yearly' ? 'yearly' : dateRange === 'monthly' ? 'monthly' : 'weekly';
        // Note: Backend currently only supports 'monthly' and 'weekly' logic in the example, 
        // need to ensure backend handles 'yearly' or map it.
        // For now, let's pass the period as is.
        const response = await api.get(`/analytics/sales?period=${period}`);

        // Transform backend data to chart format if needed
        // Backend returns [{period: "2024-03", revenue: 100, orders: 5}, ...]
        // Chart expects keys like 'month', 'year', 'week' matching the XAxis dataKey

        const formattedData = response.data.map(item => ({
          ...item,
          [dateRange === 'yearly' ? 'year' : dateRange === 'monthly' ? 'month' : 'week']: item.period
        }));

        setChartData(formattedData);

      } catch (err) {
        console.error('Error fetching sales data:', err);
        setChartData([]);
      }
    };
    fetchSalesData();
  }, [dateRange, selectedYear]);

  const handleLogout = () => navigate('/admin-login');

  const exportReport = () => {
    if (!dateRange) {
      alert('Please select a report period first.');
      return;
    }
    alert(`Exporting ${dateRange} sales report...`);
    console.log('Exporting report with data:', { dateRange, selectedYear, summary });
  };

  const formatCurrency = (amount) => `Rs ${amount.toLocaleString()}`;

  const getDateRangeLabel = () => {
    const labels = { weekly: 'Weekly', monthly: 'Monthly', yearly: 'Yearly' };
    return labels[dateRange] || '';
  };

  return (
    <div className="admin-main-container">
      {/* Sidebar */}
      <AdminSidebar />

      <main className="main-content1">
        <header className="main-header">
          <h1>Sales Analytics Report</h1>
          <div className="header-actions">
            <button className="export-btn" onClick={exportReport}>
              <FiDownload />
              Export Report
            </button>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </header>

        <div className="sales-report-content">
          <div className="filters-section">
            <div className="filter-group">
              <FiCalendar className="filter-icon" />
              <label>Report Period:</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="filter-select"
              >
                <option value="">Select Period</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div className="filter-group">
              <FiFilter className="filter-icon" />
              <label>Year:</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="filter-select"
              >
                <option value={String(new Date().getFullYear())}>{String(new Date().getFullYear())}</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
            </div>
          </div>

          <div className="summary-cards">
            <div className="summary-card">
              <div className="card-icon revenue">
                <FiDollarSign />
              </div>
              <div className="card-content">
                <h3>Total Revenue</h3>
                <p className="card-value">{formatCurrency(summary.totalRevenue)}</p>
                <span className="card-label">{getDateRangeLabel()} Revenue</span>
              </div>
            </div>

            <div className="summary-card">
              <div className="card-icon orders">
                <FiShoppingBag />
              </div>
              <div className="card-content">
                <h3>Total Orders</h3>
                <p className="card-value">{summary.totalOrders}</p>
                <span className="card-label">{getDateRangeLabel()} Orders</span>
              </div>
            </div>

            <div className="summary-card">
              <div className="card-icon average">
                <FiTrendingUp />
              </div>
              <div className="card-content">
                <h3>Average Order</h3>
                <p className="card-value">{formatCurrency(Math.round(summary.averageOrderValue))}</p>
                <span className="card-label">Per Order</span>
              </div>
            </div>

            <div className="summary-card">
              <div className="card-icon success">
                <FiUsers />
              </div>
              <div className="card-content">
                <h3>Success Rate</h3>
                <p className="card-value">{summary.successRate.toFixed(1)}%</p>
                <span className="card-label">Orders Delivered</span>
              </div>
            </div>
          </div>

          <div className="charts-grid">
            <div className="chart-card">
              <div className="chart-header">
                <h3>Revenue Trend</h3>
                <span className="chart-period">{getDateRangeLabel()} Overview</span>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey={dateRange === 'yearly' ? 'year' : dateRange === 'monthly' ? 'month' : 'week'}
                    />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`Rs ${value.toLocaleString()}`, 'Revenue']}
                      labelFormatter={(label) => `${getDateRangeLabel()} ${label}`}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      name="Revenue"
                      stroke="#14B8A6"
                      strokeWidth={3}
                      dot={{ fill: '#14B8A6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: '#0d9488' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <h3>Orders Analysis</h3>
                <span className="chart-period">{getDateRangeLabel()} Comparison</span>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey={dateRange === 'yearly' ? 'year' : dateRange === 'monthly' ? 'month' : 'week'}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="orders" name="Total Orders" fill="#f59e0b" />
                    <Bar dataKey="delivered" name="Delivered" fill="#14B8A6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="data-sections">
            <div className="data-section">
              <div className="section-header">
                <h3>Top Performing Products</h3>
                <span className="section-subtitle">By revenue generated</span>
              </div>
              <div className="products-list">
                {topProducts.map((product, index) => (
                  <div key={product.id} className="product-item">
                    <div className="product-rank">#{index + 1}</div>
                    <div className="product-details">
                      <h4 className="product-name">{product.name}</h4>
                      <div className="product-metrics">
                        <span className="sales">{product.sales} units</span>
                        <span className="revenue">{formatCurrency(product.revenue)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="data-section">
              <div className="section-header">
                <h3>Performance Metrics</h3>
                <span className="section-subtitle">Key business indicators</span>
              </div>
              <div className="metrics-grid">
                <div className="metric-item">
                  <span className="metric-label">Conversion Rate</span>
                  <span className="metric-value">4.2%</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Customer Growth</span>
                  <span className="metric-value">+18%</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Return Rate</span>
                  <span className="metric-value">2.1%</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Avg Delivery Time</span>
                  <span className="metric-value">3.2 days</span>
                </div>
              </div>
            </div>
          </div>

          {summary.totalOrders === 0 && (
            <div className="empty-state">
              <FiBarChart2 className="empty-icon" />
              <h3>No Sales Data Available</h3>
              <p>No sales records found for the selected period and filters.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminSalesReport;
