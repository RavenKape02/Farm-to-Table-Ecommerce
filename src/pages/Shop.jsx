import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Shop.css';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [sortField, setSortField] = useState('productName');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await axios.get('/api/products/');
      setProducts(data.products);
    };
    fetchProducts();
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
    } else if (sortField === 'productType') {
      const typeA = a[sortField] === 1 ? 'Crop' : 'Poultry';
      const typeB = b[sortField] === 1 ? 'Crop' : 'Poultry';
      comparison = typeA.localeCompare(typeB);
    } else {
      comparison = a[sortField].localeCompare(b[sortField]);
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return (
    <div className="shop-page">
      <div className="shop-header">
        <h2>Our Products</h2>
        <div className="sort-controls">
          <button 
            className={`sort-btn ${sortField === 'productName' ? 'active' : ''}`}
            onClick={() => handleSort('productName')}
          >
            Name {sortField === 'productName' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button 
            className={`sort-btn ${sortField === 'productType' ? 'active' : ''}`}
            onClick={() => handleSort('productType')}
          >
            Type {sortField === 'productType' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button 
            className={`sort-btn ${sortField === 'productPrice' ? 'active' : ''}`}
            onClick={() => handleSort('productPrice')}
          >
            Price {sortField === 'productPrice' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button 
            className={`sort-btn ${sortField === 'productQuantity' ? 'active' : ''}`}
            onClick={() => handleSort('productQuantity')}
          >
            Stock {sortField === 'productQuantity' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      </div>

      <div className="product-grid">
        {sortedProducts.map((product) => (
          <div className="product-card" key={product._id}>
            <h3>{product.productName}</h3>
            <div className="product-type">
              {product.productType === 1 ? 'Crop' : 'Poultry'}
            </div>
            <div className="product-price">₱{product.productPrice}</div>
            <div className="product-stock">
              Stock: {product.productQuantity}
            </div>
            <p className="product-description">{product.productDescription}</p>
            <Link to={`/product/${product._id}`} className="view-details-btn">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopPage;
