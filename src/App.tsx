import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterUser from './pages/RegisterUser';
import RegisterProduct from './pages/RegisterProduct';
import Login from './pages/LoginPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register-user" element={<RegisterUser />} />
        <Route path="/register-product" element={<RegisterProduct />} />
      </Routes>
    </Router>
  );
};

export default App;
