import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  FaSortAlphaDown,
  FaSortAlphaUp,
  FaDollarSign,
  FaBoxes,
  FaTag
} from 'react-icons/fa';
import backgroundImage from '../assets/sunrise_bg.jpg';
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

  const renderSortIcon = (field) => {
    if (field !== sortField) return null;
    return sortOrder === 'asc' ? <FaSortAlphaDown /> : <FaSortAlphaUp />;
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '100%',
        width: '100%',
        padding: '2rem 0'
      }}
    >
        <header className="shop-header">
          <h2>Products</h2>
          <nav className="sort-controls">
            <button
              className={`sort-btn ${sortField === 'productName' ? 'active' : ''}`}
              onClick={() => handleSort('productName')}
              title="Sort by Name"
            >
              <FaTag /> Name {renderSortIcon('productName')}
            </button>
            <button
              className={`sort-btn ${sortField === 'productType' ? 'active' : ''}`}
              onClick={() => handleSort('productType')}
              title="Sort by Type"
            >
              <FaBoxes /> Type {renderSortIcon('productType')}
            </button>
            <button
              className={`sort-btn ${sortField === 'productPrice' ? 'active' : ''}`}
              onClick={() => handleSort('productPrice')}
              title="Sort by Price"
            >
              <FaDollarSign /> Price {renderSortIcon('productPrice')}
            </button>
            <button
              className={`sort-btn ${sortField === 'productQuantity' ? 'active' : ''}`}
              onClick={() => handleSort('productQuantity')}
              title="Sort by Stock"
            >
              <FaBoxes /> Stock {renderSortIcon('productQuantity')}
            </button>
          </nav>
        </header>

        <section className="product-grid">
          {sortedProducts.map((product) => (
            <article className="product-card" key={product._id}>
              <div className="product-header">
                <h3>{product.productName}</h3>
                <div
                  className={`product-type ${
                    product.productType === 1 ? 'crop' : 'poultry'
                  }`}
                >
                  {product.productType === 1 ? 'Crop' : 'Poultry'}
                </div>
              </div>
              <p className="product-description">{product.productDescription}</p>
              <p className="product-price">
                ₱{Number(product.productPrice).toLocaleString('en-PH', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </p>
              <Link to={`/product/${product._id}`} className="view-details-btn">
                View Details
              </Link>
              <p className="product-stock">Stock: {product.productQuantity}</p>
            </article>
          ))}
        </section>
      </div>
  );
};

export default ShopPage;
