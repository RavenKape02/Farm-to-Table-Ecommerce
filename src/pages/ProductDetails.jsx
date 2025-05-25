import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './ProductDetails.css'; 

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [cost, setCost] = useState(0);
  const navigate = useNavigate();
  const { userInfo, setCartCount, cartCount } = useContext(AuthContext);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await axios.get(`/api/products/${id}`);
      setProduct(data.product);
      //set values for buying 1 item at start
      setCost(data.product.productPrice * 1); // Default cost to price of one unit
      setQuantity(0); 
    };
    fetchProduct();
  }, [id]);

  const handleCounter = (e) => {
    //check if add or subtract amount to buy
    if (e == '+'){
        //dont exceed available stock
        if (quantity < product.productQuantity) {
            setQuantity(quantity + 1);
        } else {
            alert("Cannot exceed available stock");
        }
    } else if (e == '-') {
        //dont buy negative stock or be a window shopper lol
        if (quantity > 1) {
            setQuantity(quantity - 1);
        } else {
            alert("Quantity cannot be less than 1");
        }
    }
    setCost(product.productPrice * quantity);
  }

  const handleInput = (e) => {
    //dont exceed available stock, buy negative stock or be a window shopper lol
    if (e > product.productQuantity) {
        alert("Cannot exceed available stock");
    } else  if (e < 1) {
        alert("Please buy at least 1 item");
    }
    setCost(product.productPrice * quantity);
  }

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      navigate('/login');
      return;
    }
    try {
      await axios.post('/api/cart/add', { productId: product._id, quantity: quantity, userId: userInfo._id });
  
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
    <div className="product-details add-product">
      <h1> {product.productName} </h1>
      <p>Price per unit: ₱{product.productPrice}</p>
      <form className="product-form" onSubmit={handleAddToCart}>
          <span className="product-quantity">
              <button className="action-btn edit-btn" type="button" onClick={() => handleCounter('-')}>-</button>
              <input type="number" 
                  onChange={(e) => handleInput(Number(e.target.value))} 
                  value={quantity}
                  required/>
              <button className="action-btn edit-btn" type="button" onClick={() => handleCounter('+')}>+</button>
          </span>
          <p>Total Cost: ₱{cost}</p>
          <span className="button-loc">
              <button type="submit" className="action-btn edit-btn" >Submit</button>
              <button className="action-btn delete-btn" onClick={() => navigate('/cart')}>Cancel</button>
          </span>
      </form>
    </div>
  );
};

export default ProductDetailsPage;
