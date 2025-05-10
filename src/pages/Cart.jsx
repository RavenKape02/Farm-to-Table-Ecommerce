import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { userInfo, setCartCount } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await axios.get(`/api/cart/${userInfo._id}`);
        setCartItems(data.items);

        const total = data.items.reduce((acc, item) => acc + item.quantity, 0);
        setCartCount(total);
      } catch (error) {
        console.error('Failed to load cart', error);
      }
    };
    fetchCart();
  }, [userInfo, setCartCount]);

  const handleRemove = async (itemId) => {
    try {
      const { data } = await axios.delete(`/api/cart/remove/${itemId}`);
      setCartItems(data.items);

      const total = data.items.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(total);
    } catch (error) {
      console.error('Failed to remove item', error);
    }
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.product.productPrice * item.quantity,
    0
  );

  if (!userInfo) {
    navigate('/login');
    return null;
  }

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item) => (
              <li key={item._id}>
                {item.product.productName} - ₱{item.product.productPrice} x {item.quantity}
                <button onClick={() => handleRemove(item._id)}>Remove</button>
              </li>
            ))}
          </ul>
          <h3>Total: ₱{totalPrice}</h3>
          <button>Proceed to Checkout</button>
        </>
      )}
    </div>
  );
};

export default CartPage;
