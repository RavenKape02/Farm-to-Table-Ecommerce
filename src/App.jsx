import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import MerchantDashboard from './pages/MerchantDashboard';
import Spinner from './components/Spinner';
import { useContext, useEffect } from 'react';
import { AuthContext } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

function AppContent() {
  const { loading, isAuthenticated, isAdmin, isMerchant } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated && !loading) {
      if (isAdmin) {
        console.log('User is admin, should see admin dashboard');
      } else if (isMerchant) {
        console.log('User is merchant, should see merchant dashboard');
      } else {
        console.log('User is customer, should see customer view');
      }
    }
  }, [isAuthenticated, isAdmin, isMerchant, loading]);

  if (loading) {
    return <Spinner text="Loading application..." />;
  }

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<div>Profile Page (Coming Soon)</div>} />
            <Route path="/orders" element={<div>Order History (Coming Soon)</div>} />
            <Route path="/shop" element={<div>Shop (Coming Soon)</div>} />
            <Route path="/cart" element={<div>Shopping Cart (Coming Soon)</div>} />
          </Route>
          
          {/* Admin Routes */}
          <Route element={<PrivateRoute adminOnly={true} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
          
          {/* Merchant Routes */}
          <Route element={<PrivateRoute merchantOnly={true} />}>
            <Route path="/merchant" element={<MerchantDashboard />} />
          </Route>
          
          {/* Catch All */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
