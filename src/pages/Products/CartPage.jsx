import React, { useEffect } from 'react'
import { ChevronRightIcon, MinusIcon, PlusIcon, TrashIcon, XIcon } from 'lucide-react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { useAddToCartMutation, useGetCartQuery, useRemoveFromCartMutation, useUpdateQuantityMutation, useApplyCouponMutation } from '../../APIs/cart'

const CartPage = () => {

  const user = useSelector(state => state.auth.user)
  const userId = user?._id
  const { data: cartData, isLoading, isError, error, refetch } = useGetCartQuery()

  // Add mutations
  const [removeFromCart, { isLoading: isRemoving }] = useRemoveFromCartMutation()
  const [updateQuantity, { isLoading: isUpdating }] = useUpdateQuantityMutation()
  const [applyCoupon, { isLoading: isApplyingCoupon }] = useApplyCouponMutation();

  const [couponInput, setCouponInput] = React.useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [cartData]);

  // Handle remove item
  const handleRemoveItem = async (productId, size) => {
    try {
      console.log('Removing item:', productId, 'size:', size);
      await removeFromCart({ productId, size }).unwrap(); 
      refetch();
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  }

  // Handle quantity update
  const handleUpdateQuantity = async (productId, newQuantity, size) => {
    if (!productId || !newQuantity || newQuantity < 1) {
      // Optionally show a toast or error message here
      return;
    }
    try {
      await updateQuantity({
        productId,
        quantity: newQuantity,
        size
      }).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to update quantity:', error);
 
    } 
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-6 h-6 border-2 border-black border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center max-w-md mx-auto p-8'>
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto bg-gray-100 border border-gray-300 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.764 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-light text-black mb-2 tracking-wide">
            Error loading cart
          </h3>
          <p className='text-gray-600 font-light mb-6'>
            {error?.message || 'Unable to load your cart right now'}
          </p>
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

  const cart = cartData?.data
  const items = cart?.items || []
  const totalPrice = cartData?.totalPrice || 0

  // Show empty cart
  if (!cart || items.length === 0) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <div className='max-w-7xl mx-auto'>
          <div className='bg-white'>
            <div className='p-4 md:p-6 lg:p-8'>
              <div className='mb-16'>
                <p className="text-xs font-medium tracking-[0.3em] text-gray-500 uppercase mb-2">
                  Shopping Cart
                </p>
                <h1 className='text-3xl md:text-4xl lg:text-5xl font-light text-black mb-4'>
                  Your
                  <span className="block font-extralight text-gray-600">
                    Cart
                  </span>
                </h1>
                <p className="text-gray-600 font-light mb-6 max-w-2xl">
                  Review your selected items and proceed to checkout when ready
                </p>
              </div>
              <div className='text-center py-16'>
                <div className="mb-6">
                  <div className="w-16 h-16 mx-auto bg-gray-100 border border-gray-300 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-light text-black mb-2 tracking-wide">
                  Your cart is empty
                </h3>
                <p className='text-gray-600 font-light mb-6'>
                  Looks like you haven't added anything to your cart yet
                </p>
                <NavLink to="/product">
                  <button className='bg-black text-white font-medium px-8 py-3 hover:bg-gray-800 transition-colors text-sm tracking-wide'>
                    CONTINUE SHOPPING
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
          <div className='p-4 md:p-6 lg:p-8'>
            {/* Page Header */}
            <div className='mb-16'>
              <p className="text-xs font-medium tracking-[0.3em] text-gray-500 uppercase mb-2">
                Shopping Cart
              </p>
              <h1 className='text-3xl md:text-4xl lg:text-5xl font-light text-black mb-4'>
                Your
                <span className="block font-extralight text-gray-600">
                  Cart
                </span>
              </h1>
              <p className="text-gray-600 font-light mb-6 max-w-2xl">
                Review your selected items and proceed to checkout when ready
              </p>
            </div>

            {/* Mobile Card Layout */}
            <div className='block md:hidden space-y-6 mb-8'>
              {items.map((item) => (
                <div key={item?._id} className='bg-white border border-gray-200 overflow-hidden'>
                  <div className='p-6'>
                    <div className='flex justify-between items-start mb-4'>
                      <div className='flex space-x-4 flex-1'>
                        <div className="w-20 h-20 bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                          <img
                            src={item?.productId?.img || item?.productId?.image?.[0] || '/noImg.jpg'}
                            alt={item?.productId?.name || 'Product'}
                            className='w-full h-full object-cover'
                          />
                        </div>
                        <div className='flex-1 min-w-0'>
                          <h3 className='font-light text-black text-lg tracking-wide mb-1'>{item?.productId?.name || 'No Name'}</h3>
                          <p className='text-sm text-gray-600 font-light uppercase tracking-wide'>{item?.productId?.brandName || ''}</p>
                          <p className='text-xs text-gray-500 font-light uppercase tracking-wide'>{item?.productId?.category || ''}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item?.productId?._id, item?.size)}
                        disabled={isRemoving}
                        className='w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors duration-300 disabled:opacity-50'
                      >
                        <XIcon className='h-4 w-4 text-gray-600' />
                      </button>
                    </div>

                    <div className='space-y-4'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <span className='text-xs font-medium text-gray-500 uppercase tracking-[0.2em]'>Size</span>
                          <div className='text-sm text-gray-700 font-light mt-1'>{item?.size || ''}</div>
                        </div>
                        <div>
                          <span className='text-xs font-medium text-gray-500 uppercase tracking-[0.2em]'>Price</span>
                          <div className='text-lg font-light text-black mt-1'>₹{item?.price?.toLocaleString?.() || '0'}</div>
                        </div>
                      </div>

                      <div className='flex items-center justify-between'>
                        <div>
                          <span className='text-xs font-medium text-gray-500 uppercase tracking-[0.2em] mb-3 block'>Quantity</span>
                          <div className='flex items-center border border-gray-300 w-fit'>
                            <button
                              onClick={() => handleUpdateQuantity(item?.productId?._id, (item?.quantity || 0) - 1, item?.size)}
                              disabled={isUpdating || (item?.quantity || 0) <= 1}
                              className='p-3 hover:bg-gray-50 transition-colors duration-300 disabled:opacity-50'
                            >
                              <MinusIcon className='h-4 w-4 text-gray-600' />
                            </button>
                            <span className='px-6 py-3 font-medium text-black border-x border-gray-300 min-w-[60px] text-center'>
                              {item?.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item?.productId?._id, (item?.quantity || 0) + 1, item?.size)}
                              disabled={isUpdating}
                              className='p-3 hover:bg-gray-50 transition-colors duration-300 disabled:opacity-50'
                            >
                              <PlusIcon className='h-4 w-4 text-gray-600' />
                            </button>
                          </div>
                        </div>

                        <div className='text-right'>
                          <span className='text-xs font-medium text-gray-500 uppercase tracking-[0.2em]'>Subtotal</span>
                          <div className='text-xl font-light text-black mt-1'>₹{((item?.price || 0) * (item?.quantity || 0)).toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table Layout */}
            <div className='hidden md:block mb-12'>
              <div className='bg-white border border-gray-200 overflow-hidden'>
                <table className='w-full'>
                  <thead className='bg-gray-50 border-b border-gray-200'>
                    <tr>
                      <th className='text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-[0.2em]'>Product</th>
                      <th className='text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-[0.2em]'>Price</th>
                      <th className='text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-[0.2em]'>Quantity</th>
                      <th className='text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-[0.2em]'>Size</th>
                      <th className='text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-[0.2em]'>Subtotal</th>
                      <th className='text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-[0.2em]'>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item?._id} className='border-b border-gray-100 hover:bg-gray-50 transition-colors duration-300'>
                        <td className='py-6 px-6'>
                          <div className='flex items-center space-x-4'>
                            <div className="w-16 h-16 bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                              <img
                                src={item?.productId?.img || item?.productId?.image?.[0] || '/noImg.jpg'}
                                alt={item?.productId?.name || 'Product'}
                                className='w-full h-full object-cover'
                              />
                            </div>
                            <div className='min-w-0'>
                              <h3 className='font-light text-black text-lg tracking-wide mb-1'>{item?.productId?.name || 'No Name'}</h3>
                              <p className='text-sm text-gray-600 font-light uppercase tracking-wide'>{item?.productId?.brandName || ''}</p>
                              <p className='text-xs text-gray-500 font-light uppercase tracking-wide'>{item?.productId?.category || ''}</p>
                            </div>
                          </div>
                        </td>
                        <td className='py-6 px-6'>
                          <span className='text-lg font-light text-black'>₹{item?.price?.toLocaleString?.() || '0'}</span>
                        </td>
                        <td className='py-6 px-6'>
                          <div className='flex items-center border border-gray-300 w-fit'>
                            <button
                              onClick={() => handleUpdateQuantity(item?.productId?._id, (item?.quantity || 0) - 1, item?.size)}
                              disabled={isUpdating || (item?.quantity || 0) <= 1}
                              className='p-3 hover:bg-gray-50 transition-colors duration-300 disabled:opacity-50'
                            >
                              <MinusIcon className='h-4 w-4 text-gray-600' />
                            </button>
                            <span className='px-6 py-3 font-medium text-black border-x border-gray-300 min-w-[60px] text-center'>
                              {item?.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item?.productId?._id, (item?.quantity || 0) + 1, item?.size)}
                              disabled={isUpdating}
                              className='p-3 hover:bg-gray-50 transition-colors duration-300 disabled:opacity-50'
                            >
                              <PlusIcon className='h-4 w-4 text-gray-600' />
                            </button>
                          </div>
                        </td>
                        <td className='py-6 px-6'>
                          <span className='text-sm text-gray-700 font-light'>{item?.size}</span>
                        </td>
                        <td className='py-6 px-6'>
                          <span className='text-lg font-light text-black'>₹{((item?.price || 0) * (item?.quantity || 0)).toLocaleString()}</span>
                        </td>
                        <td className='py-6 px-6'>
                          <button
                            onClick={() => handleRemoveItem(item?.productId?._id, item?.size)}
                            disabled={isRemoving}
                            className='w-10 h-10 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors duration-300 disabled:opacity-50'
                          >
                            <TrashIcon className='h-4 w-4' />
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
              <div className='fixed inset-0 bg-[#0000005e] bg-opacity-30 flex items-center justify-center z-50'>
                <div className='bg-white p-6 border border-gray-200'>
                  <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className='text-sm text-gray-600 font-light'>Updating cart...</p>
                </div>
              </div>
            )}

            {/* Summary Section */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12'>
              {/* Discount Codes */}
              <div className='bg-white border border-gray-200 p-8'>
                <h3 className='text-sm font-medium text-gray-500 uppercase tracking-[0.2em] mb-6'>
                  Discount Code
                </h3>
                <div className='flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3'>
                  <input
                    type='text'
                    placeholder='Enter discount code'
                    value={couponInput}
                    onChange={e => setCouponInput(e.target.value)}
                    className='flex-1 px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-black transition-colors duration-300 font-light text-sm'
                  />
                  <button
                    className='px-8 py-3 bg-black text-white hover:bg-gray-800 transition-colors duration-300 text-sm font-medium tracking-wide disabled:opacity-50'
                    onClick={async () => {
                      if (!couponInput) return;
                      try {
                        await applyCoupon(couponInput).unwrap();
                        setCouponInput("");
                      } catch (err) {
                        console.log(err)
                      }
                    }}
                    disabled={isApplyingCoupon || !couponInput}
                  >
                    {isApplyingCoupon ? "Applying..." : "APPLY"}
                  </button>
                </div>
                {cart?.coupon && cart?.items?.length > 0 && (
                  <div className='mt-4 p-4 bg-green-50 border border-green-200'>
                    <p className='text-sm text-green-700 font-light'>
                      Coupon applied: {cart?.coupon}
                    </p>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className='bg-white border border-gray-200 p-8'>
                <h3 className='text-sm font-medium text-gray-500 uppercase tracking-[0.2em] mb-6'>
                  Order Summary
                </h3>
                <div className='space-y-4 mb-8'>
                  <div className='flex justify-between items-center'>
                    <span className='text-gray-600 font-light'>Subtotal ({items.length} items)</span>
                    <span className='font-light text-black'>₹{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-gray-600 font-light'>Shipping</span>
                    <span className='font-light text-black'>Free</span>
                  </div>
                  {cart?.coupon && (
                    <div className='flex justify-between items-center text-green-600'>
                      <span className='font-light'>Discount</span>
                      <span className='font-light'>
                        {cart?.discountPercent ? `${cart?.discountPercent}%` : "Applied"}
                      </span>
                    </div>
                  )}
                  <div className='border-t border-gray-200 pt-4'>
                    <div className='flex justify-between items-center'>
                      <span className='text-lg font-medium text-black tracking-wide'>Grand Total</span>
                      <span className='text-xl font-light text-black'>₹{totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <NavLink to={`/check-out`} className='block w-full'>
                  <button className='w-full bg-black text-white font-medium py-4 hover:bg-gray-800 transition-colors duration-300 text-sm tracking-wide'>
                    PROCEED TO CHECKOUT
                  </button>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage