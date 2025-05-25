import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ShopPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await axios.get('/api/products/');
      setProducts(data.products);
    };
    fetchProducts();
  }, []);

  return (
    <div className="shop-page">
      <h2>Shop</h2>
      <div className="product-grid">
        {products.map((product) => (
          <div className="product-card" key={product._id}>
            <h3>{product.productName}</h3>
            <p>₱{product.productPrice}</p>
            <p>{product.productDescription}</p>
            <Link to={`/product/${product._id}`}>View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopPage;
