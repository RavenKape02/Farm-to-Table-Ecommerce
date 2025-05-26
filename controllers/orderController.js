const Order = require('../models/Order');
const Product = require('../models/Product');
const mongoose = require('mongoose');

const createOrder = async (req, res) => {
    const { products, email, dateOrdered, time } = req.body;

    try {
        // Generate a unique transaction ID
        const transactionId = 'TRX' + Date.now().toString().slice(-8);

        // Create the order with the new schema
        const newOrder = new Order({
            transactionId,
            products: products.map(item => ({
                productId: item.product._id,
                orderQuantity: item.quantity
            })),
            orderStatus: 0, // Pending
            email,
            dateOrdered: new Date(dateOrdered),
            time
        });

        // Check if products exist and have enough stock, then deduct quantities
        for (const item of products) {
            const product = await Product.findById(item.product._id);
            if (!product) {
                throw new Error(`Product not found: ${item.product._id}`);
            }
            
            // Check if enough stock is available
            if (product.productQuantity < item.quantity) {
                throw new Error(`Insufficient stock for product: ${product.productName}`);
            }

            // Deduct the quantity
            product.productQuantity -= item.quantity;
            await product.save();
        }

        // Save the order
        await newOrder.save();

        res.status(200).json({ 
            message: 'Order created successfully',
            order: newOrder 
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(400).json({ 
            message: 'Could not create order', 
            error: error.message 
        });
    }
};

const getOrder = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: 'Invalid order ID' });
        }

        const order = await Order.findById(id)
            .populate('products.productId', 'productName productPrice');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ order });
    } catch (error) {
        console.error('Error in getOrder:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getOrderHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ email: userId })
            .populate('products.productId', 'productName productPrice')
            .sort({ dateOrdered: -1 });

        res.status(200).json({ orders });
    } catch (error) {
        console.error('Error in getOrderHistory:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { orderStatus } = req.body;

        console.log('Updating order status:', { id, orderStatus });

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: 'Invalid order ID' });
        }

        // Populate the products when fetching the order
        const order = await Order.findById(id).populate('products.productId');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        console.log('Current order status:', order.orderStatus);
        console.log('New order status:', orderStatus);
        console.log('Order products:', order.products);

        // If order is being canceled, restore product quantities
        if (orderStatus === 2 && order.orderStatus !== 2) {
            console.log('Restoring product quantities for cancelled order');
            for (const item of order.products) {
                const product = await Product.findById(item.productId);
                if (product) {
                    console.log(`Restoring ${item.orderQuantity} units to product ${product.productName}`);
                    console.log(`Current quantity: ${product.productQuantity}`);
                    product.productQuantity += item.orderQuantity;
                    await product.save();
                    console.log(`New quantity for ${product.productName}: ${product.productQuantity}`);
                } else {
                    console.log(`Product not found for ID: ${item.productId}`);
                }
            }
        }
        // If order is being confirmed (status 1) and was previously pending (status 0)
        else if (orderStatus === 1 && order.orderStatus === 0) {
            console.log('Order being confirmed, no need to deduct quantities again');
        }

        order.orderStatus = orderStatus;
        await order.save();
        console.log('Order status updated successfully');

        res.status(200).json({ 
            message: 'Order status updated successfully',
            order 
        });
    } catch (error) {
        console.error('Error in updateOrderStatus:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('products.productId', 'productName productPrice')
            .sort({ dateOrdered: -1 });
        res.status(200).json({ orders });
    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};

module.exports = { createOrder, getOrder, getOrderHistory, updateOrderStatus, getAllOrders }; 