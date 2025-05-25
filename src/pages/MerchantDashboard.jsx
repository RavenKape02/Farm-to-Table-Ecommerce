import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './MerchantDashboard.css';
import AddProductModal from '../components/AddProduct';

const MerchantDashboard = () => {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const { userInfo } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    pendingOrders: 0,
    products: []
  });
  const [loading, setLoading] = useState(true);

  const fetchMerchantData = async () => {
    try {
      //get all products in mongodb
      const response = await axios.get('/api/products/');
      const products = response.data.products.map(prod => ({
        id: prod._id, 
        name: prod.productName,
        category: prod.productType == 1 ? "Crop" : prod.productType == 2 ? "Poultry" : "Other",
        price: Number(prod.productPrice),
        stock: Number(prod.productQuantity)
      }));
      //placeholder data lang to for looks
      setStats({
        totalProducts: response.data.products.length,
        totalSales: 12500,
        pendingOrders: 4,
        products
      });
    } catch (error) {
      console.error('Error fetching merchant data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchantData();
  }, []);

  return (
    <div className="merchant-dashboard">
      <div className="dashboard-header">
        <h1>Merchant Dashboard</h1>
        <p>Welcome, Department of Agriculture!</p>
      </div>

      {loading ? (
        <div className="loading">Loading dashboard data...</div>
      ) : (
        <>
          <div className="stats-cards">
            <div className="stat-card">
              <h3>Your Products</h3>
              <p className="stat-value">{stats.totalProducts}</p>
              <p className="stat-label">Products in inventory</p>
            </div>
            
            <div className="stat-card">
              <h3>Total Sales</h3>
              <p className="stat-value">₱{stats.totalSales.toLocaleString()}</p>
              <p className="stat-label">Revenue generated</p>
            </div>
            
            <div className="stat-card">
              <h3>Pending Orders</h3>
              <p className="stat-value">{stats.pendingOrders}</p>
              <p className="stat-label">Orders to fulfill</p>
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2>Your Products</h2>
              <button className="add-product-btn" onClick={() => setShowAddProduct(true)}>Add New Product</button>
              {
                showAddProduct?
                <AddProductModal close={setShowAddProduct} refreshProducts={fetchMerchantData}/>:''
              }
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product ID</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.products.map(product => (
                    <tr key={product.id}>
                      <td>#{product.id}</td>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>₱{product.price.toFixed(2)}</td>
                      <td>
                        <span className={`stock-badge ${product.stock < 20 ? 'low' : 'ok'}`}>
                          {product.stock} units
                        </span>
                      </td>
                      <td className="action-buttons">
                        <button className="action-btn edit-btn">Edit</button>
                        <button className="action-btn delete-btn">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="dashboard-section">
            <h2>Quick Access</h2>
            <div className="quick-actions">
              <button className="quick-action-btn">
                <span className="icon">📦</span>
                Manage Inventory
              </button>
              <button className="quick-action-btn">
                <span className="icon">🚚</span>
                Order Fulfillment
              </button>
              <button className="quick-action-btn">
                <span className="icon">📊</span>
                Sales Analytics
              </button>
              <button className="quick-action-btn">
                <span className="icon">🔔</span>
                Notifications
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MerchantDashboard; 