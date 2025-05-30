import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import BookDetailsPage from './pages/BookDetailsPage';
import LoginPage from './pages/LoginPage';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderApprovedPage from './pages/OrderApprovedPage';
import OrderDeniedPage from './pages/OrderDeniedPage';
import AccountPage from './pages/AccountPage';
import OrdersPage from './pages/OrdersPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import { CartProvider } from './contexts/CartContext';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  React.useEffect(() => {
    // Ensure authentication state is initialized
    if (!localStorage.getItem('isAuthenticated')) {
      localStorage.setItem('isAuthenticated', 'true');
    }
  }, []);

  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }>
            <Route index element={<HomePage />} />
            <Route path="book/:id" element={<BookDetailsPage />} />
            <Route path="shop" element={<ShopPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="order-approved" element={<OrderApprovedPage />} />
            <Route path="order-denied" element={<OrderDeniedPage />} />
            <Route path="account" element={<AccountPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;