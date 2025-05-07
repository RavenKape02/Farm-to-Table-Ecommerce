import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const HomePage = () => {
  const { userInfo } = useContext(AuthContext);

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to Market Express</h1>
        {userInfo && <p>Hello, {userInfo.firstName}!</p>}
        <p>Your one-stop shop for fresh agricultural products</p>
      </div>

      <div className="features-section">
        <div className="feature">
          <h3>Fresh Products</h3>
          <p>Direct from farms to your table</p>
        </div>
        <div className="feature">
          <h3>Fast Delivery</h3>
          <p>Get your orders quickly</p>
        </div>
        <div className="feature">
          <h3>Quality Guaranteed</h3>
          <p>Only the best products for you</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 