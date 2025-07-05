import express from 'express';
import { isUserAuthenticated } from '../utils/Auth.js';
import { addToCart, getCart, updateQuantity, removeFromCart, applyCouponToCart } from '../controllers/cart_controller.js';

const router = express.Router();


router.route('/add-to-cart/:id').post(isUserAuthenticated, addToCart);

router.route('/get-cart').get(isUserAuthenticated, getCart);

router.route('/update-quantity').put(isUserAuthenticated, updateQuantity);

router.route('/remove-from-cart').delete(isUserAuthenticated, removeFromCart);

router.post('/apply-coupon', isUserAuthenticated, applyCouponToCart);

export default router;