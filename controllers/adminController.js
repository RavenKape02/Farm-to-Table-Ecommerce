const Product = require('../models/Product');
const User = require('../models/user');

const getDashboardStats = async (req, res) => {
    try {
        // For now, just return mock data
        res.status(200).json({ 
            stats: {
                totalUsers: 10,
                totalProducts: 25,
                totalOrders: 50,
                recentOrders: [
                    { id: '1', user: 'John Doe', total: 200, date: new Date() }
                ]
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = { getDashboardStats, getAllUsers }; 