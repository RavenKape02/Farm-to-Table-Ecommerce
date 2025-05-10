import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { userInfo } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        //place holder data para sa admin dashboard
        setStats({
          totalProducts: 24,
          totalUsers: 15,
          totalOrders: 8,
          recentOrders: [
            { id: '1001', customer: 'Juan Dela Cruz', date: '2025-05-06', status: 'Delivered', total: 1250 },
            { id: '1002', customer: 'Maria Santos', date: '2025-05-06', status: 'Processing', total: 890 },
            { id: '1003', customer: 'Pedro Reyes', date: '2025-05-05', status: 'Pending', total: 1450 }
          ]
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, {userInfo?.firstName || 'Admin'}!</p>
      </div>

      {loading ? (
        <div className="loading">Loading dashboard data...</div>
      ) : (
        <>
          <div className="stats-cards">
            <div className="stat-card">
              <h3>Total Products</h3>
              <p className="stat-value">{stats.totalProducts}</p>
              <p className="stat-label">Products in inventory</p>
            </div>
            
            <div className="stat-card">
              <h3>Total Users</h3>
              <p className="stat-value">{stats.totalUsers}</p>
              <p className="stat-label">Registered customers</p>
            </div>
            
            <div className="stat-card">
              <h3>Total Orders</h3>
              <p className="stat-value">{stats.totalOrders}</p>
              <p className="stat-label">Orders processed</p>
            </div>
          </div>

          <div className="dashboard-section">
            <h2>Recent Orders</h2>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map(order => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.date}</td>
                      <td>
                        <span className={`status-badge ${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>₱{order.total.toFixed(2)}</td>
                      <td>
                        <button className="action-btn view-btn">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="dashboard-section">
            <h2>Quick Actions</h2>
            <div className="quick-actions">
              <button className="quick-action-btn">
                <span className="icon">+</span>
                Add New Product
              </button>
              <button className="quick-action-btn">
                <span className="icon">📋</span>
                View All Orders
              </button>
              <button className="quick-action-btn">
                <span className="icon">👥</span>
                Manage Users
              </button>
              <button className="quick-action-btn">
                <span className="icon">📊</span>
                Sales Reports
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard; 