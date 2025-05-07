const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

dotenv.config({ path: path.resolve(__dirname, '.env') });

if (!process.env.MONGO_URI) {
    console.error('Error: MONGO_URI is not defined in environment variables');
    console.log('Current environment variables:', process.env);
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Vite's default port is 5173
  credentials: true
}));
app.use(express.json());

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/market-db';
console.log('Connecting to MongoDB with URI:', mongoUri);

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/transactions', transactionRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
