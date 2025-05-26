const express = require('express');
const router = express.Router();
const { getSalesReport } = require('../controllers/salesController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getSalesReport);

module.exports = router; 