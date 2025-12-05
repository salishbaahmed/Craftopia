import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AdminSideBar.css';
import { 
  FiHome, FiPlus, FiEdit, FiTrash2, FiEye,
  FiPackage, FiTruck, FiMessageCircle, FiBarChart2 
} from 'react-icons/fi';

const AdminSidebar = () => {
  const location = useLocation();

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="/craftopia logo.png" alt="Craftopia Logo" className="sidebar-logo-img" />
        <h2>Craftopia</h2>
      </div>

      <nav className="sidebar-nav">
        <Link 
          to="/admin" 
          className={isActiveLink('/admin') ? 'nav-link active' : 'nav-link'}
        >
          <FiHome className="sidebar-icon"/> Dashboard
        </Link>
        <Link 
          to="/admin-add-product" 
          className={isActiveLink('/admin-add-product') ? 'nav-link active' : 'nav-link'}
        >
          <FiPlus className="sidebar-icon"/> Add Product
        </Link>
        <Link 
          to="/admin-update-product" 
          className={isActiveLink('/admin-update-product') ? 'nav-link active' : 'nav-link'}
        >
          <FiEdit className="sidebar-icon"/> Update Product
        </Link>
        <Link 
          to="/admin-delete-product" 
          className={isActiveLink('/admin-delete-product') ? 'nav-link active' : 'nav-link'}
        >
          <FiTrash2 className="sidebar-icon"/> Delete Product
        </Link>
        <Link 
          to="/admin-view-orders" 
          className={isActiveLink('/admin-view-orders') ? 'nav-link active' : 'nav-link'}
        >
          <FiEye className="sidebar-icon"/> View Orders
        </Link>
        <Link 
          to="/admin-manage-orders" 
          className={isActiveLink('/admin-manage-orders') ? 'nav-link active' : 'nav-link'}
        >
          <FiPackage className="sidebar-icon"/> Manage Orders
        </Link>
        <Link 
          to="/admin-delivery-status" 
          className={isActiveLink('/admin-delivery-status') ? 'nav-link active' : 'nav-link'}
        >
          <FiTruck className="sidebar-icon"/> Delivery Status
        </Link>
        <Link 
          to="/admin-customer-feedback" 
          className={isActiveLink('/admin-customer-feedback') ? 'nav-link active' : 'nav-link'}
        >
          <FiMessageCircle className="sidebar-icon"/> Customer Feedback
        </Link>
        <Link 
          to="/admin-sales-report" 
          className={isActiveLink('/admin-sales-report') ? 'nav-link active' : 'nav-link'}
        >
          <FiBarChart2 className="sidebar-icon"/> Sales Report
        </Link>
      </nav>
    </aside>
  );
};

export default AdminSidebar;