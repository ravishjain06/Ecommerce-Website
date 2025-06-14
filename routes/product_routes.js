import express from "express";
import upload from "../middleware/multer.js";
import { categoryAndSearch, createProduct, deleteProduct, getAllPorducts, getProductBytId, updateProduct } from "../controllers/product_controller.js";
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

router.route('/all/products').get(isUserAuthenticated, getAllPorducts)

router.route('/:id').get(isUserAuthenticated, getProductBytId)

// GET /api/products?category=xyz&search=abc
router.route('/').get(categoryAndSearch)

router.route('/:id').delete(isUserAuthenticated, isSeller, deleteProduct)

router.route('/edit/product/:id')
    .put(
        isUserAuthenticated, // Authenticate user first
        isSeller,            // Then check if user is seller
        upload.array("image", 5),
        updateProduct // Reusing createProduct for edit functionality
    );
//  http://localhost:5000/api/products?category=electronics&search=phone
export default router;