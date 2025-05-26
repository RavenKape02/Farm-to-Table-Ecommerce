import { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Header.css';
import farm2tableLogo from '../assets/farm2table.PNG';

const Header = () => {
  const { userInfo, isAuthenticated, isAdmin, isMerchant, logout, cartCount } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      <div className="container">
        <Link to={isAdmin ? "/admin" : "/"} className="logo">
          <img
            src={farm2tableLogo}
            alt="Farm-to-Table Logo"
            style={{ height: '80px', width: 'auto' }} />
        </Link>

        <button className="hamburger" onClick={toggleMenu}>
          ☰
        </button>

        <nav className={`nav ${menuOpen ? 'open' : ''}`}>
          {location.pathname !== '/login' && location.pathname !== '/register' && !isAdmin && (
            <>
              <Link to="/shop" className="nav-link" onClick={() => setMenuOpen(false)}>Shop</Link>
              {isAuthenticated && !isMerchant && (
                <Link to="/orders" className="nav-link" onClick={() => setMenuOpen(false)}>Orders</Link>
              )}
            </>
          )}

          {isAuthenticated && !isAdmin && !isMerchant && (
            <Link to="/cart" className="nav-link cart-link" onClick={() => setMenuOpen(false)}>
              Cart
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          )}

          {isAuthenticated ? (
            <div className="dropdown">
              <button className="dropdown-btn">
                {userInfo?.firstName || 'Account'}
              </button>
              <div className="dropdown-content">
                {isMerchant && (
                  <Link to="/merchant" className="dropdown-link">Merchant Dashboard</Link>
                )}
                <button onClick={handleLogout} className="dropdown-link logout-btn">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="nav-link register-btn" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
