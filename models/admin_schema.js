// filepath: c:\Users\WIN\Desktop\MERN APPS\ECOMMERCE WEBSITE\backend\models\adminLog_schema.js
import mongoose from 'mongoose';

const adminLogSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  adminName: { type: String, required: true },
  action: { type: String, required: true },
  target: { type: String }, // ID of the affected entity
  targetType: { type: String }, // e.g., 'User', 'Product', 'Order'
  details: { type: Object }, // Extra info (field changes, etc.)
  createdAt: { type: Date, default: Date.now }
});

const AdminLog = mongoose.model('AdminLog', adminLogSchema);
export default AdminLog;