const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/market-db';
console.log('Connecting to MongoDB with URI:', mongoUri);

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,
})
.then(() => {
    console.log('MongoDB connected for seeding');
    importUsers();
})
.catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

const adminUser = {
    firstName: 'Admin',
    middleName: '',
    lastName: 'User',
    email: 'admin@example.com',
    password: 'admin123',
    userType: 'admin'
};

const importUsers = async () => {
    try {
        await User.deleteOne({ email: adminUser.email });
        
        const createdAdmin = await User.create(adminUser);
        
        console.log('Admin user created successfully:', createdAdmin.email);
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding users:', error);
        process.exit(1);
    }
}; 