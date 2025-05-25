const Cart = require('../models/Cart');
const Product = require('../models/Product');

const addToCart = async (req, res) => {
    const { productId, quantity, userId } = req.body;
    try {
        let cart = await Cart.findOne({ user: userId });
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        if (!cart) {
            cart = await Cart.create({ user: userId, items: [{ product: productId, quantity }] });
        } else {
            const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ product: productId, quantity });
            }
            await cart.save();
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.params.userId }).populate('items.product');
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductInCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ 'items._id': req.params.itemId });
        if (!cart) return res.status(404).json({ message: 'Cart product not found' });

        const item = cart.items.find(item => item._id.toString() == req.params.itemId);
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ 'items._id': req.params.itemId });
        if (!cart) return res.status(404).json({ message: 'Cart item not found' });

        cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addToCart, getCart, getProductInCart: getProductInCart, removeFromCart };
