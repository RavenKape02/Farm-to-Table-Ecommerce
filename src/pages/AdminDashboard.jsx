import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [sortField, setSortField] = useState('productName');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    productName: '',
    productType: 1,
    productPrice: '',
    productDescription: '',
    productQuantity: ''
  });
  const { userInfo } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, productsResponse, transactionsResponse] = await Promise.all([
          axios.get('/api/users'),
          axios.get('/api/products'),
          axios.get('/api/transactions')
        ]);
        console.log('Fetched users:', usersResponse.data);
        setUsers(usersResponse.data);
        setProducts(productsResponse.data.products || []);
        setTransactions(transactionsResponse.data || []);
      } catch (error) {
        console.error('Error fetching data:', error.response ? error.response.data : error.message);
      }
    };
    fetchData();
  }, []);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'productPrice' || sortField === 'productQuantity') {
      comparison = a[sortField] - b[sortField];
    } else {
      comparison = a[sortField].localeCompare(b[sortField]);
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/products', newProduct);
      setProducts([...products, response.data]);
      setShowAddProduct(false);
      setNewProduct({
        productName: '',
        productType: 1,
        productPrice: '',
        productDescription: '',
        productQuantity: ''
      });
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: name === 'productType' ? parseInt(value) : value
    }));
  };

  const totalRevenue = transactions
    .filter(t => t.orderStatus === 1) 
    .reduce((sum, t) => sum + (t.orderQuantity * t.productPrice), 0);

  const pendingOrders = transactions.filter(t => t.orderStatus === 0).length;
  const completedOrders = transactions.filter(t => t.orderStatus === 1).length;
  const lowStockProducts = products.filter(p => p.productQuantity < 10).length;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, {userInfo?.email}</p>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <h3>Total Users</h3>
          <div className="stat-value">{users.length}</div>
          <div className="stat-label">Registered Users</div>
        </div>
        <div className="stat-card">
          <h3>Total Products</h3>
          <div className="stat-value">{products.length}</div>
          <div className="stat-label">Active Products</div>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <div className="stat-value">₱{totalRevenue.toFixed(2)}</div>
          <div className="stat-label">From Completed Orders</div>
        </div>
        <div className="stat-card">
          <h3>Pending Orders</h3>
          <div className="stat-value">{pendingOrders}</div>
          <div className="stat-label">Awaiting Processing</div>
        </div>
      </div>

      <div className="quick-actions">
        <button className="quick-action-btn" onClick={() => setShowAddProduct(true)}>
          <span className="icon">➕</span>
          Add New Product
        </button>
        <button className="quick-action-btn" onClick={() => window.location.href = '/admin/products'}>
          <span className="icon">📦</span>
          Manage Products
        </button>
        <button className="quick-action-btn" onClick={() => window.location.href = '/admin/orders'}>
          <span className="icon">📋</span>
          View Orders
        </button>
        <button className="quick-action-btn" onClick={() => window.location.href = '/admin/users'}>
          <span className="icon">👥</span>
          Manage Users
        </button>
      </div>

      {showAddProduct && (
        <div className="dashboard-section">
          <h2>Add New Product</h2>
          <form onSubmit={handleAddProduct} className="add-product-form">
            <input
              type="text"
              name="productName"
              placeholder="Product Name"
              value={newProduct.productName}
              onChange={handleInputChange}
              required
            />
            <select
              name="productType"
              value={newProduct.productType}
              onChange={handleInputChange}
              required
            >
              <option value={1}>Crop</option>
              <option value={2}>Poultry</option>
            </select>
            <input
              type="number"
              name="productPrice"
              placeholder="Price"
              value={newProduct.productPrice}
              onChange={handleInputChange}
              required
            />
            <textarea
              name="productDescription"
              placeholder="Product Description"
              value={newProduct.productDescription}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="productQuantity"
              placeholder="Quantity"
              value={newProduct.productQuantity}
              onChange={handleInputChange}
              required
            />
            <button type="submit">Add Product</button>
          </form>
        </div>
      )}

      <div className="dashboard-section">
        <h2>Recent Transactions</h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Email</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 5).map(transaction => (
                <tr key={transaction._id}>
                  <td>{transaction.productID}</td>
                  <td>{transaction.orderQuantity}</td>
                  <td>
                    <span className={`status-badge ${
                      transaction.orderStatus === 0 ? 'pending' :
                      transaction.orderStatus === 1 ? 'delivered' : 'processing'
                    }`}>
                      {transaction.orderStatus === 0 ? 'Pending' :
                       transaction.orderStatus === 1 ? 'Completed' : 'Processing'}
                    </span>
                  </td>
                  <td>{transaction.email}</td>
                  <td>{new Date(transaction.dateOrdered).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Products</h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Type</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id}>
                  <td>{product.productName}</td>
                  <td>
                    <span className={`status-badge ${
                      product.productType === 1 ? 'delivered' : 'processing'
                    }`}>
                      {product.productType === 1 ? 'Crop' : 'Poultry'}
                    </span>
                  </td>
                  <td>₱{product.productPrice}</td>
                  <td>
                    <span className={`status-badge ${
                      product.productQuantity < 10 ? 'pending' : 'delivered'
                    }`}>
                      {product.productQuantity}
                    </span>
                  </td>
                  <td>{product.productDescription}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 