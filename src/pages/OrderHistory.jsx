import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './OrderHistory.css';
//import Transaction from '../../models/Transaction';
import Trashcan from '../images/Trashcan.png';

const OrderHistory = () => {

    //stuff i used to test
    let temporders = [
        {
            transactionID: '0001',
            productID: '1001',
            orderQuantity: 5,
            orderStatus: 0, // 0 = pending, 1 = completed, 2 = canceled
            email: 'z@gmail.com',
            dateOrdered: '2025-05-10',
            time: null
        },
        {
            transactionID: '0002',
            productID: '1002',
            orderQuantity: 3,
            orderStatus: 1, // 0 = pending, 1 = completed, 2 = canceled
            email: 'z@gmail.com',
            dateOrdered: '2025-04-20',
            time: null
        },
        {
            transactionID: '0003',
            productID: '1003',
            orderQuantity: 1,
            orderStatus: 2, // 0 = pending, 1 = completed, 2 = canceled
            email: 'z@gmail.com',
            dateOrdered: '2024-12-25',
            time: null
        }
    ];

    const[orders, setOrders] = useState(temporders);

    //fetch orders here
    // useEffect(() => {
    //     //make func to send get req for all transactions
    //     const getOrders = async () => {
    //         const { data } = await axios.get('/api/transactions');
    //       
    //         //if worked, set orders to post response
    //         if (response.ok){
    //             setOrders(data)
    //         }
    //     }
    //     //run func
    //     getOrders()
    // }, [])

    //update transaction here
    const cancelTransaction = (transaction) => {
        //transaction.orderStatus = 2
        console.log("set transaction status to 2 pls ty")
    }

    return (
        <div>
        <ol>
        {orders.map((currentorders, index) => {
            if (currentorders.orderStatus == 0){
                return <div className='orderhistorypending' key={index} onClick={() => cancelTransaction(currentorders[index])}>
                            <span className='historyinfo'>
                                <h1>{currentorders.productID} x {currentorders.orderQuantity}</h1>
                                <h3>bought at {currentorders.dateOrdered}</h3>
                            </span>
                            <span>
                                <img src={Trashcan} alt="Cancel?" style={{display: "block", margin: "auto"}} width={90} height={90}/>
                            </span>
                            <span className='historystatus'>
                                <h1>PENDING</h1>
                                <p>This order is waiting to be verified</p>
                            </span>
                        </div>
            } else if (currentorders.orderStatus == 1){
                return <div className='orderhistory' key={index} style={{borderWidth: 0, backgroundColor:"#8aa7fe"}}>
                            <span className='historyinfo'>
                            <h1>{currentorders.productID} x {currentorders.orderQuantity}</h1>
                            <h3>bought at {currentorders.dateOrdered}</h3>
                            </span>
                            <span className='historystatus'>
                                <h1>CONFIRMED</h1>
                                <p>A merchant has confirmed the transaction</p>
                            </span>
                        </div>

            } else if (currentorders.orderStatus == 2){
                return <div className='orderhistory' key={index} style={{borderWidth: 0, backgroundColor: "#cecece"}}>
                            <span className='historyinfo'>
                            <h1>{currentorders.productID} x {currentorders.orderQuantity}</h1>
                            <h3>bought at {currentorders.dateOrdered}</h3>
                            </span>
                            <span className='historystatus'>
                                <h1>CANCELLED</h1>
                                <p>You cancelled your order</p>
                            </span>
                        </div>

            }
        })}
        </ol>
        </div>

    );
}

export default OrderHistory;