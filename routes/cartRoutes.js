const express = require('express');
const router = express.Router();
const { addToCart, getCart, removeFromCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.post('/add', protect, addToCart);
router.get('/:userId', protect, getCart);
router.delete('/remove/:itemId', protect, removeFromCart);

module.exports = router;
