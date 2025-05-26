import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
    const { userInfo } = useContext(AuthContext);
    const [pending, setPending] = useState(0);
    const [confirmed, setConfirmed] = useState(0);
    const [cancelled, setCancelled] = useState(0);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            const response = await axios.get('/api/orders');
            console.log(response.data);
            const orders = response.data.orders || [];
            setPending(orders.filter(order => order.orderStatus === 0 && order.email == userInfo.email).length);
            setConfirmed(orders.filter(order => order.orderStatus === 1 && order.email == userInfo.email).length);
            setCancelled(orders.filter(order => order.orderStatus === 2 && order.email == userInfo.email).length);
        };
        fetchOrders();


    }, []);

    //stuff i use to test
    let tempuser = {
        firstName: 'Michael',
        middleName: 'David',
        lastName: 'Stevens',
        userType: 'customer',
        email: 'test@gmail.com'
    }

    return(
        <div className="order-history-container">
                    <h2>Your Profile</h2>
                    
                    <div className="orders-list">
                            <div className=''>
                                <div className="order-header">
                                    <h3>Hello, {userInfo.firstName} {userInfo.middleName} {userInfo.lastName}!</h3>
                                </div>
                                
                                <div className="order-items">
                                    <div className="order-item">
                                        <p>Pending orders: </p>
                                        <p>{pending}</p>
                                    </div>
                                    <div className="order-item">
                                        <p>Confirmed orders: </p>
                                        <p>{confirmed}</p>
                                    </div>
                                    <div className="order-item">
                                        <p>Cancelled orders: </p>
                                        <p>{cancelled}</p>
                                    </div>
                                    <div className="order-total">
                                        <p>Total Orders:</p>
                                        <p>{pending + confirmed + cancelled}</p>
                                    </div>
                                </div>
    
                                <div className="order-footer">
                                    <button 
                                        className="cancel-btn"
                                        onClick={() => setIsEditing(!isEditing)}
                                    >
                                        Edit Profile
                                    </button>
                                    
                                    <Link to={`/shop`} className="cancel-btn">See Orders</Link>
                                </div>
                            </div>
                    </div>
                </div>

    );
}

export default Profile;