import Product from "../mongodb/models/productElec.js";
import fs from "fs";
const addProduct = async (req, res) => {
    console.log("bodyyy",req.body);
    try {
      const { name, price } = req.body;
      const imagePath = req.file.path;
  
      // Create a new product instance
      const newProduct = new Product({
        name,
        price,
        image: {
            filename: req.file.filename,
           contentType: req.file.mimetype,
           data: fs.readFileSync(req.file.path)
          },
      });
  
      // Save the product to the database
      const savedProduct=await newProduct.save();
  
      res.status(201).json({ message: 'Product added successfully',Product:savedProduct });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error adding product' });
    }
  };
  // Controller to get all products
const getAllProducts = async (req, res) => {
    try {
      // Retrieve all products from the database
      const products = await Product.find();
    
      res.status(200).json({ products });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error retrieving products' });
    }
  };
  
 
  export {
    addProduct,getAllProducts
  };