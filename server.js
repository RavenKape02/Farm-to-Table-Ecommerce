const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes'); // Import user routes

// Constants
const MONGO_URI = 'mongodb://localhost:27017/farmToTable';
const PORT = 5000;

const app = express(); // Define app before using routes

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api/users', userRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
