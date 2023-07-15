import CartItem from "../mongodb/models/userCart.js";
import Product from "../mongodb/models/productElec.js";
import { ObjectId } from "mongoose";
import { Types } from "mongoose";
import mongoose from "mongoose";

const addToCart = async (req, res) => {
  try {
    console.log("req.bodyyyy", req.body);
    const { User, Product } = req.body;

    const user = await CartItem.findOne({ userId: User });

    if (user) {
      user.productIds.push(Product);
      await user.save();
      res.status(200).json({ message: "Product added successfully", Product });
    } else {
      const newCartItem = new CartItem();
      (newCartItem.userId = User), (newCartItem.productIds = [Product]);
      await newCartItem.save();
      res.status(200).json({ message: "Product added successfully", Product });
    }
  } catch (error) {
    res.status(500).json({ message: "Product cannot be added", error });
  }
};
const viewUserCart = async (req, res) => {
  const {id} = req.params;
  console.log("userrrrr", id);

  let userCart = await CartItem.aggregate([
    {
      $match: { userId:new mongoose.Types.ObjectId(id) },
    },
    {
      $lookup: {
        from: 'electricproducts',
        let: { userProd: '$productIds' },
        pipeline: [
          {
            $match: {
              $expr: {
               $in: ['$_id', { $ifNull: ['$$userProd', []] }],
              },
            }, 
          },
        ],
        as: 'usercartItems',
      },
    },
  ]).option({ maxTimeMS: 30000 }).exec();
  console.log('userProd:', userCart[0]); 

  res.status(200).json({ message: 'user cart products',data:userCart[0].usercartItems });
}; 
const removeFromCart = async (req, res) => {
  try {
    const { User, Product } = req.body;

    const user = await CartItem.findOne({ userId: User });

    if (user) {
      // Find the index of the product in the productIds array
      const index = user.productIds.indexOf(Product);

      if (index !== -1) {
        // Remove the product from the productIds array
        user.productIds.splice(index, 1);
        await user.save();
        res.status(200).json({ message: "Product removed successfully", Product });
      } else {
        res.status(404).json({ message: "Product not found in the cart" });
      }
    } else {
      res.status(404).json({ message: "User cart not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Product removal failed", error });
  }
};




export { addToCart, viewUserCart,removeFromCart };
