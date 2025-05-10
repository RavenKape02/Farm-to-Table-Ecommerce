import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  const { userInfo, setCartCount, cartCount } = useContext(AuthContext);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await axios.get(`/api/products/${id}`);
      setProduct(data);
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    try {
      await axios.post('/api/cart/add', { productId: product._id, quantity: 1, userId: userInfo._id });
  
      const { data } = await axios.get(`/api/cart/${userInfo._id}`);
      const total = data.items.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(total);
  
      navigate('/cart');
    } catch (error) {
      console.error('Failed to add to cart', error);
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="product-details">
      <h2>{product.productName}</h2>
      <p>{product.productDescription}</p>
      <p>₱{product.productPrice}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};

export default ProductDetailsPage;
