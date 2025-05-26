const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    transactionId: { type: String, required: true, unique: true },
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        orderQuantity: { type: Number, required: true }
    }],
    orderStatus: { type: Number, required: true, default: 0 }, // 0 = pending, 1 = completed, 2 = canceled
    email: { type: String, required: true },
    dateOrdered: { type: Date, required: true },
    time: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
