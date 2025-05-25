const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    products: [{
        productID: { type: String, required: true },
        orderQuantity: { type: Number, required: true },
    }],
    orderStatus: { type: Number, required: true }, // 0 = pending, 1 = completed, 2 = canceled
    email: { type: String, required: true },
    dateOrdered: { type: Date, required: true },
    time: { type: Date, required: true }
});

module.exports = mongoose.model('Order', orderSchema);
