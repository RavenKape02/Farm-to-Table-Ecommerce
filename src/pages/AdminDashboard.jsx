import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [sortField, setSortField] = useState('productName');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [showOrders, setShowOrders] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [sortOrdersBy, setSortOrdersBy] = useState('dateOrdered');
  const [sortOrdersDirection, setSortOrdersDirection] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');
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
        const [usersResponse, productsResponse, ordersResponse] = await Promise.all([
          axios.get('/api/users'),
          axios.get('/api/products'),
          axios.get('/api/orders')
        ]);
        console.log('Fetched users:', usersResponse.data);
        setUsers(usersResponse.data);
        setProducts(productsResponse.data.products || []);
        setOrders(ordersResponse.data.orders || []);
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

  const totalRevenue = orders
    .filter(order => order.orderStatus === 1)
    .reduce((sum, order) => sum + order.products.reduce((orderSum, item) => 
      orderSum + ((item.productId?.productPrice || 0) * item.orderQuantity), 0), 0);

  const pendingOrders = orders.filter(order => order.orderStatus === 0);
  const completedOrders = orders.filter(order => order.orderStatus === 1).length;
  const cancelledOrders = orders.filter(order => order.orderStatus === 2).length;
  const lowStockProducts = products.filter(p => p.productQuantity < 10).length;

  // Sort and filter orders
  const sortedAndFilteredOrders = orders
    .filter(order => {
      if (filterStatus === 'all') return true;
      return order.orderStatus === parseInt(filterStatus);
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortOrdersBy === 'dateOrdered') {
        comparison = new Date(b.dateOrdered) - new Date(a.dateOrdered);
      } else if (sortOrdersBy === 'status') {
        comparison = a.orderStatus - b.orderStatus;
      } else if (sortOrdersBy === 'total') {
        const totalA = a.products.reduce((sum, item) => 
          sum + (item.productId.productPrice * item.orderQuantity), 0);
        const totalB = b.products.reduce((sum, item) => 
          sum + (item.productId.productPrice * item.orderQuantity), 0);
        comparison = totalA - totalB;
      }
      return sortOrdersDirection === 'asc' ? comparison : -comparison;
    });

  // Get current orders for pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = sortedAndFilteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(sortedAndFilteredOrders.length / ordersPerPage);

  // Change page
  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Handle sort change
  const handleSortChange = (field) => {
    if (field === sortOrdersBy) {
      setSortOrdersDirection(sortOrdersDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortOrdersBy(field);
      setSortOrdersDirection('desc');
    }
  };

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
          <div className="stat-value">{pendingOrders.length}</div>
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
        <button 
          className="quick-action-btn" 
          onClick={() => setShowOrders(true)}
        >
          <span className="icon">📋</span>
          View Orders
          {pendingOrders.length > 0 && (
            <span className="notification-badge">{pendingOrders.length}</span>
          )}
        </button>
        <button className="quick-action-btn" onClick={() => window.location.href = '/admin/users'}>
          <span className="icon">👥</span>
          Manage Users
        </button>
      </div>

      {showOrders && (
        <div className="dashboard-section">
          <div className="section-header">
            <h2>All Orders</h2>
            <button 
              className="close-btn"
              onClick={() => setShowOrders(false)}
            >
              ✕
            </button>
          </div>
          
          <div className="orders-controls">
            <div className="filter-controls">
              <select 
                value={filterStatus} 
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="filter-select"
              >
                <option value="all">All Orders</option>
                <option value="0">Pending</option>
                <option value="1">Completed</option>
                <option value="2">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th onClick={() => handleSortChange('dateOrdered')} className="sortable">
                    Date {sortOrdersBy === 'dateOrdered' && (sortOrdersDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Order ID</th>
                  <th>Customer Email</th>
                  <th>Time</th>
                  <th>Items</th>
                  <th onClick={() => handleSortChange('total')} className="sortable">
                    Total {sortOrdersBy === 'total' && (sortOrdersDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSortChange('status')} className="sortable">
                    Status {sortOrdersBy === 'status' && (sortOrdersDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map(order => 
                (
                  <tr key={order._id}>
                    <td>{new Date(order.dateOrdered).toLocaleDateString()}</td>
                    <td>{order.transactionId}</td>
                    <td>{order.email}</td>
                    <td>{order.time}</td>

                    {/* Products */}
                    <td>
                      {order.products.map(item => (
                        <div key={item._id}>
                          {item.productId?.productName || 'Unknown Product'} x {item.orderQuantity}
                        </div>
                      ))}
                    </td>

                    {/* Total Price */}
                    <td>
                      ₱{order.products.reduce(
                        (sum, item) => sum + ((item.productId?.productPrice || 0) * item.orderQuantity),
                        0
                      ).toFixed(2)}
                    </td>

                    {/* Order Status */}
                    <td>
                      <span className={`status-badge ${
                        order.orderStatus === 0 ? 'pending' :
                        order.orderStatus === 1 ? 'completed' : 'cancelled'
                      }`}>
                        {order.orderStatus === 0 ? 'Pending' :
                        order.orderStatus === 1 ? 'Completed' : 'Cancelled'}
                      </span>
                    </td>

                    {/* Action Button */}
                    <td>
                      {order.orderStatus === 0 && (
                        <button 
                          className="action-btn confirm-btn"
                          onClick={async () => {
                            try {
                              await axios.patch(`/api/orders/${order._id}`, {
                                orderStatus: 1 // Completed
                              });
                              setOrders(orders.map(o => 
                                o._id === order._id ? { ...o, orderStatus: 1 } : o
                              ));
                            } catch (error) {
                              console.error('Error confirming order:', error);
                              alert('Failed to confirm order. Please try again.');
                            }
                          }}
                        >
                          Confirm
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button 
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`pagination-btn ${currentPage === number ? 'active' : ''}`}
              >
                {number}
              </button>
            ))}
            <button 
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        </div>
      )}

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
              {orders.slice(0, 5).map(order => (
                <tr key={order._id}>
                  <td>{order.transactionId}</td>
                  <td>
                    ₱{order.products.reduce((sum, item, index) => {
                      const price = Number(item.productId?.productPrice);
                      const qty = Number(item.orderQuantity);
                      
                      if (isNaN(price) || isNaN(qty)) {
                        console.warn(`Invalid data at index ${index}:`, {
                          productPrice: item.productId?.productPrice,
                          orderQuantity: item.orderQuantity,
                          priceParsed: price,
                          qtyParsed: qty,
                          item,
                        });
                      }

                      return sum + (price * qty);
                    }, 0).toFixed(2)}
                  </td>

                  <td>
                    <span className={`status-badge ${
                      order.orderStatus === 0 ? 'pending' :
                      order.orderStatus === 1 ? 'completed' : 'cancelled'
                    }`}>
                      {order.orderStatus === 0 ? 'Pending' :
                       order.orderStatus === 1 ? 'Completed' : 'Cancelled'}
                    </span>
                  </td>
                  <td>{order.email}</td>
                  <td>{new Date(order.dateOrdered).toLocaleDateString()}</td>
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