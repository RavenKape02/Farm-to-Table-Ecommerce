const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        
        res.status(200).json({ 
            message: 'Item added to cart',
            cart: { userId, productId, quantity }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const getCart = async (req, res) => {
    try {
        const { userId } = req.params;
        
        res.status(200).json({ 
            cart: {
                userId,
                items: [
                    { productId: '1', quantity: 2, name: 'Sample Product 1', price: 100 },
                    { productId: '2', quantity: 1, name: 'Sample Product 2', price: 150 }
                ]
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = { addToCart, getCart }; 