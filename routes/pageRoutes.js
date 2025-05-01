const express = require('express');
const router = express.Router();

// Simple page routes that return basic HTML
router.get('/dashboard', (req, res) => {
    res.send('<h1>Admin Dashboard</h1><p>Welcome to the admin dashboard</p>');
});

router.get('/shop', (req, res) => {
    res.send('<h1>Shop Page</h1><p>Browse all products here</p>');
});

router.get('/cart', (req, res) => {
    res.send('<h1>Shopping Cart</h1><p>Your shopping cart items will appear here</p>');
});

router.get('/login', (req, res) => {
    res.send('<h1>Login Page</h1><p>Please login to your account</p>');
});

router.get('/signup', (req, res) => {
    res.send('<h1>Signup Page</h1><p>Create a new account</p>');
});

router.get('/orders', (req, res) => {
    res.send('<h1>Order History</h1><p>View your past orders here</p>');
});

router.get('/profile', (req, res) => {
    res.send('<h1>User Profile</h1><p>View and edit your profile information</p>');
});

router.get('/product/:id', (req, res) => {
    res.send(`<h1>Product Details</h1><p>Details for product ID: ${req.params.id}</p>`);
});

module.exports = router; 