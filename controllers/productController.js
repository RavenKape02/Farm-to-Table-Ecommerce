const Product = require('../models/Product');
const mongoose = require('mongoose');

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const getProductById = async (req, res) => {
    try {
        const { productId } = req.params;

        //check if req id is valid
        if (!mongoose.Types.ObjectId.isValid(productId)){
            return res.status(404).json({ message: 'Product not found' });
        }

        const product = await Product.findById(productId);
        
        //check if product found
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.status(200).json({ product });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

//use for merchant/admin adding new product
const createProduct = async (req, res) => {
    const {productId, productName, productDescription, productType, productQuantity, productPrice} = req.body;

    //add to db
    try {
        const newProduct = await Product.create({productId, productName, productDescription, productType, productQuantity, productPrice});
        res.status(200).json(newProduct);
    } catch (error){
        res.status(400).json({message: 'Server error', error});
    }
}

//use when customer buys product/nagcancell order
const updateProduct = async (req, res) => {
    const {id} = req.params;

    //check if req id is valid
    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({ message: 'Product not found' });
    }

    const updatedProduct = await Product.findOneAndUpdate({_id: id}, {
        ...req.body
    });

    if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(200).json({ updatedProduct });
}

const deleteProduct = async (req, res) => {
    const { productId } = req.params;

    //check if req id is valid
    if (!mongoose.Types.ObjectId.isValid(productId)){
        return res.status(404).json({ message: 'Product not found' });
    }

    const deletedProduct = await Product.findOneAndDelete(productId);

    if (!deletedProduct){
        return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(deletedProduct);
}

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct }; 