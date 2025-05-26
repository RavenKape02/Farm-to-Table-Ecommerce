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
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
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

  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      console.log('Updating product:', editingProduct);
      const response = await axios.patch(`/api/products/${editingProduct._id}`, editingProduct);
      console.log('Update response:', response.data);
      
      // Fetch fresh data after successful update
      const productsResponse = await axios.get('/api/products');
      setProducts(productsResponse.data.products);
      
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    }
  };

  const handleDeleteProduct = async () => {
    try {
      const productId = deletingProduct._id;
      console.log('Attempting to delete product with ID:', productId);
      
      // Log the full URL we're trying to hit
      const deleteUrl = `/api/products/${productId}`;
      console.log('Delete URL:', deleteUrl);
      
      const response = await axios({
        method: 'delete',
        url: deleteUrl,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Delete response:', response);
      
      if (response.status === 200) {
        setProducts(products.filter(p => p._id !== productId));
        setDeletingProduct(null);
      }
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
      
      if (error.response?.status === 404) {
        alert('Product not found. It may have been already deleted.');
      } else {
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct(prev => ({
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
        <p>Welcome back, Administrator</p>
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
        <button 
          className={`quick-action-btn ${isEditMode ? 'active' : ''}`} 
          onClick={() => setIsEditMode(!isEditMode)}
        >
          <span className="icon">📦</span>
          {isEditMode ? 'View Products' : 'Manage Products'}
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
          <div className="section-header">
            <h2>Add New Product</h2>
            <button 
              className="close-btn"
              onClick={() => setShowAddProduct(false)}
            >
              ✕
            </button>
          </div>
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
                {isEditMode && <th>Actions</th>}
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
                  {isEditMode && (
                    <td>
                      <button 
                        className="action-btn edit-btn"
                        onClick={() => setEditingProduct({...product})}
                      >
                        ✏️
                      </button>
                      <button 
                        className="action-btn delete-btn"
                        onClick={() => setDeletingProduct(product)}
                      >
                        🗑️
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingProduct && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Product</h2>
            <form onSubmit={handleEditProduct} className="edit-product-form">
              <input
                type="text"
                name="productName"
                placeholder="Product Name"
                value={editingProduct.productName}
                onChange={handleEditInputChange}
                required
              />
              <select
                name="productType"
                value={editingProduct.productType}
                onChange={handleEditInputChange}
                required
              >
                <option value={1}>Crop</option>
                <option value={2}>Poultry</option>
              </select>
              <input
                type="number"
                name="productPrice"
                placeholder="Price"
                value={editingProduct.productPrice}
                onChange={handleEditInputChange}
                required
              />
              <textarea
                name="productDescription"
                placeholder="Product Description"
                value={editingProduct.productDescription}
                onChange={handleEditInputChange}
                required
              />
              <input
                type="number"
                name="productQuantity"
                placeholder="Quantity"
                value={editingProduct.productQuantity}
                onChange={handleEditInputChange}
                required
              />
              <div className="modal-buttons">
                <button type="submit">Save Changes</button>
                <button type="button" onClick={() => setEditingProduct(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deletingProduct && (
        <div className="modal">
          <div className="modal-content delete-confirmation">
            <h2>Delete Product</h2>
            <p>Are you sure you want to delete "{deletingProduct.productName}"?</p>
            <p className="warning-text">This action cannot be undone.</p>
            <div className="modal-buttons">
              <button 
                className="delete-confirm-btn"
                onClick={handleDeleteProduct}
              >
                Delete Product
              </button>
              <button 
                className="cancel-btn"
                onClick={() => setDeletingProduct(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 