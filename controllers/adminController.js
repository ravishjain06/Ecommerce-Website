import { User } from '../models/user_schema.js';
import Order from '../models/order_schema.js';
import { Product } from '../models/product_schema.js';
import { Cart } from '../models/cart_schema.js';
import AdminLog from '../models/admin_schema.js';


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
    
    // Map orders to include product name directly in each product
    const ordersWithProductNames = orders.map(order => ({
      ...order.toObject(),
      products: order.products.map(p => ({
        ...p,
        productName: p.productId?.name || '',
        price: p.productId?.price,
        brandName: p.productId?.brandName,
        image: p.productId?.image,
      }))
    }));

    res.json(ordersWithProductNames);
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


export const toggleUserBlock = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    // Fetch the user first
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Toggle the isBlocked value
    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`, user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user status' });
  }
};


export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ error: 'productId is required' });

    const deleted = await Product.findByIdAndDelete(productId);
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};


export const addProduct = async (req, res) => {
  try {
    const productData = req.body;
    const product = new Product(productData);
    await product.save();
    res.status(201).json({ message: 'Product added successfully', product });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add product' });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const { productId, ...updateFields } = req.body;
    if (!productId) return res.status(400).json({ error: 'productId is required' });

    const updatedProduct = await Product.findByIdAndUpdate(productId, updateFields, { new: true });
    if (!updatedProduct) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
};


export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ error: 'orderId is required' });

    const deleted = await Order.findByIdAndDelete(orderId);
    if (!deleted) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete order' });
  }
};


export const getDashboardStats = async (req, res) => {
  try {
    // Total counts
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();

    // Sales (sum of all paid orders)
    const totalSalesAgg = await Order.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
    const totalSales = totalSalesAgg[0]?.total || 0;

    // Pending orders
    const pendingOrders = await Order.countDocuments({ orderStatus: 'Pending' });

    // Low stock products (example: less than 5 in stock)
    const lowStockProducts = await Product.find({ inStock: { $lte: 5 } }).select('name inStock');

    // Recent orders (last 5)
    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')
      .populate('products.productId', 'name price brandName image');

    // Top selling products (by quantity)
    const topProductsAgg = await Order.aggregate([
      { $unwind: "$products" },
      { $group: { _id: "$products.productId", totalSold: { $sum: "$products.quantity" } } },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);
    const topProductIds = topProductsAgg.map(p => p._id);
    const topProducts = await Product.find({ _id: { $in: topProductIds } });

    // Sales per day (last 7 days)
    const salesPerDay = await Order.aggregate([
      { $match: { paymentStatus: 'Paid', createdAt: { $gte: new Date(Date.now() - 7*24*60*60*1000) } } },
      { $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          total: { $sum: "$totalPrice" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // New users per day (last 7 days)
    const usersPerDay = await User.aggregate([
      { $match: { createdAt: { $gte: new Date(Date.now() - 7*24*60*60*1000) } } },
      { $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Order status breakdown
    const orderStatusCounts = await Order.aggregate([
      { $group: { _id: "$orderStatus", count: { $sum: 1 } } }
    ]);

    // Revenue by category
    const revenueByCategory = await Order.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      { $unwind: "$products" },
      { $lookup: {
          from: "products",
          localField: "products.productId",
          foreignField: "_id",
          as: "productInfo"
        }
      },
      { $unwind: "$productInfo" },
      { $group: {
          _id: "$productInfo.category",
          totalRevenue: { $sum: { $multiply: ["$products.quantity", "$products.price"] } }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    // Abandoned carts (carts with items but no completed order)
    const abandonedCarts = await Cart.countDocuments({ items: { $exists: true, $not: { $size: 0 } } });

    // Active users (last 7 days, if you track lastLogin)
    let activeUsers = null;
    if (User.schema.paths.lastLogin) {
      activeUsers = await User.countDocuments({ lastLogin: { $gte: new Date(Date.now() - 7*24*60*60*1000) } });
    }

    res.json({
      totalUsers,
      totalOrders,
      totalProducts,
      totalSales,
      pendingOrders,
      lowStockProducts,
      recentOrders,
      topProducts,
      salesPerDay,
      usersPerDay,
      orderStatusCounts,
      revenueByCategory,
      abandonedCarts,
      activeUsers
    });
  } catch (err) {
    console.log("Error dashboard",err)
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};

export const getAdminActivityLogs = async (req, res) => {
  try {
    const logs = await AdminLog.find({}).sort({ createdAt: -1 }).limit(50);

    // Map logs to include a human-readable message
    const logsWithMessage = logs.map(log => {
      let message = '';
      switch (log.action) {
        case 'BLOCK_USER':
          message = `Admin ${log.adminName} blocked user ${log.details?.userName || log.target}`;
          break;
        case 'UNBLOCK_USER':
          message = `Admin ${log.adminName} unblocked user ${log.details?.userName || log.target}`;
          break;
        case 'UPDATE_PRODUCT':
          message = `Admin ${log.adminName} updated product ${log.details?.productName || log.target}: ${log.details?.field} changed from ${log.details?.oldValue} to ${log.details?.newValue}`;
          break;
        case 'DELETE_PRODUCT':
          message = `Admin ${log.adminName} deleted product ${log.details?.productName || log.target}`;
          break;
        case 'UPDATE_ORDER_STATUS':
          message = `Admin ${log.adminName} changed order ${log.target} status to ${log.details?.newStatus}`;
          break;
        case 'DELETE_ORDER':
          message = `Admin ${log.adminName} deleted order ${log.target}`;
          break;
        default:
          message = `Admin ${log.adminName} performed action: ${log.action} on ${log.targetType} (${log.target})`;
      }
      return {
        ...log.toObject(),
        message
      };
    });

    res.json({
      message: 'Admin activity logs fetched successfully',
      logs: logsWithMessage
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admin logs' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const deleted = await User.findByIdAndDelete(userId);
    if (!deleted) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
