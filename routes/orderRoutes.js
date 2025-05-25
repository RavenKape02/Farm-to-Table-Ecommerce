const express = require('express');
const router = express.Router();
const { createOrder, getOrder, getOrderHistory, updateOrderStatus } = require('../controllers/orderController');

router.post('/', createOrder);
router.get('/:id', getOrder);
router.get('/user/:userId', getOrderHistory);
router.patch('/:id/', updateOrderStatus)

module.exports = router; 