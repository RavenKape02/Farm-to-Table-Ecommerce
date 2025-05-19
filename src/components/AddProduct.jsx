import React, { useState } from "react";
import axios from 'axios';
import './Addproduct.css';
import '../pages/MerchantDashboard.css';

const AddProductModal = (props) => {
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [type, setType] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    
    const submitProduct = async () => {
        let makeNewID = (Date.now() + Math.random()).toString();  

        const product = {productID: makeNewID, productName: name, productDesc: desc, productType: type, productQuantity: quantity, productPrice: price}
        //post the product
        const response = await axios.post('api/products', {
            product
        })
        const json = await response.json()
        if(!response.ok){
            console.log('Error adding product',json)
        }

        if (response.ok){
            setName('')
            setDesc('')
            setType('')
            setQuantity('')
            setPrice('')
            console.log('product added!', json)
            //exit popup
            props.close(false)
        }
    }

    return (
        <div className="bg">
            <div className="popup">
                <h1> Enter new product:</h1>
                <form className="product-form" onSubmit={submitProduct}>
                    <input type="text" 
                        onChange={(e) => setName(e.target.value)} 
                        value={name} 
                        placeholder="Enter product name..." 
                        required/>
                    <textarea type="text" 
                        onChange={(e) => setDesc(e.target.value)} 
                        value={desc} 
                        placeholder="Describe your product.." 
                        style={{height: "200px"}}/>
                    <select type="text" 
                        onChange={(e) => setType(e.target.value)} 
                        value={type} 
                        placeholder="What is your type of product?" 
                        required>
                            <option value="1">Crop</option>
                            <option value="2">Poultry</option>
                    </select>
                    <input type="number" 
                        onChange={(e) => setQuantity(e.target.value)} 
                        value={quantity} 
                        placeholder="How much are you selling?" 
                        required/>
                    <input type="number" 
                        onChange={(e) => setPrice(e.target.value)} 
                        value={price} 
                        placeholder="Enter price in pesos..." 
                        required/>
                    <span className="button-loc">
                        <button type="submit" className="action-btn edit-btn" onClick={() => submitProduct()}>Submit</button>
                        <button className="action-btn delete-btn" onClick={() => props.close(false)}>Cancel</button>
                    </span>
                </form>

            </div>

        </div>
    );
}

export default AddProductModal;