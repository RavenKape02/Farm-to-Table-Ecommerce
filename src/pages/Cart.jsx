import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt, FaShoppingCart } from 'react-icons/fa';
import './Cart.css';
import backgroundImage from '../assets/rice_bg.JPEG';

const CartPage = () => {
  const { userInfo, setCartCount } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await axios.get(`/api/cart/user/${userInfo._id}`);
        setCartItems(data.items);
        setCartCount(data.items.reduce((acc, item) => acc + item.quantity, 0));
      } catch (error) {
        console.error('Failed to load cart', error);
      }
    };
    fetchCart();
  }, [userInfo, setCartCount]);

  const handleRemove = async (itemId) => {
    try {
      const refunded = await axios.get(`/api/cart/product/${itemId}`);
      const product = await axios.get(`/api/products/${refunded.data.item.product}`);
      await axios.patch(`/api/products/${refunded.data.item.product}`, {
        productQuantity: product.data.product.productQuantity + refunded.data.item.quantity,
      });
      await axios.delete(`/api/cart/remove/${itemId}`);
      const { data } = await axios.get(`/api/cart/user/${userInfo._id}`);
      setCartItems(data.items);
      setCartCount(data.items.reduce((acc, item) => acc + item.quantity, 0));
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const createOrder = async () => {
    try {
      const response = await axios.post('/api/orders/', {
        products: cartItems.map(item => ({
          product: {
            _id: item.product._id,
            productName: item.product.productName,
            productPrice: item.product.productPrice
          },
          quantity: item.quantity
        })),
        email: userInfo.email,
        dateOrdered: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString()
      });

      if (response.data.order) {
        await axios.delete(`/api/cart/clear/${userInfo._id}`);
        setCartItems([]);
        setCartCount(0);
        alert('Order created successfully!');
        navigate('/orders');
      }
    } catch (error) {
      console.error('Failed to create order:', error);
      alert(error.response?.data?.message || 'Failed to create order.');
    }
  };

  if (!userInfo) {
    navigate('/login');
    return null;
  }

  return (
    <div
      className="cart-page"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        padding: '2rem'
      }}
    >
      <h2><FaShoppingCart /> Your Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <button className="continue-shopping-btn" onClick={() => navigate('/shop')}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div className="cart-item" key={item._id}>
                <div className="item-details">
                  <h3>{item.product.productName}</h3>
                  <p className="item-price">₱{item.product.productPrice} x {item.quantity}</p>
                  <p className="item-subtotal">
                    Subtotal: ₱{item.product.productPrice * item.quantity}
                  </p>
                </div>
                <button className="remove-btn" onClick={() => handleRemove(item._id)}>
                  <FaTrashAlt /> Remove
                </button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>Total: ₱{cartItems.reduce((acc, item) => acc + item.product.productPrice * item.quantity, 0)}</h3>
            <button className="checkout-btn" onClick={createOrder}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
