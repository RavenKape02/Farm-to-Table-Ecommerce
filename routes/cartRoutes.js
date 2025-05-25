const express = require('express');
const router = express.Router();
const { addToCart, getCart, getProductInCart, removeFromCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.post('/add', protect, addToCart);
router.get('/user/:userId', protect, getCart);
router.get('/product/:itemId', protect, getProductInCart);
router.delete('/remove/:itemId', protect, removeFromCart);

module.exports = router;
