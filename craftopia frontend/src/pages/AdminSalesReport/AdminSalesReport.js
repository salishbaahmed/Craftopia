import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminSalesReport.css';
import { 
  FiHome, FiPlus, FiEdit, FiTrash2, FiEye,
  FiPackage, FiTruck, FiMessageCircle, FiBarChart2, FiDownload, FiTrendingUp, FiDollarSign,
  FiShoppingBag, FiUsers
} from 'react-icons/fi';

const AdminSalesReport = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('month');
  const [selectedYear, setSelectedYear] = useState('2024');

  const salesData = {
    summary: {
      totalRevenue: 458700,
      totalOrders: 156,
      averageOrderValue: 2940,
      topSellingProduct: 'Handmade Ceramic Vase'
    },
    monthlyData: [
      { month: 'Jan', revenue: 38500, orders: 12 },
      { month: 'Feb', revenue: 42500, orders: 15 },
      { month: 'Mar', revenue: 67800, orders: 23 },
      { month: 'Apr', revenue: 54200, orders: 18 },
      { month: 'May', revenue: 48900, orders: 16 },
      { month: 'Jun', revenue: 61200, orders: 21 },
      { month: 'Jul', revenue: 55800, orders: 19 },
      { month: 'Aug', revenue: 49300, orders: 17 },
      { month: 'Sep', revenue: 67200, orders: 22 },
      { month: 'Oct', revenue: 0, orders: 0 },
      { month: 'Nov', revenue: 0, orders: 0 },
      { month: 'Dec', revenue: 0, orders: 0 }
    ],
    topProducts: [
      { name: 'Handmade Ceramic Vase', sales: 45, revenue: 382500 },
      { name: 'Embroidered Shawl', sales: 38, revenue: 76000 },
      { name: 'Wooden Jewelry Box', sales: 32, revenue: 160000 },
      { name: 'Leather Wallet', sales: 28, revenue: 156800 },
      { name: 'Wool Scarf', sales: 25, revenue: 80000 }
    ],
    revenueByCategory: [
      { category: 'Home Decor', revenue: 285000, percentage: 62 },
      { category: 'Fashion', revenue: 98000, percentage: 21 },
      { category: 'Jewelry', revenue: 56700, percentage: 12 },
      { category: 'Art', revenue: 19000, percentage: 5 }
    ]
  };

  const handleLogout = () => navigate('/admin-login');

  const exportReport = () => {
    alert('Sales report exported successfully!');
    console.log('Exporting sales report data...');
  };

  const formatCurrency = (amount) => {
    return `Rs ${amount.toLocaleString()}`;
  };

  const getProgressBarColor = (percentage) => {
    if (percentage >= 70) return '#059669';
    if (percentage >= 40) return '#d97706';
    return '#dc2626';
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
          <h1>Sales Report</h1>
          <div className="header-actions">
            <button className="export-btn" onClick={exportReport}>
              <FiDownload />
              Export Report
            </button>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </header>

        <div className="sales-report-content">
          {/* Filters */}
          <div className="report-filters">
            <div className="filter-group">
              <label>Date Range:</label>
              <select 
                value={dateRange} 
                onChange={(e) => setDateRange(e.target.value)}
                className="filter-select"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
            </div>
            <div className="filter-group">
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

          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card revenue-card">
              <div className="card-icon">
                <FiDollarSign />
              </div>
              <div className="card-content">
                <div className="card-value">{formatCurrency(salesData.summary.totalRevenue)}</div>
                <div className="card-label">Total Revenue</div>
                <div className="card-trend positive">
                  <FiTrendingUp />
                  +12.5% from last month
                </div>
              </div>
            </div>

            <div className="summary-card orders-card">
              <div className="card-icon">
                <FiShoppingBag />
              </div>
              <div className="card-content">
                <div className="card-value">{salesData.summary.totalOrders}</div>
                <div className="card-label">Total Orders</div>
                <div className="card-trend positive">
                  <FiTrendingUp />
                  +8.3% from last month
                </div>
              </div>
            </div>

            <div className="summary-card aov-card">
              <div className="card-icon">
                <FiTrendingUp />
              </div>
              <div className="card-content">
                <div className="card-value">{formatCurrency(salesData.summary.averageOrderValue)}</div>
                <div className="card-label">Average Order Value</div>
                <div className="card-trend positive">
                  <FiTrendingUp />
                  +4.2% from last month
                </div>
              </div>
            </div>

            <div className="summary-card top-product-card">
              <div className="card-icon">
                <FiUsers />
              </div>
              <div className="card-content">
                <div className="card-value">{salesData.summary.topSellingProduct}</div>
                <div className="card-label">Top Selling Product</div>
                <div className="card-trend">
                  45 units sold
                </div>
              </div>
            </div>
          </div>

          {/* Charts and Detailed Data */}
          <div className="report-details">
            {/* Revenue Chart Section */}
            <div className="chart-section">
              <div className="section-header">
                <h3>Monthly Revenue</h3>
                <span className="section-subtitle">Revenue trends for {selectedYear}</span>
              </div>
              <div className="revenue-chart">
                {salesData.monthlyData.map((month, index) => (
                  <div key={month.month} className="chart-bar-container">
                    <div className="chart-bar-label">{month.month}</div>
                    <div className="chart-bar">
                      <div 
                        className="chart-bar-fill"
                        style={{ 
                          height: month.revenue > 0 ? `${(month.revenue / 70000) * 100}%` : '0%',
                          backgroundColor: month.revenue > 0 ? '#14B8A6' : '#e5e7eb'
                        }}
                      ></div>
                    </div>
                    <div className="chart-bar-value">
                      {month.revenue > 0 ? formatCurrency(month.revenue) : '-'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Products Section */}
            <div className="top-products-section">
              <div className="section-header">
                <h3>Top Selling Products</h3>
                <span className="section-subtitle">Best performing products</span>
              </div>
              <div className="products-list">
                {salesData.topProducts.map((product, index) => (
                  <div key={product.name} className="product-item">
                    <div className="product-rank">#{index + 1}</div>
                    <div className="product-info">
                      <div className="product-name">{product.name}</div>
                      <div className="product-sales">{product.sales} units sold</div>
                    </div>
                    <div className="product-revenue">{formatCurrency(product.revenue)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue by Category */}
            <div className="category-section">
              <div className="section-header">
                <h3>Revenue by Category</h3>
                <span className="section-subtitle">Sales distribution across categories</span>
              </div>
              <div className="category-list">
                {salesData.revenueByCategory.map(category => (
                  <div key={category.category} className="category-item">
                    <div className="category-header">
                      <span className="category-name">{category.category}</span>
                      <span className="category-percentage">{category.percentage}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${category.percentage}%`,
                          backgroundColor: getProgressBarColor(category.percentage)
                        }}
                      ></div>
                    </div>
                    <div className="category-revenue">{formatCurrency(category.revenue)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* No Data State */}
          {salesData.summary.totalOrders === 0 && (
            <div className="no-sales-data">
              <FiBarChart2 className="no-data-icon" />
              <h3>No Sales Data Available</h3>
              <p>There are no sales records for the selected period.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminSalesReport;