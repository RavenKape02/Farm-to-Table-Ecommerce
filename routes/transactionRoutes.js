const express = require('express');
const router = express.Router();
const { getAllTransactions, getTransactionById, updateTransactionStatus } = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getAllTransactions);
router.get('/:id', protect, getTransactionById);
router.patch('/:id/status', protect, updateTransactionStatus);

module.exports = router; 