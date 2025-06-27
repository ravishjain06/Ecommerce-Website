import React, { useState } from 'react';
import { ChevronRightIcon, SearchIcon, FilterIcon, PackageIcon, TruckIcon, CheckCircleIcon, XCircleIcon, ClockIcon, EyeIcon, DownloadIcon } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useGetUserOrdersQuery } from '../../APIs/order'

const Order = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  const { data: ordersData, isLoading, isError } = useGetUserOrdersQuery()
  const orders = ordersData?.orders || []

  // Get status icon and color
  const getStatusDisplay = (status) => {
    switch (status?.toLowerCase()) {
      case 'processing':
        return { icon: ClockIcon, color: 'text-yellow-600', bg: 'bg-yellow-50', text: 'Processing' }
      case 'shipped':
        return { icon: TruckIcon, color: 'text-blue-600', bg: 'bg-blue-50', text: 'Shipped' }
      case 'delivered':
        return { icon: CheckCircleIcon, color: 'text-green-600', bg: 'bg-green-50', text: 'Delivered' }
      case 'cancelled':
        return { icon: XCircleIcon, color: 'text-red-600', bg: 'bg-red-50', text: 'Cancelled' }
      default:
        return { icon: PackageIcon, color: 'text-gray-600', bg: 'bg-gray-50', text: status }
    }
  }

  // Get payment status display
  const getPaymentDisplay = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return { color: 'text-green-600', bg: 'bg-green-50', text: 'Paid' }
      case 'pending':
        return { color: 'text-yellow-600', bg: 'bg-yellow-50', text: 'Pending' }
      case 'failed':
        return { color: 'text-red-600', bg: 'bg-red-50', text: 'Failed' }
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-50', text: status }
    }
  }

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className='text-gray-600 font-light'>Loading your orders...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center max-w-md mx-auto p-8'>
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto bg-gray-100 border border-gray-300 flex items-center justify-center">
              <XCircleIcon className="w-8 h-8 text-gray-600" />
            </div>
          </div>
          <h3 className="text-xl font-light text-black mb-2 tracking-wide">Error loading orders</h3>
          <p className='text-gray-600 font-light mb-6'>Unable to load your orders right now</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-black text-white font-medium px-6 py-3 hover:bg-gray-800 transition-colors text-sm tracking-wide"
          >
            TRY AGAIN
          </button>
        </div>
      </div>
    )
  }

  if (!orders || orders.length === 0) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <div className='max-w-7xl mx-auto'>
          <div className='bg-white'>
            <div className='px-4 md:px-8 py-6 border-b border-gray-200'>
              <div className='flex items-center text-sm text-gray-500 font-light'>
                <NavLink to="/" className='hover:text-black transition-colors cursor-pointer'>Home</NavLink>
                <ChevronRightIcon className='h-3 w-3 mx-3' />
                <NavLink to="/dashboard" className='hover:text-black transition-colors cursor-pointer'>Dashboard</NavLink>
                <ChevronRightIcon className='h-3 w-3 mx-3' />
                <span className='text-black font-medium'>My Orders</span>
              </div>
            </div>
            <div className='p-4 md:p-6 lg:p-8'>
              <div className='mb-16'>
                <p className="text-xs font-medium tracking-[0.3em] text-gray-500 uppercase mb-2">Order Management</p>
                <h1 className='text-3xl md:text-4xl lg:text-5xl font-light text-black mb-4'>
                  My<span className="block font-extralight text-gray-600">Orders</span>
                </h1>
              </div>
              <div className='text-center py-16'>
                <div className="mb-6">
                  <div className="w-16 h-16 mx-auto bg-gray-100 border border-gray-300 flex items-center justify-center">
                    <PackageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-xl font-light text-black mb-2 tracking-wide">No orders found</h3>
                <p className='text-gray-600 font-light mb-6'>You haven't placed any orders yet</p>
                <NavLink to="/product">
                  <button className='bg-black text-white font-medium px-8 py-3 hover:bg-gray-800 transition-colors text-sm tracking-wide'>
                    START SHOPPING
                  </button>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto'>
        <div className='bg-white'>
          {/* Breadcrumb */}
          <div className='px-4 md:px-8 py-6 border-b border-gray-200'>
            <div className='flex items-center text-sm text-gray-500 font-light'>
              <NavLink to="/" className='hover:text-black transition-colors cursor-pointer'>Home</NavLink>
              <ChevronRightIcon className='h-3 w-3 mx-3' />
              <NavLink to="/dashboard" className='hover:text-black transition-colors cursor-pointer'>Dashboard</NavLink>
              <ChevronRightIcon className='h-3 w-3 mx-3' />
              <span className='text-black font-medium'>My Orders</span>
            </div>
          </div>

          <div className='p-4 md:p-6 lg:p-8'>
            {/* Page Header */}
            <div className='mb-16'>
              <p className="text-xs font-medium tracking-[0.3em] text-gray-500 uppercase mb-2">Order Management</p>
              <h1 className='text-3xl md:text-4xl lg:text-5xl font-light text-black mb-4'>
                My<span className="block font-extralight text-gray-600">Orders</span>
              </h1>
              <p className="text-gray-600 font-light mb-6 max-w-2xl">
                Track and manage your orders, view order history, and download invoices
              </p>
            </div>

            {/* Orders List */}
            <div className='space-y-6'>
              {orders.map((order) => (
                <div key={order._id} className='bg-white border border-gray-200 hover:shadow-lg transition-all duration-300'>
                  {/* Order Header */}
                  <div className='px-6 py-4 border-b border-gray-100 bg-gray-50'>
                    <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                      <div className='flex flex-col md:flex-row md:items-center gap-4'>
                        <div>
                          <p className='text-xs text-gray-500 uppercase tracking-wider mb-1'>Order ID</p>
                          <p className='font-medium text-black text-sm'>#{order._id.slice(-8)}</p>
                        </div>
                        <div>
                          <p className='text-xs text-gray-500 uppercase tracking-wider mb-1'>Order Date</p>
                          <p className='text-sm text-gray-700'>{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className='text-xs text-gray-500 uppercase tracking-wider mb-1'>Total Amount</p>
                          <p className='font-medium text-black text-sm'>₹{order.totalAmount.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className='flex items-center gap-3'>
                        {/* Order Status */}
                        <div className={`px-3 py-1 rounded-full ${getStatusDisplay(order.orderStatus).bg} flex items-center gap-2`}>
                          {React.createElement(getStatusDisplay(order.orderStatus).icon, {
                            className: `h-3 w-3 ${getStatusDisplay(order.orderStatus).color}`
                          })}
                          <span className={`text-xs font-medium ${getStatusDisplay(order.orderStatus).color}`}>
                            {getStatusDisplay(order.orderStatus).text}
                          </span>
                        </div>
                        
                        {/* Payment Status */}
                        <div className={`px-3 py-1 rounded-full ${getPaymentDisplay(order.paymentStatus).bg}`}>
                          <span className={`text-xs font-medium ${getPaymentDisplay(order.paymentStatus).color}`}>
                            {getPaymentDisplay(order.paymentStatus).text}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className='p-6'>
                    <div className='space-y-4'>
                      {order.products.map((item) => (
                        <div key={item._id} className='flex items-center gap-4 p-4 bg-gray-50 rounded-lg'>
                          {/* Product Image */}
                          <div className='w-16 h-16 bg-white border border-gray-200 rounded-lg overflow-hidden flex-shrink-0'>
                            <img 
                              src={item.productId.img || item.productId.image?.[0] || '/public/jackets.jpg'}
                              alt={item.productId.name}
                              className='w-full h-full object-cover'
                              onError={(e) => {
                                e.target.src = "/public/jackets.jpg";
                              }}
                            />
                          </div>

                          {/* Product Details */}
                          <div className='flex-1 min-w-0'>
                            <h3 className='font-medium text-black text-sm mb-1 truncate'>
                              {item.productId.name}
                            </h3>
                            <p className='text-xs text-gray-600 uppercase tracking-wide mb-1'>
                              {item.productId.brandName}
                            </p>
                            <p className='text-xs text-gray-500'>
                              Size: {item.size} • Qty: {item.quantity}
                            </p>
                          </div>

                          {/* Price */}
                          <div className='text-right flex-shrink-0'>
                            <p className='font-medium text-black text-sm'>
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </p>
                            {item.quantity > 1 && (
                              <p className='text-xs text-gray-500'>
                                ₹{item.price} each
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Address */}
                    <div className='mt-6 pt-6 border-t border-gray-100'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div>
                          <h4 className='text-xs text-gray-500 uppercase tracking-wider mb-2'>Shipping Address</h4>
                          <div className='text-sm text-gray-700 space-y-1'>
                            <p className='font-medium'>{order.shippingAddress.firstname} {order.shippingAddress.lastname}</p>
                            <p>{order.shippingAddress.street}</p>
                            <p>{order.shippingAddress.address}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                            <p>Phone: {order.shippingAddress.phone}</p>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className='text-xs text-gray-500 uppercase tracking-wider mb-2'>Payment Method</h4>
                          <p className='text-sm text-gray-700 font-medium'>{order.paymentMethod}</p>
                        </div>
                      </div>
                    </div>

                    {/* Order Actions */}
                    <div className='mt-6 pt-6 border-t border-gray-100 flex justify-end gap-3'>
                      <button className='px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors'>
                        View Details
                      </button>
                      {order.orderStatus.toLowerCase() === 'delivered' && (
                        <button className='px-4 py-2 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors'>
                          Download Invoice
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Order