import React from 'react'
import Sidebar from './Sidebar'
import { useGetDashboardStatsQuery, useGetAdminActivityLogsQuery } from '../../APIs/admin'
import { FaUsers, FaShoppingCart, FaBox, FaRupeeSign, FaEye, FaCalendarAlt, FaChartBar, FaUserShield, FaExclamationTriangle, FaChartLine } from 'react-icons/fa'

const Dashboard = () => {
  const { data, isLoading, isError } = useGetDashboardStatsQuery();
  const { data: logsData, isLoading: logsLoading, isError: logsError } = useGetAdminActivityLogsQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-6 h-6 border-2 border-black border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">Failed to load dashboard</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar: fixed on the left */}
      <div className="hidden md:block">
        <div className="fixed inset-y-0 left-0 w-72 z-30">
          <Sidebar />
        </div>
      </div>
      {/* Main content: scrollable */}
      <main className="flex-1 md:ml-72 h-screen overflow-y-auto p-6 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-light text-black">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of your store performance</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard 
            icon={FaUsers} 
            label="Total Users" 
            value={data.totalUsers.toLocaleString()} 
            color="blue"
          /> 
          <StatCard 
            icon={FaShoppingCart} 
            label="Total Orders" 
            value={data.totalOrders.toLocaleString()} 
            color="green"
          />
          <StatCard 
            icon={FaBox} 
            label="Total Products" 
            value={data.totalProducts.toLocaleString()} 
            color="purple"
          />
          <StatCard 
            icon={FaRupeeSign} 
            label="Total Sales" 
            value={`₹${data.totalSales.toLocaleString()}`} 
            color="orange"
          />
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard 
            icon={FaShoppingCart} 
            label="Pending Orders" 
            value={data.pendingOrders} 
            color="yellow"
          />
          <StatCard 
            icon={FaUsers} 
            label="Active Users (7d)" 
            value={data.activeUsers} 
            color="green"
          />
          <StatCard 
            icon={FaShoppingCart} 
            label="Abandoned Carts" 
            value={data.abandonedCarts} 
            color="red"
          />
        </div>

        {/* Recent Orders & Order Status Overview - Merged */}
        <SectionCard title="Recent Orders & Order Status" icon={FaEye}>
          {/* Order Status Overview */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-700 mb-4 uppercase tracking-wide">Order Status Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.orderStatusCounts.map(status => (
                <div key={status._id} className="text-center py-4 bg-gray-50 border border-gray-200">
                  <div className="text-2xl font-light text-black mb-1">{status.count}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">{status._id}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders Table */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-4 uppercase tracking-wide">Recent Orders</h3>
            {data.recentOrders.length === 0 ? (
              <p className="text-gray-500 text-sm">No recent orders</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-100">
                      <th className="py-3 pr-6 font-medium">Order ID</th>
                      <th className="py-3 pr-6 font-medium">Customer</th>
                      <th className="py-3 pr-6 font-medium">Products</th>
                      <th className="py-3 pr-6 font-medium">Amount</th>
                      <th className="py-3 pr-6 font-medium">Status</th>
                      <th className="py-3 pr-6 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentOrders.map(order => (
                      <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 pr-6 font-mono text-gray-800">#{order._id.slice(-6)}</td>
                        <td className="py-4 pr-6">
                          <div>
                            <div className="font-medium text-gray-900">{order.user?.name || 'Guest'}</div>
                            <div className="text-xs text-gray-500">{order.user?.email}</div>
                          </div>
                        </td>
                        <td className="py-4 pr-6">
                          <div className="text-gray-700">
                            {order.products.length === 1 
                              ? order.products[0].productId?.name 
                              : `${order.products.length} items`}
                          </div>
                        </td>
                        <td className="py-4 pr-6 font-medium text-gray-900">₹{order.totalPrice?.toLocaleString()}</td>
                        <td className="py-4 pr-6">
                          <span className={`px-3 py-1 text-xs font-medium border ${
                            order.orderStatus.toLowerCase() === 'delivered' ? 'bg-green-100 text-green-800 border-green-200' :
                            order.orderStatus.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                            order.orderStatus.toLowerCase() === 'processing' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                            order.orderStatus.toLowerCase() === 'cancelled' ? 'bg-red-100 text-red-800 border-red-200' :
                            'bg-gray-100 text-gray-800 border-gray-200'
                          }`}>
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="py-4 pr-6 text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </SectionCard>

        {/* Low Stock Alert */}
        {data.lowStockProducts.length > 0 && (
          <SectionCard title="Low Stock Alert" icon={FaExclamationTriangle}>
            <div className="space-y-3">
              {data.lowStockProducts.map(product => (
                <div key={product._id} className="flex justify-between items-center py-3 px-4 bg-red-50 border border-red-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500"></div>
                    <span className="text-sm font-medium text-gray-900">{product.name}</span>
                  </div>
                  <span className="text-sm font-medium text-red-600">{product.inStock} left</span>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Sales Per Day */}
          <SectionCard title="Sales Per Day (7d)" icon={FaCalendarAlt}>
            <div className="space-y-3">
              {data.salesPerDay.map((day, index) => (
                <div key={day._id} className="flex justify-between items-center py-3 px-4 bg-gray-50 border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-black"></div>
                    <span className="text-sm font-medium text-gray-700">
                      {new Date(day._id).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">₹{day.total.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{day.count} orders</div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Revenue by Category */}
          <SectionCard title="Revenue by Category" icon={FaChartBar}>
            <div className="space-y-3">
              {data.revenueByCategory.map(category => (
                <div key={category._id} className="flex justify-between items-center py-3 px-4 bg-gray-50 border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-black"></div>
                    <span className="text-sm font-medium text-gray-700">{category._id}</span>
                  </div>
                  <div className="text-sm font-medium text-gray-900">₹{category.totalRevenue.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Admin Activity Logs */}
        <SectionCard title="Admin Activity Logs" icon={FaUserShield}>
          {logsLoading ? (
            <div className="text-gray-500 text-sm">Loading logs...</div>
          ) : logsError ? (
            <div className="text-red-500 text-sm">Failed to load activity logs</div>
          ) : !logsData?.logs || logsData.logs.length === 0 ? (
            <div className="text-gray-500 text-sm">No activity logs found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100">
                    <th className="py-3 pr-6 font-medium">Date</th>
                    <th className="py-3 pr-6 font-medium">Admin</th>
                    <th className="py-3 pr-6 font-medium">Action</th>
                    <th className="py-3 pr-6 font-medium">Target</th>
                    <th className="py-3 pr-6 font-medium">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {logsData.logs.slice(0, 10).map(log => (
                    <tr key={log._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 pr-6 text-gray-600">{new Date(log.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 pr-6 text-gray-900">{log.adminName}</td>
                      <td className="py-4 pr-6">
                        <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                          {log.action.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-4 pr-6 text-gray-700">{log.targetType}: {log.details?.userName || log.target}</td>
                      <td className="py-4 pr-6 text-gray-600">{log.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      </main>
    </div>
  );
};

// Enhanced stat card with color coding and sharp borders
function StatCard({ icon: Icon, label, value, color = 'gray' }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
    gray: 'bg-gray-50 text-gray-600'
  };

  return (
    <div className="bg-white border border-gray-100 p-6 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 border border-gray-200 ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="text-2xl font-light text-black mb-1">{value}</div>
      <div className="text-xs text-gray-500 uppercase tracking-wide">{label}</div>
    </div>
  );
}

// Enhanced section card with icons and sharp borders
function SectionCard({ title, icon: Icon, children }) {
  return (
    <div className="bg-white border border-gray-100 p-6 mb-6 hover:shadow-sm transition-shadow">
      <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-50">
        <div className="p-2 bg-gray-50 border border-gray-200">
          <Icon className="w-4 h-4 text-gray-600" />
        </div>
        <h2 className="text-lg font-medium text-black">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default Dashboard;