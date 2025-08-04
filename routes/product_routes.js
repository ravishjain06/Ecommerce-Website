import express from "express";
import upload from "../middleware/multer.js";
import { filterProducts, createProduct, deleteProduct, getAllPorducts, getProductById, updateProduct, addToWishlist, removeFromWishlist, getWishlist } from "../controllers/product_controller.js";
import { isUserAuthenticated } from "../utils/Auth.js";
import { isSeller } from "../middleware/roleBasedAuth.js";

const router = express.Router();

router.route('/create-product')
    .post(
        isUserAuthenticated, // Authenticate user first
        isSeller,            // Then check if user is seller
        upload.array("image", 5),
        createProduct
    );

router.route('/all/products').get(getAllPorducts)

// Wishlist routes (must be before any "/:id" route)
router.route("/wishlist/add").post(isUserAuthenticated, addToWishlist);
router.route("/wishlist/remove").post(isUserAuthenticated, removeFromWishlist);
router.route("/wishlist").get(isUserAuthenticated, getWishlist);

router.route('/:id').get(getProductById)


router.route('/search/filter').get(filterProducts)

router.route('/:id').delete(isUserAuthenticated, isSeller, deleteProduct)

router.route('/edit/product/:id')
    .put(
        isUserAuthenticated, // Authenticate user first
        isSeller,            // Then check if user is seller
        upload.array("image", 5),
        updateProduct // Reusing createProduct for edit functionality
    );


export default router;