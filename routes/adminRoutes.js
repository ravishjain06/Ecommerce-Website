import express from 'express';
import { getAllUsers, getAllOrders, updateOrder, getAllProducts } from '../controllers/adminController.js';

const router = express.Router();

router.get('/users', getAllUsers);
router.get('/orders', getAllOrders);
router.put('/status/update', updateOrder);
router.get('/products', getAllProducts);
export default router;