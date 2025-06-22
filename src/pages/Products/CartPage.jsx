import React from 'react'
import { ChevronRightIcon, MinusIcon, PlusIcon, TrashIcon, XIcon } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useGetCartQuery, useRemoveFromCartMutation, useUpdateQuantityMutation } from '../../APIs/cart'
import { NavLink } from 'react-router-dom'

const CartPage = () => {

  const user = useSelector(state=>state.auth.user)
  const userId = user?._id
  const { data: cartData, isLoading, isError, error, refetch } = useGetCartQuery()
  
  // Add mutations
  const [removeFromCart, { isLoading: isRemoving }] = useRemoveFromCartMutation()
  const [updateQuantity, { isLoading: isUpdating }] = useUpdateQuantityMutation()
  
  console.log('Cart Data:', cartData)
  console.log('Is Loading:', isLoading)
  console.log('Is Error:', isError)
  console.log('Error:', error)

  // Handle remove item
  const handleRemoveItem = async (productId) => {
    try {
      await removeFromCart(productId).unwrap()
      console.log('Item removed successfully')
      refetch() // Refresh cart data
    } catch (error) {
      console.error('Failed to remove item:', error)
      alert('Failed to remove item from cart')
    }
  }

  // Handle quantity update
  const handleUpdateQuantity = async (productId, newQuantity, size) => {
    if (newQuantity < 1) {
      // If quantity becomes 0, remove the item instead
      handleRemoveItem(productId)
      return
    }

    try {
      await updateQuantity({ 
        productId, 
        quantity: newQuantity, 
        size 
      }).unwrap()
      console.log('Quantity updated successfully')
      refetch() // Refresh cart data
    } catch (error) {
      console.error('Failed to update quantity:', error)
      alert('Failed to update quantity')
    }
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading your cart...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (isError) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center text-red-600'>
          <p>Error loading cart: {error?.message || 'Unknown error'}</p>
        </div>
      </div>
    )
  }

  const cart = cartData?.data
  const items = cart?.items || []
  const totalPrice = cartData?.totalPrice || 0

  // Show empty cart
  if (!cart || items.length === 0) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-gray-600 text-lg mb-4'>Your cart is empty</p>
          <button className='bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800'>
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen'>
      <div className='max-w-6xl mx-auto bg-white p-4 md:p-8'>
        
        {/* Breadcrumb */}
        <div className='flex items-center text-xs md:text-sm text-gray-600 mb-4'>
          <span>Home</span>
          <ChevronRightIcon className='h-3 w-3 md:h-4 md:w-4 mx-1 md:mx-2' />
          <span>Cart</span>
          <ChevronRightIcon className='h-3 w-3 md:h-4 md:w-4 mx-1 md:mx-2' />
          <span className='text-gray-900'>Shopping Cart ({items.length} items)</span>
        </div>

        {/* Title and Subline */}
        <div className='mb-6 md:mb-8'>
          <h1 className='text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 md:mb-2'>Your Shopping Cart</h1>
          <p className='text-sm md:text-base text-gray-600'>Review your items before checkout</p>
        </div>

        {/* Mobile Card Layout */}
        <div className='block md:hidden space-y-4 mb-6'>
          {items.map((item) => (
            <div key={item._id} className='border border-gray-200 rounded-lg p-4'>
              <div className='flex justify-between items-start mb-3'>
                <div className='flex space-x-3 flex-1'>
                  <img 
                    src={item.productId.img || item.productId.image?.[0] || '/public/jackets.jpg'}
                    alt={item.productId.name}
                    className='w-16 h-16 object-cover rounded-lg flex-shrink-0'
                  />
                  <div className='flex-1 min-w-0'>
                    <h3 className='font-semibold text-gray-900 text-sm'>{item.productId.name}</h3>
                    <p className='text-xs text-gray-600'>{item.productId.brandName}</p>
                    <p className='text-xs text-gray-500'>Size: {item.size}, Qty: {item.quantity}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleRemoveItem(item.productId._id)}
                  disabled={isRemoving}
                  className='p-1 text-gray-500 hover:text-red-600 disabled:opacity-50'
                >
                  <XIcon className='h-4 w-4' />
                </button>
              </div>
              
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <button 
                    onClick={() => handleUpdateQuantity(item.productId._id, item.quantity - 1, item.size)}
                    disabled={isUpdating || item.quantity <= 1}
                    className='p-1 border border-gray-300 rounded disabled:opacity-50'
                  >
                    <MinusIcon className='h-3 w-3' />
                  </button>
                  <span className='text-sm min-w-[24px] text-center'>{item.quantity}</span>
                  <button 
                    onClick={() => handleUpdateQuantity(item.productId._id, item.quantity + 1, item.size)}
                    disabled={isUpdating}
                    className='p-1 border border-gray-300 rounded disabled:opacity-50'
                  >
                    <PlusIcon className='h-3 w-3' />
                  </button>
                </div>
                
                <div className='text-right'>
                  <div className='font-semibold text-base text-gray-900'>₹{(item.price * item.quantity).toLocaleString()}</div>
                  <div className='text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded mt-1'>₹{item.price} each</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table Layout */}
        <div className='hidden md:block mb-8'>
          <div className='overflow-x-auto'>
            <table className='w-full border-collapse'>
              <thead>
                <tr className='border-b border-gray-200'>
                  <th className='text-left py-3 md:py-4 px-2 font-semibold text-gray-900 text-sm md:text-base'>Product Details</th>
                  <th className='text-left py-3 md:py-4 px-2 font-semibold text-gray-900 text-sm md:text-base'>Price</th>
                  <th className='text-left py-3 md:py-4 px-2 font-semibold text-gray-900 text-sm md:text-base'>Quantity</th>
                  <th className='text-left py-3 md:py-4 px-2 font-semibold text-gray-900 text-sm md:text-base'>Size</th>
                  <th className='text-left py-3 md:py-4 px-2 font-semibold text-gray-900 text-sm md:text-base'>Subtotal</th>
                  <th className='text-left py-3 md:py-4 px-2 font-semibold text-gray-900 text-sm md:text-base'>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id} className='border-b border-gray-100'>
                    <td className='py-3 md:py-4 px-2'>
                      <div className='flex items-center space-x-3 md:space-x-4'>
                        <img 
                          src={item.productId.img || item.productId.image?.[0] || '/public/jackets.jpg'}
                          alt={item.productId.name}
                          className='w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg flex-shrink-0'
                        />
                        <div className='min-w-0'>
                          <h3 className='font-semibold text-gray-900 text-sm md:text-base'>{item.productId.name}</h3>
                          <p className='text-xs md:text-sm text-gray-600'>{item.productId.brandName}</p>
                          <p className='text-xs md:text-sm text-gray-500'>{item.productId.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className='py-3 md:py-4 px-2'>
                      <span className='font-semibold text-sm md:text-base'>₹{item.price.toLocaleString()}</span>
                    </td>
                    <td className='py-3 md:py-4 px-2'>
                      <div className='flex items-center space-x-1 md:space-x-2'>
                        <button 
                          onClick={() => handleUpdateQuantity(item.productId._id, item.quantity - 1, item.size)}
                          disabled={isUpdating || item.quantity <= 1}
                          className='p-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                          <MinusIcon className='h-3 w-3 md:h-4 md:w-4' />
                        </button>
                        <span className='w-6 md:w-8 text-center text-sm md:text-base'>{item.quantity}</span>
                        <button 
                          onClick={() => handleUpdateQuantity(item.productId._id, item.quantity + 1, item.size)}
                          disabled={isUpdating}
                          className='p-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                          <PlusIcon className='h-3 w-3 md:h-4 md:w-4' />
                        </button>
                      </div>
                    </td>
                    <td className='py-3 md:py-4 px-2'>
                      <span className='text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs md:text-sm'>{item.size}</span>
                    </td>
                    <td className='py-3 md:py-4 px-2'>
                      <span className='font-semibold text-sm md:text-base'>₹{(item.price * item.quantity).toLocaleString()}</span>
                    </td>
                    <td className='py-3 md:py-4 px-2'>
                      <button 
                        onClick={() => handleRemoveItem(item.productId._id)}
                        disabled={isRemoving}
                        className='p-1 md:p-2 text-red-600 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed'
                      >
                        <TrashIcon className='h-3 w-3 md:h-4 md:w-4' />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Loading overlay for updates */}
        {(isRemoving || isUpdating) && (
          <div className='fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50'>
            <div className='bg-white p-4 rounded-lg'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2'></div>
              <p className='text-sm text-gray-600'>Updating cart...</p>
            </div>
          </div>
        )}

        {/* Discount Code and Total Section */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-8'>
          
          {/* Discount Codes */}
          <div className='bg-gray-50 p-4 md:p-6 rounded-lg'>
            <h3 className='text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4'>Discount Codes</h3>
            <div className='flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2'>
              <input
                type='text'
                placeholder='Enter discount code'
                className='flex-1 px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base'
              />
              <button className='px-4 md:px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm md:text-base'>
                Apply
              </button>
            </div>
            {cart.coupon && (
              <div className='mt-3 p-2 bg-green-100 text-green-800 rounded text-sm'>
                Coupon applied: {cart.coupon}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className='bg-gray-50 p-4 md:p-6 rounded-lg'>
            <h3 className='text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4'>Order Summary</h3>
            <div className='space-y-2 md:space-y-3 mb-4 md:mb-6'>
              <div className='flex justify-between text-sm md:text-base'>
                <span className='text-gray-600'>Subtotal ({items.length} items)</span>
                <span className='font-semibold'>₹{totalPrice.toLocaleString()}</span>
              </div>
              <div className='flex justify-between text-sm md:text-base'>
                <span className='text-gray-600'>Shipping</span>
                <span className='font-semibold'>Free</span>
              </div>
              {cart.coupon && (
                <div className='flex justify-between text-green-600 text-sm md:text-base'>
                  <span>Discount</span>
                  <span className='font-semibold'>Applied</span>
                </div>
              )}
              <hr className='border-gray-300' />
              <div className='flex justify-between text-base md:text-lg font-bold'>
                <span>Grand Total</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>
            </div>
            
          <NavLink to={`/check-out`} className='w-full'>
            <button className='w-full bg-black text-white py-2 md:py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold text-sm md:text-base'>
              Proceed to Checkout
            </button>
          </NavLink>
          </div>
        </div>

        {/* HR Line */}
        <hr className='border-gray-200' />

      </div>
    </div>
  )
}

export default CartPage