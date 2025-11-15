import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminSalesReport.css';
import { 
  FiHome, FiPlus, FiEdit, FiTrash2, FiEye,
  FiPackage, FiTruck, FiMessageCircle, FiBarChart2,
  FiFilter, FiDownload, FiTrendingUp, FiDollarSign,
  FiShoppingBag, FiUsers, FiCalendar
} from 'react-icons/fi';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar
} from 'recharts';

const AdminSalesReport = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('');
  const [selectedYear, setSelectedYear] = useState('2024');

  const topProducts = [
    { id: 1, name: 'Handmade Ceramic Vase', sales: 45, revenue: 382500 },
    { id: 2, name: 'Embroidered Shawl', sales: 38, revenue: 76000 },
    { id: 3, name: 'Wooden Jewelry Box', sales: 32, revenue: 160000 },
    { id: 4, name: 'Leather Wallet', sales: 28, revenue: 156800 },
    { id: 5, name: 'Wool Scarf', sales: 25, revenue: 80000 }
  ];

  const { chartData, summary } = useMemo(() => {
    const salesData = {
      monthly: [
        { month: 'Jan', revenue: 38500, orders: 12, delivered: 10 },
        { month: 'Feb', revenue: 42500, orders: 15, delivered: 12 },
        { month: 'Mar', revenue: 67800, orders: 23, delivered: 20 },
        { month: 'Apr', revenue: 54200, orders: 18, delivered: 16 },
        { month: 'May', revenue: 48900, orders: 16, delivered: 14 },
        { month: 'Jun', revenue: 61200, orders: 21, delivered: 19 },
        { month: 'Jul', revenue: 55800, orders: 19, delivered: 17 },
        { month: 'Aug', revenue: 49300, orders: 17, delivered: 15 },
        { month: 'Sep', revenue: 67200, orders: 22, delivered: 20 },
        { month: 'Oct', revenue: 59800, orders: 20, delivered: 18 },
        { month: 'Nov', revenue: 72300, orders: 25, delivered: 23 },
        { month: 'Dec', revenue: 84500, orders: 28, delivered: 26 }
      ],
      weekly: [
        { week: 'Week 1', revenue: 15200, orders: 5, delivered: 4 },
        { week: 'Week 2', revenue: 18300, orders: 6, delivered: 5 },
        { week: 'Week 3', revenue: 21400, orders: 7, delivered: 6 },
        { week: 'Week 4', revenue: 24500, orders: 8, delivered: 7 }
      ],
      yearly: [
        { year: '2021', revenue: 385000, orders: 150, delivered: 120 },
        { year: '2022', revenue: 452000, orders: 180, delivered: 150 },
        { year: '2023', revenue: 598000, orders: 220, delivered: 190 },
        { year: '2024', revenue: 725000, orders: 260, delivered: 230 }
      ]
    };

    if (!dateRange) {
      return {
        chartData: [],
        summary: {
          totalRevenue: 0,
          totalOrders: 0,
          totalDelivered: 0,
          averageOrderValue: 0,
          successRate: 0
        }
      };
    }

    const data = salesData[dateRange] || [];

    const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
    const totalOrders = data.reduce((sum, item) => sum + item.orders, 0);
    const totalDelivered = data.reduce((sum, item) => sum + item.delivered, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      chartData: data,
      summary: {
        totalRevenue,
        totalOrders,
        totalDelivered,
        averageOrderValue,
        successRate: totalOrders > 0 ? (totalDelivered / totalOrders) * 100 : 0
      }
    };
  }, [dateRange]);

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
          <Link to="/admin-sales-report" className="active"><FiBarChart2 className="sidebar-icon"/> Sales Report</Link>
        </nav>
      </aside>

      <main className="main-content">
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
