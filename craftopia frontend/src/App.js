import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import AdminLogin from './pages/AdminLogin/AdminLogin';
import CustomerLogin from './pages/CustomerLogin/CustomerLogin';
import CustomerSignup from './pages/CustomerSignup/CustomerSignup';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/customer-login" element={<CustomerLogin />} />
          <Route path="/customer-signup" element={<CustomerSignup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;