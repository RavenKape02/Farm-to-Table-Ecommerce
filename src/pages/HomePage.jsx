import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './HomePage.css';

const HomePage = () => {
  const { userInfo } = useContext(AuthContext);
  const [pendingOrders, setPendingOrders] = useState([]);

  useEffect(() => {
    const fetchPendingOrders = async () => {
      if (userInfo && !userInfo.isAdmin && !userInfo.isMerchant) {
        try {
          const { data } = await axios.get(`/api/orders/user/${userInfo._id}`);
          const pending = data.orders.filter(order => order.orderStatus === 0);
          setPendingOrders(pending);
        } catch (error) {
          console.error('Error fetching pending orders:', error);
        }
      }
    };

    fetchPendingOrders();
  }, [userInfo]);

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to Farm2Table</h1>
        {userInfo && <p>Hello, {userInfo.firstName}!</p>}
        <p>Your one-stop shop for fresh agricultural products</p>
      </div>

      {userInfo && !userInfo.isAdmin && !userInfo.isMerchant && pendingOrders.length > 0 && (
        <div className="pending-orders-section">
          <h2>Your Pending Orders</h2>
          <div className="orders-grid">
            {pendingOrders.map((order) => (
              <div key={order._id} className="order-card">
                <h3>Order #{order._id.slice(-6)}</h3>
                <p>Date: {order.dateOrdered}</p>
                <p>Time: {order.time}</p>
                <p>Status: Pending</p>
                <div className="order-items">
                  {order.products.map((item, index) => (
                    <div key={index} className="order-item">
                      <p>{item.product.productName} x {item.quantity}</p>
                      <p>₱{item.product.productPrice * item.quantity}</p>
                    </div>
                  ))}
                </div>
                <p className="order-total">Total: ₱{order.products.reduce((sum, item) => 
                  sum + (item.product.productPrice * item.quantity), 0)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

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