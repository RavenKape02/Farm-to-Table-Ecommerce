const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    transactionID: { type: String, required: true, unique: true },
    productID: { type: String, required: true },
    orderQuantity: { type: Number, required: true },
    orderStatus: { type: Number, required: true }, // 0 = pending, 1 = completed, 2 = canceled
    email: { type: String, required: true },
    dateOrdered: { type: Date, required: true },
    time: { type: Date, required: true }
});

module.exports = mongoose.model('Transaction', transactionSchema);
