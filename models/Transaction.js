const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    productID: { type: String, required: true },
    orderQuantity: { type: Number, required: true },
    orderStatus: { type: Number, required: true },
    email: { type: String, required: true },
    dateOrdered: { type: Date, required: true },
    time: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema); 