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
    console.log('Update data:', req.body);

    //check if req id is valid
    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({ message: 'Product not found' });
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { ...req.body },
            { 
                new: true, // This ensures we get the updated document back
                runValidators: true // This ensures the update follows the schema
            }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        console.log('Product updated successfully:', updatedProduct);
        // Send back the updated product directly
        res.status(200).json({ updatedProduct });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
}

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    console.log('Delete request received for product ID:', id);

    //check if req id is valid
    if (!mongoose.Types.ObjectId.isValid(id)){
        console.log('Invalid ObjectId:', id);
        return res.status(404).json({ message: 'Product not found' });
    }

    try {
        console.log('Attempting to find and delete product with ID:', id);
        const deletedProduct = await Product.findByIdAndDelete(id);
        console.log('Delete result:', deletedProduct);
        
        if (!deletedProduct){
            console.log('No product found with ID:', id);
            return res.status(404).json({ message: 'Product not found' });
        }
        
        console.log('Product successfully deleted:', deletedProduct);
        res.status(200).json({ message: 'Product deleted successfully', deletedProduct });
    } catch (error) {
        console.error('Error in deleteProduct:', error);
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
}

module.exports = { getAllProducts, getProductById, getProductByName, createProduct, updateProduct, deleteProduct }; 