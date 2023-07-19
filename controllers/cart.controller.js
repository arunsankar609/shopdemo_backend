import CartItem from "../mongodb/models/userCart.js";
import Product from "../mongodb/models/productElec.js";
import { ObjectId } from "mongoose";
import { Types } from "mongoose";
import mongoose from "mongoose";

const addToCart = async (req, res) => {
  try {
    const { user, product } = req.body; // Update variable names to match the request body

    const existingCartItem = await CartItem.findOne({
      userId: new mongoose.Types.ObjectId(user),
    });

    if (existingCartItem) {
      const productExists = existingCartItem.productIds.find(
        (item) => item.productId == product
      );

      if (productExists) {
        productExists.count += 1;
      } else {
        existingCartItem.productIds.push({ productId: product, count: 1 });
      }
      await existingCartItem.save();
      res.status(200).json({ message: "Product added successfully", product });
    } else {
      const newCartItem = new CartItem({
        userId: user,
        productIds: [{ productId: product, count: 1 }],
      });
      await newCartItem.save();
      res.status(200).json({ message: "Product added successfully", product });
    }
  } catch (error) {
    console.error("Error while adding product to cart:", error);
    res
      .status(500)
      .json({ message: "Product cannot be added", error: error.message });
  }
};

// const viewUserCart = async (req, res) => {
//   const { id } = req.params;
//   console.log("userrrrr", id);
//   const cart = await CartItem.findOne({ userId: id });
//   if (!cart) {
//     return res.status(404).json({ message: "Cart not found" });
//   }

//   // Retrieve cart items
//   let userCart = await CartItem.aggregate([
//     {
//       $match: { userId: new mongoose.Types.ObjectId(id) },
//     },
//     {
//       $lookup: {
//         from: "electricproducts",
//         let: { userProd: "$productIds.productId" },
//         pipeline: [
//           {
//             $match: {
//               $expr: {
//                 $in: ["$_id", { $ifNull: ["$$userProd", []] }],
//               },
//             },
//           },
//           {
//             $addFields: {
//               count: {
//                 $let: {
//                   vars: {
//                     index: { $indexOfArray: ["$$userProd", "$_id"] },
//                   },
//                   in: { $arrayElemAt: ["$productIds.count", "$$index"] },
//                 },
//               },
//             },
//           },
//         ],
//         as: "userCartItems",
//       },
//     },
//   ])
//     .option({ maxTimeMS: 30000 })
//     .exec();
//   console.log("userProd:", userCart[0]);

//   res.status(200).json({
//     message: "User cart products",
//     data: userCart[0].userCartItems,
   
//   });
// };
const viewUserCart=async(req,res)=>{
    const { id } = req.params;
  console.log("userrrrr", id);
  const cart = await CartItem.findOne({ userId: id });
  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }
    let userCart = await CartItem.aggregate([
    {
      $match: { userId: new mongoose.Types.ObjectId(id) },
    },{
      $unwind: "$productIds"
    },{
      $project:{
        item:'$productIds.productId',
        count:'$productIds.count'
      }
    },{
      $lookup:
        {
          from:'electricproducts',
          localField:'item',
          foreignField:'_id',
          as:'cproducts'
          
        }
   }])
    console.log(userCart);
    return res.status(200).json({usercart:userCart})
}

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
        res
          .status(200)
          .json({ message: "Product removed successfully", Product });
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

export { addToCart, viewUserCart, removeFromCart };
