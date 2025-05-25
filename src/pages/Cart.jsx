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
        const { data } = await axios.get(`/api/cart/user/${userInfo._id}`);
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
      //get item id to find how many to add back to inventory
      const refundedItems = await axios.get(`/api/cart/product/${itemId}`);
      console.log('products id:', refundedItems);

      //get product then add back refunded items
      const item = await axios.get(`/api/products/${refundedItems.data.item.product}`);
      await axios.patch(`/api/products/${refundedItems.data.item.product}`, {
        productQuantity: item.data.product.productQuantity + refundedItems.data.item.quantity
      });

      //remove from cart
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

  const createOrder = async () => {
    try {
      const orderItems = cartItems.map(item => ({
        productId: item.product._id,
        quantity: item.quantity
      }));

      await axios.post('/api/orders/', {
        userId: userInfo._id,
        items: orderItems,
        totalPrice
      });

      // Clear cart after order creation
      await axios.delete(`/api/cart/clear/${userInfo._id}`);
      setCartItems([]);
      setCartCount(0);
      navigate('/orders'); // Redirect to orders page
    } catch (error) {
      console.error('Failed to create order', error);
    }
  }

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
          <button>Confirm order</button>
        </>
      )}
    </div>
  );
};

export default CartPage;
