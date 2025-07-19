import express from 'express';
import {
  getAllUsers,
  getAllOrders,
  updateOrder,
  getAllProducts,
  toggleUserBlock,
  deleteProduct,
  addProduct,
  updateProduct,
  deleteOrder,
  getDashboardStats,
  getAdminActivityLogs,
  deleteUser
} from '../controllers/adminController.js';

const router = express.Router();

// User management
router.get('/users', getAllUsers);
router.post('/user/block', toggleUserBlock);
router.delete('/user/delete', deleteUser);

// Order management
router.get('/orders', getAllOrders);
router.put('/order/update', updateOrder);
router.delete('/order/delete', deleteOrder);

// Product management
router.get('/products', getAllProducts);
router.post('/product/add', addProduct);
router.put('/product/update', updateProduct);
router.delete('/product/delete', deleteProduct);

// Dashboard & logs
router.get('/dashboard-stats', getDashboardStats);
router.get('/activity-logs', getAdminActivityLogs);

export default router;