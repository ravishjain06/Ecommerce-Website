import { User } from '../models/user_schema.js';
import Order from '../models/order_schema.js';
import { Product } from '../models/product_schema.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .populate('orders')
      .populate('Product')
      .populate('wishlist');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .populate('products.productId', 'name price brandName image');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};


export const updateOrder = async (req, res) => {
  try {
    const { orderId, ...updateFields } = req.body;
    if (!orderId) return res.status(400).json({ error: 'orderId is required' });

    const updatedOrder = await Order.findByIdAndUpdate(orderId, updateFields, { new: true })
      .populate('user', 'name email')
      .populate('products.productId', 'name price brandName image');
    if (!updatedOrder) return res.status(404).json({ error: 'Order not found' });
    res.json(updatedOrder);
  } catch (err) {
  console.error(err)
    res.status(500).json({ error: 'Failed to update order' });
  }
};


export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};