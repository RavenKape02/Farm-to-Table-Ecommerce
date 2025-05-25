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
        const { id } = req.params;
        console.log('Requested ID:', id);

        //check if req id is valid
        if (!mongoose.Types.ObjectId.isValid(id)){
            console.log('Invalid ObjectId');
            return res.status(404).json({ message: 'id not found' });
        }

        const product = await Product.findById(id);
        console.log('Found product:', product);
        
        //check if product found
        if (!product) {
            console.log('Product not found in DB');
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.status(200).json({ product });
    } catch (error) {
        console.error('Error in getProductById:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

//cheeck for any dupe products
const getProductByName = async (req, res) => {
    try {
        const {productName} = req.body
        const product = await Product.find({productName: productName});
        
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
    console.log('product to create:', req.body);
    const {productName, productDescription, productType, productQuantity, productPrice} = req.body;

    //add to db
    try {
        const newProduct = await Product.create({productName, productDescription, productType, productQuantity, productPrice});
        res.status(200).json(newProduct);
    } catch (error){
        console.error('Product creation error:', error);
        res.status(400).json({message: error});
    }
}

//use when customer buys product/nagcancell order
const updateProduct = async (req, res) => {
    const {id} = req.params;
    console.log('Updating product with ID:', id);

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

module.exports = { getAllProducts, getProductById, getProductByName, createProduct, updateProduct, deleteProduct }; 