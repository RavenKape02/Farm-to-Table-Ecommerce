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
      setCost(data.product.productPrice * 1); 
      setQuantity(1); 
    };
    fetchProduct();
  }, [id]);

  const handleCounter = (e) => {
    //check if add or subtract amount to buy
    let newQuantity = quantity;
    if (e == '+'){
        //dont exceed available stock
        if (quantity < product.productQuantity) {
            newQuantity = quantity + 1;
        } else {
            alert("Cannot exceed available stock");
        }
    } else if (e == '-') {
        if (quantity > 1) {
            newQuantity = quantity - 1;
        } else {
            alert("Quantity cannot be less than 1");
        }
    }
    setQuantity(newQuantity);
    setCost(product.productPrice * newQuantity);
  }

  const handleInput = (e) => {
    //dont exceed available stock, buy negative stock or be a window shopper lol
    if (e > product.productQuantity) {
        alert("Cannot exceed available stock");
    } else  if (e < 1) {
        alert("Please buy at least 1 item");
    }
    setQuantity(e);
    setCost(product.productPrice * e);
  }

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      navigate('/login');
      return;
    }
    try {
      //add info to cart
      console.log(userInfo._id);
      await axios.post('/api/cart/add', { productId: product._id, quantity: quantity, userId: userInfo._id });
  
      const { data } = await axios.get(`/api/cart/user/${userInfo._id}`);
      const total = data.items.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(total);

      // Remove the product quantity update since it will be handled during order creation
      // await axios.patch(`/api/products/${product._id}`, {
      //   productQuantity: product.productQuantity - quantity
      // });
  
      navigate('/shop');
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
              <input className='counter-input'
                type="number" 
                onChange={(e) => handleInput(Number(e.target.value))} 
                value={quantity}
                required/>
              <button className="action-btn edit-btn" type="button" onClick={() => handleCounter('+')}>+</button>
          </span>
          <p>Total Cost: ₱{cost}</p>
          <span className="button-loc">
              <button type="submit" className="action-btn edit-btn" >Add to Cart</button>
              <button className="action-btn delete-btn" onClick={() => navigate('/shop')}>Cancel</button>
          </span>
      </form>
    </div>
  );
};

export default ProductDetailsPage;
