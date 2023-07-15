import mongoose from "mongoose";

// Define the Product schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
});

// Create the Product model
const Product = mongoose.model('ElectricProduct', productSchema);

export default Product;
