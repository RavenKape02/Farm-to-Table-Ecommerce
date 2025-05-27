import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './OrderHistory.css';
import Trashcan from '../assets/Trashcan.png';

const OrderHistory = () => {
    const { userInfo } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                setError(null);
                const { data } = await axios.get(`/api/orders/user/${userInfo.email}`);
                setOrders(data.orders || []);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setError('Failed to load orders. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (userInfo) {
            fetchOrders();
        }
    }, [userInfo]);

    const cancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) {
            return;
        }

        try {
            await axios.patch(`/api/orders/${orderId}`, {
                orderStatus: 2 // Canceled
            });
            
            // Update local state
            setOrders(orders.map(order => 
                order._id === orderId 
                    ? { ...order, orderStatus: 2 }
                    : order
            ));
            alert('Order has been canceled successfully.');
        } catch (error) {
            console.error('Error canceling order:', error);
            alert('Failed to cancel order. Please try again.');
        }
    };

    const calculateOrderTotal = (products) => {
        return (products || []).reduce((total, item) => {
          const price = Number(item?.productId?.productPrice) || 0;
          const quantity = Number(item?.orderQuantity) || 0;
      
          console.log('price:', price, 'quantity:', quantity, 'subtotal:', price * quantity);
      
          return total + price * quantity;
        }, 0);
      };
        

    return (
        <div className="order-history-container">
            <h2>Your Order History</h2>
            
            {loading ? (
                <div className="loading-state">
                    <p>Loading your orders...</p>
                </div>
            ) : error ? (
                <div className="error-state">
                    <p>{error}</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="empty-state">
                    <p>You haven't placed any orders yet.</p>
                    <a href="/shop" className="shop-link">Start Shopping</a>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div 
                            key={order._id} 
                            className={`order-card ${order.orderStatus === 0 ? 'pending' : 
                                order.orderStatus === 1 ? 'completed' : 'canceled'}`}
                        >
                            <div className="order-header">
                                <h3>Order #{order.transactionId}</h3>
                                <p>Date: {new Date(order.dateOrdered).toLocaleDateString()}</p>
                                <p>Time: {order.time}</p>
                                <p className="payment-method">Payment Method: Cash on Delivery</p>
                            </div>
                            
                            <div className="order-items">
                            {(order.items || []).map((item, index) => (
                                <div key={index}>
                                    <p>
                                    Product: {item.productId ? item.productId.productName : 'Deleted Product'}
                                    </p>
                                </div>
                                ))}
                            <div className="order-total">
                                    <p>Total Amount:</p>
                                    <p>₱{calculateOrderTotal(order.products)}</p>
                                </div>
                            </div>

                            <div className="order-footer">
                                <div className="order-status">
                                    <h4>
                                        {order.orderStatus === 0 ? 'PENDING' :
                                         order.orderStatus === 1 ? 'COMPLETED' : 'CANCELED'}
                                    </h4>
                                    <p>
                                        {order.orderStatus === 0 ? 'Waiting for merchant confirmation' :
                                         order.orderStatus === 1 ? 'Order has been confirmed' : 'Order was canceled'}
                                    </p>
                                </div>
                                
                                {order.orderStatus === 0 && (
                                    <button 
                                        className="cancel-btn"
                                        onClick={() => cancelOrder(order._id)}
                                    >
                                        <img src={Trashcan} alt="Cancel Order" />
                                        Cancel Order
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;