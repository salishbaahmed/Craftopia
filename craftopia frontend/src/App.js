import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import AdminLogin from './pages/AdminLogin/AdminLogin';
import CustomerLogin from './pages/CustomerLogin/CustomerLogin';
import CustomerSignup from './pages/CustomerSignup/CustomerSignup';
import AdminMain from './pages/AdminMain/AdminMain';
import AdminAddProduct from './pages/AdminAddProduct/AdminAddProduct';
import AdminDeleteProduct from './pages/AdminDeleteProduct/AdminDeleteProduct';
import AdminUpdateProduct from './pages/AdminUpdateProduct/AdminUpdateProduct';
import AdminViewOrders from './pages/AdminViewOrders/AdminViewOrders';
import AdminManageOrders from './pages/AdminManageOrders/AdminManageOrders';
import AdminDeliveryStatus from './pages/AdminDeliveryStatus/AdminDeliveryStatus';
import AdminCustomerFeedback from './pages/AdminCustomerFeedback/AdminCustomerFeedback';
import AdminSalesReport from './pages/AdminSalesReport/AdminSalesReport';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminMain />} />
          <Route path="/admin-add-product" element={<AdminAddProduct />} />
          <Route path="/admin-delete-product" element={<AdminDeleteProduct />} />
          <Route path="/admin-update-product" element={<AdminUpdateProduct />} />
          <Route path="/admin-view-orders" element={<AdminViewOrders />} />
          <Route path="/admin-manage-orders" element={<AdminManageOrders />} />
          <Route path="/admin-delivery-status" element={<AdminDeliveryStatus />} />
          <Route path="/admin-customer-feedback" element={<AdminCustomerFeedback />} />
          <Route path="/admin-sales-report" element={<AdminSalesReport />} />
          <Route path="/customer-login" element={<CustomerLogin />} />
          <Route path="/customer-signup" element={<CustomerSignup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
