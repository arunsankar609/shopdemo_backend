import express from "express";
import { createUser, userLogin } from "../controllers/user.controller.js";
import { addToCart, viewUserCart } from "../controllers/cart.controller.js";
import { addProduct, getAllProducts } from "../controllers/product.controller.js";
import { upload } from "../multer/multerConfig.js";
const router = express.Router();

router.route("/signup").post(createUser);
router.route("/login").post(userLogin);
router.route("/add-to-cart").post(addToCart);
// router.route("/addProduct").post(addProduct)
router.post('/addProduct', upload.single('image'), addProduct);
router.get('/all-products',getAllProducts)
router.post("/add-to-cart",addToCart)
router.get('/view-cart/:id',viewUserCart)
export default router