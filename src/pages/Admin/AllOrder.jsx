import React from 'react'
import Sidebar from './Sidebar'
import { useGetAllOrdersQuery, useUpdateOrderMutation } from '../../APIs/admin'

const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const AllOrder = () => {
  const { data: orders = [], isLoading, isError } = useGetAllOrdersQuery();
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();

  const handleStatusChange = async (orderId, newStatus) => {
   
    try {
      // Pass orderId and updateData in body as required, using orderStatus
      await updateOrder({ orderId, data: { orderId, orderStatus: newStatus } });
    } catch (err) {
      // Optionally show error toast
      console.error('Failed to update order status', err);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 lg:p-8">
        <h2 className="text-2xl font-light text-black tracking-wide mb-6">All Orders</h2>
        <div className="overflow-x-auto rounded-lg shadow border border-gray-200 bg-white min-h-[200px]">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : isError ? (
            <div className="p-8 text-center text-red-500">Failed to load orders.</div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-lg">No orders to display.</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {orders.map((order, idx) => (
                  <tr key={order._id || order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{idx + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">{order._id || order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.user?.name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">₹{order.totalAmount || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold mr-2 ${order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' : order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>{order.orderStatus || 'Pending'}</span>
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : order.paymentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>{order.paymentStatus || 'Pending'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default AllOrder