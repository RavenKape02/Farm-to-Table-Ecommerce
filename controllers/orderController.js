const Order = require('../models/Order');
const Product = require('../models/Product');

const createOrder = async (req, res) => {
    const { products, orderStatus, email, dateOrdered, time } = req.body;

    try {
        const newOrder = new Order({products, orderStatus, email, dateOrdered, time});
        res.status(200).json(newOrder);
    } catch (error) {
        console.log('Error creating order:', error);
        res.status(400).json({ message: 'could not create order', error });
    }
};

const getOrder = async (req, res) => {
    try {
            const { id } = req.params;
    
            if (!mongoose.Types.ObjectId.isValid(id)){
                console.log('Invalid ObjectId');
                return res.status(404).json({ message: 'id not found' });
            }
    
            const order = await Order.findById(id);
            console.log('Found order:', order);
            
            if (!order) {
                console.log('order not found in DB');
                return res.status(404).json({ message: 'order not found' });
            }
            
            res.status(200).json({ order });
        } catch (error) {
            console.error('Error in getProductById:', error);
            res.status(500).json({ message: 'Server error', error });
        }

}

const getOrderHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        res.status(200).json({ 
            orders: [
                { 
                    id: '1', 
                    userId, 
                    items: [{ productId: '1', quantity: 2, name: 'Sample Product', price: 100 }], 
                    totalAmount: 200,
                    orderDate: new Date(),
                    status: 'delivered'
                }
            ]
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const updateOrderStatus = async (req, res) => {
    const {id} = req.params;
        console.log('Updating order with ID:', id);
    
        if (!mongoose.Types.ObjectId.isValid(id)){
            return res.status(404).json({ message: 'Order not found' });
        }
    
        const updatedOrder = await Order.findOneAndUpdate({_id: id}, {
            ...req.body
        });
    
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        res.status(200).json({ updatedProduct: updatedOrder });
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'productName productPrice');
    res.json(orders);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

module.exports = { createOrder, getOrder, getOrderHistory, updateOrderStatus, getAllOrders }; 