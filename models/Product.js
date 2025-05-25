const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    productDescription: { type: String },
    productType: { type: Number, required: true }, // 1: Crop, 2: Poultry
    productQuantity: { type: Number, required: true },
    productPrice: { type: Number, required: true },
});

module.exports = mongoose.model('Product', productSchema);
