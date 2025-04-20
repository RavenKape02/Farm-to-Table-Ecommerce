const express = require('express');
const router = express.Router();

// Example Route
router.get('/test', (req, res) => {
    res.json({ message: 'User route is working!' });
});

router.post('/register', (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    res.json({
        message: 'User registered successfully!',
        user: { firstName, lastName, email, password }
    });
});

module.exports = router;
