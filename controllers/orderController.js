const createOrder = async (req, res) => {
    try {
        const { userId, items, totalAmount } = req.body;
        res.status(201).json({ 
            message: 'Order created successfully',
            order: { 
                userId, 
                items, 
                totalAmount,
                orderDate: new Date(),
                status: 'pending'
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

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

module.exports = { createOrder, getOrderHistory }; 