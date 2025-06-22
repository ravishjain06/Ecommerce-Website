import express from 'express';
import { isUserAuthenticated } from '../utils/Auth.js';
import { 
    createOrder, 
    handleStripeWebhook, 
    getUserOrders, 
    getOrderById, 
    updateOrderStatus,
    verifyPayment  // Add this import
} from '../controllers/order_controller.js';

const router = express.Router();

// Public route for payment verification (no auth needed)
router.get('/verify-payment', verifyPayment);

// Protected routes
router.post('/create', isUserAuthenticated, createOrder);
router.get('/my-orders', isUserAuthenticated, getUserOrders);
router.get('/:id', isUserAuthenticated, getOrderById);
router.put('/update-status/:id', isUserAuthenticated, updateOrderStatus);

export default router;