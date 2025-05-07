import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { userInfo, isAuthenticated, isAdmin, isMerchant, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          Market Express
        </Link>
        
        <nav className="nav">
          {isAuthenticated ? (
            <>
              <Link to="/shop" className="nav-link">Shop</Link>
              
              {!isAdmin && !isMerchant && (
                <Link to="/cart" className="nav-link">Cart</Link>
              )}
              
              <div className="dropdown">
                <button className="dropdown-btn">
                  {userInfo?.firstName || 'Account'}
                </button>
                <div className="dropdown-content">
                  <Link to="/profile" className="dropdown-link">Profile</Link>
                  
                  {!isAdmin && !isMerchant && (
                    <Link to="/orders" className="dropdown-link">Orders</Link>
                  )}
                  
                  {isAdmin && (
                    <Link to="/admin" className="dropdown-link">Admin Dashboard</Link>
                  )}
                  
                  {isMerchant && (
                    <Link to="/merchant" className="dropdown-link">Merchant Dashboard</Link>
                  )}
                  
                  <button onClick={handleLogout} className="dropdown-link logout-btn">
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link register-btn">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header; 