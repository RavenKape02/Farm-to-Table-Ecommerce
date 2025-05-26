const express = require('express');
const router = express.Router();
const { createOrder, getOrder, getOrderHistory, updateOrderStatus, getAllOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', createOrder);
router.get('/', protect, getAllOrders);
router.get('/:id', getOrder);
router.get('/user/:userId', getOrderHistory);
router.patch('/:id/', updateOrderStatus)

module.exports = router; 