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
import CustomerMain from './pages/CustomerPages/CustomerLandingPage/CustomerLandingPage';
import CustomerCart from './pages/CustomerPages/CustomerCart/CustomerCart';
import CustomerCheckout from './pages/CustomerPages/CustomerCheckout/CustomerCheckout';
import CustomerMakePayment from './pages/CustomerPages/CustomerMakePayment/CustomerMakePayment';
import CustomerOrderConfirmation from './pages/CustomerPages/CustomerOrderConfirmation/CustomerOrderConfirmation';
import CustomerViewRewards from './pages/CustomerPages/CustomerViewRewards/CustomerViewRewards';
import CustomerWishlist from './pages/CustomerPages/CustomerWishlist/CustomerWishlist';
import CustomerMyAccount from './pages/CustomerPages/CustomerMyAccount/CustomerMyAccount';
import CustomerUpdateProfile from './pages/CustomerPages/CustomerUpdateProfile/CustomerUpdateProfile';
import CustomerOrders from './pages/CustomerPages/CustomerOrders/CustomerOrders';
import CustomerManageAddress from './pages/CustomerPages/CustomerManageAddress/CustomerManageAddress';
import CustomerTrackOrder from './pages/CustomerPages/CustomerTrackOrder/CustomerTrackOrder'; 
import CustomerProductRating from './pages/CustomerPages/CustomerProductRating/CustomerProductRating';
import CustomerRefund from './pages/CustomerPages/CustomerRefund/CustomerRefund';
import CustomerFAQ from './pages/CustomerPages/CustomerFAQ/CustomerFAQ';
import CustomerContactSupport from './pages/CustomerPages/CustomerContactSupport/CustomerContactSupport';
import CustomerQuiz from './pages/CustomerPages/CustomerQuiz/CustomerQuiz';
import CustomerSendGift from './pages/CustomerPages/CustomerSendGift/CustomerSendGift';


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
          <Route path="/customer" element={<CustomerMain />} />
          <Route path="/customer-cart" element={<CustomerCart />} />
          <Route path="/customer-checkout" element={<CustomerCheckout />} />
          <Route path="/customer-make-payment" element={<CustomerMakePayment />} />
          <Route path="/customer-order-confirmation" element={<CustomerOrderConfirmation />} />
          <Route path="/customer-view-rewards" element={<CustomerViewRewards />} />
          <Route path="/customer-wishlist" element={<CustomerWishlist />} />
          <Route path="/customer-my-account" element={<CustomerMyAccount />} />
          <Route path="/customer-update-profile" element={<CustomerUpdateProfile />} />
          <Route path="/customer-orders" element={<CustomerOrders />} />
          <Route path="/customer-manage-address" element={<CustomerManageAddress />} />
          <Route path="/customer-track-order" element={<CustomerTrackOrder />} />
          <Route path="/customer-product-rating" element={<CustomerProductRating />} />
          <Route path="/customer-refund" element={<CustomerRefund />} />
          <Route path="/customer-faq" element={<CustomerFAQ />} />
          <Route path="/customer-contact-support" element={<CustomerContactSupport />} />
          <Route path="/customer-quiz" element={<CustomerQuiz />} />
          <Route path="/customer-send-gift" element={<CustomerSendGift />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
