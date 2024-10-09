import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/HomePage';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import Profile from './pages/UserProfilePage';
import CreateProduct from './pages/ProductRegistrationPage';
import CreateOrder from './pages/OrderPage';
import CreateOrderByProductId from './pages/OrderPage';
import PaymentOrder from './pages/PaymentPage';
import CreateCategory from './pages/CategoryRegistration';
import AdminDashboard from './pages/AdminPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/createProduct" element={<CreateProduct />} />
        <Route path="/createOrder" element={<CreateOrder />} />
        <Route path="/createCategory" element={<CreateCategory />} />
        <Route path="/createOrderByProductId/:productId" element={<CreateOrderByProductId />} />
        <Route path="/orders/:orderId/payment" element={<PaymentOrder />} />
      
      </Routes>
    </Router>
  );
};

export default App;
