import React from 'react'
import Sidebar from './Sidebar'
import { useGetAllOrdersQuery, useUpdateOrderMutation } from '../../APIs/admin'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const AllOrder = () => {
  const { data: orders = [], isLoading, isError } = useGetAllOrdersQuery();
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrder({ id: orderId, orderStatus: newStatus }).unwrap();
      toast.success('Order status updated successfully!');
    } catch (err) {
      toast.error('Failed to update order status');
      console.error('Failed to update order status', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <ToastContainer position="top-right" autoClose={2000} />
      {/* Sidebar: fixed on the left */}
      <div className="hidden md:block">
        <div className="fixed inset-y-0 left-0 w-72 z-30">
          <Sidebar />
        </div>
      </div>
      {/* Main content: scrollable */}
      <main className="flex-1 md:ml-72 h-screen overflow-y-auto p-6 md:p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-light text-black">All Orders</h2>
          <p className="text-sm text-gray-500 mt-1">Manage and update all orders</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg overflow-x-auto">
          {isLoading ? (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="w-6 h-6 border-2 border-black border-t-transparent animate-spin"></div>
            </div>
          ) : isError ? (
            <div className="p-8 text-center text-red-500">Failed to load orders.</div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-lg">No orders to display.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th style={{padding: '16px 24px'}} className="font-medium">#</th>
                  <th style={{padding: '16px 24px'}} className="font-medium">Order ID</th>
                  <th style={{padding: '16px 24px'}} className="font-medium">User</th>
                  <th style={{padding: '16px 24px'}} className="font-medium">Total</th>
                  <th style={{padding: '16px 24px'}} className="font-medium">Order Status</th>
                  <th style={{padding: '16px 24px'}} className="font-medium">Payment Status</th>
                  <th style={{padding: '16px 24px'}} className="font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => (
                  <tr key={order._id || order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td style={{padding: '16px 24px'}} className="text-gray-700">{idx + 1}</td>
                    <td style={{padding: '16px 24px'}} className="font-medium text-gray-900">{order._id || order.id}</td>
                    <td style={{padding: '16px 24px'}} className="text-gray-700">{order.user?.name || 'N/A'}</td>
                    <td style={{padding: '16px 24px'}} className="font-medium text-gray-900">₹{order.totalAmount || 0}</td>
                    <td style={{padding: '16px 24px'}}>
                      <span className={
                        `inline-block px-3 py-1 text-xs font-medium border mr-2
                        ${
                          order.orderStatus === 'Delivered'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : order.orderStatus === 'Cancelled'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-gray-50 text-gray-500 border-gray-200'
                        }`
                      }>
                        {order.orderStatus || 'Pending'}
                      </span>
                      <select
                        className="px-2 py-1 rounded text-xs border ml-1 focus:outline-none"
                        value={order.orderStatus || 'Pending'}
                        disabled={isUpdating}
                        onChange={e => handleStatusChange(order._id || order.id, e.target.value)}
                      >
                        {statusOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{padding: '16px 24px'}}>
                      <span className={
                        `inline-block px-3 py-1 text-xs font-medium border
                        ${
                          order.paymentStatus === 'Paid'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : order.paymentStatus === 'Pending'
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                            : 'bg-gray-50 text-gray-500 border-gray-200'
                        }`
                      }>
                        {order.paymentStatus || 'Pending'}
                      </span>
                    </td>
                    <td style={{padding: '16px 24px'}} className="text-gray-500">
                      {order.createdAt
                        ? (() => {
                            const d = new Date(order.createdAt);
                            const day = String(d.getDate()).padStart(2, '0');
                            const month = String(d.getMonth() + 1).padStart(2, '0');
                            const year = d.getFullYear();
                            return `${day}-${month}-${year}`;
                          })()
                        : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}

export default AllOrder