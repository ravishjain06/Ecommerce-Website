import React, { useState } from 'react'
import { ChevronRightIcon, CreditCardIcon, TruckIcon, ShieldCheckIcon, CheckCircleIcon } from 'lucide-react'
import { useCreateOrderMutation } from '../../APIs/order'
import { useGetCartQuery } from '../../APIs/cart'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'

const Checkout = () => {
  const user = useSelector(state => state.auth.user)
  const { data: cartData } = useGetCartQuery()
  const [createOrder, { isLoading }] = useCreateOrderMutation()

  const [billingDetails, setBillingDetails] = useState({
    firstName: '',
    lastName: '',
    street: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    phone: ''
  })

  const [paymentMethod, setPaymentMethod] = useState('CashOnDelivery')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setBillingDetails(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    
    // Validate form
    const requiredFields = ['firstName', 'lastName', 'street', 'address', 'city', 'state', 'postalCode', 'phone']
    const missingFields = requiredFields.filter(field => !billingDetails[field])
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`)
      return
    }

    // Check if cart has items
    if (!cart?.items || cart.items.length === 0) {
      alert('Your cart is empty')
      return
    }

    try {
      const shippingAddress = {
        firstname: billingDetails.firstName,
        lastname: billingDetails.lastName,
        street: billingDetails.street,
        address: billingDetails.address,
        city: billingDetails.city,
        state: billingDetails.state,
        postalCode: billingDetails.postalCode,
        phone: billingDetails.phone
      }

      const orderData = {
        shippingAddress,
        paymentMethod,
        shippingCost: 0
      }

      console.log('Order data being sent:', orderData)

      const result = await createOrder(orderData).unwrap()
      console.log('Order created:', result)

      if (paymentMethod === 'CashOnDelivery') {
        alert(`Order placed successfully! Order ID: ${result.orderId}. You will pay on delivery.`)
        
        // Optional: Navigate to order success page
        // navigate(`/order-success/${result.orderId}`)
        
      } else if (paymentMethod === 'Stripe') {
        // Handle Stripe checkout redirection
        if (result.success && result.checkoutUrl) {
          console.log('Redirecting to Stripe checkout:', result.checkoutUrl)
          console.log('Order ID:', result.orderId)
          console.log('Session ID:', result.sessionId)
          
          // Store order info in localStorage for post-payment reference
          localStorage.setItem('pendingOrderId', result.orderId)
          localStorage.setItem('stripeSessionId', result.sessionId)
          
          // Redirect to Stripe hosted checkout page
          window.location.href = result.checkoutUrl
          
        } else {
          throw new Error('No Stripe checkout URL received from server')
        }
      }
      
    } catch (error) {
      console.error('Order failed:', error)
      
      // Enhanced error handling
      if (error.data) {
        alert(`Order failed: ${error.data.message || 'Unknown server error'}`)
      } else if (error.message) {
        alert(`Order failed: ${error.message}`)
      } else {
        alert('Failed to place order. Please try again.')
      }
    }
  }

  const cart = cartData?.data
  const totalPrice = cartData?.totalPrice || 0

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto'>
        <div className='bg-white'>
          
          {/* Breadcrumb */}
          <div className='px-4 md:px-8 py-6 border-b border-gray-200'>
            <div className='flex items-center text-sm text-gray-500 font-light'>
              <NavLink to="/" className='hover:text-black transition-colors cursor-pointer'>Home</NavLink>
              <ChevronRightIcon className='h-3 w-3 mx-3' />
              <NavLink to="/cart" className='hover:text-black transition-colors cursor-pointer'>Cart</NavLink>
              <ChevronRightIcon className='h-3 w-3 mx-3' />
              <span className='text-black font-medium'>Checkout</span>
            </div>
          </div>

          <div className='p-4 md:p-6 lg:p-8'>
            
            {/* Page Header */}
            <div className='mb-16'>
              <p className="text-xs font-medium tracking-[0.3em] text-gray-500 uppercase mb-2">
                Secure Checkout
              </p>
              <h1 className='text-3xl md:text-4xl lg:text-5xl font-light text-black mb-4'>
                Complete Your
                <span className="block font-extralight text-gray-600">
                  Order
                </span>
              </h1>
              <p className="text-gray-600 font-light mb-6 max-w-2xl">
                Review your order details and provide shipping information to complete your purchase
              </p>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
              
              {/* Left Side - Billing Details & Payment */}
              <div className='lg:col-span-2 space-y-8'>
                
                {/* Billing Details */}
                <div className='bg-white border border-gray-200 p-8'>
                  <h2 className='text-sm font-medium text-gray-500 uppercase tracking-[0.2em] mb-6'>
                    Shipping Information
                  </h2>
                  
                  <form onSubmit={handlePlaceOrder} className='space-y-6'>
                    
                    {/* Name Fields */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <div className="space-y-2">
                        <label htmlFor="firstName" className='text-sm font-medium text-gray-500 uppercase tracking-[0.2em]'>
                          First Name *
                        </label>
                        <input
                          id="firstName"
                          name='firstName'
                          type='text'
                          placeholder="Enter your first name"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-black transition-colors duration-300 font-light text-sm"
                          value={billingDetails.firstName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="lastName" className='text-sm font-medium text-gray-500 uppercase tracking-[0.2em]'>
                          Last Name *
                        </label>
                        <input
                          id="lastName"
                          name='lastName'
                          type='text'
                          placeholder="Enter your last name"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-black transition-colors duration-300 font-light text-sm"
                          value={billingDetails.lastName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Street */}
                    <div className="space-y-2">
                      <label htmlFor="street" className='text-sm font-medium text-gray-500 uppercase tracking-[0.2em]'>
                        Street Address *
                      </label>
                      <input
                        id="street"
                        name='street'
                        type='text'
                        placeholder="Enter your street address"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-black transition-colors duration-300 font-light text-sm"
                        value={billingDetails.street}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                      <label htmlFor="address" className='text-sm font-medium text-gray-500 uppercase tracking-[0.2em]'>
                        Apartment / Suite
                      </label>
                      <input
                        id="address"
                        name='address'
                        type='text'
                        placeholder="Apartment, suite, etc. (optional)"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-black transition-colors duration-300 font-light text-sm"
                        value={billingDetails.address}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* City, State, Postal Code */}
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                      <div className="space-y-2">
                        <label htmlFor="city" className='text-sm font-medium text-gray-500 uppercase tracking-[0.2em]'>
                          City *
                        </label>
                        <input
                          id="city"
                          name='city'
                          type='text'
                          placeholder="Enter your city"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-black transition-colors duration-300 font-light text-sm"
                          value={billingDetails.city}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="state" className='text-sm font-medium text-gray-500 uppercase tracking-[0.2em]'>
                          State *
                        </label>
                        <input
                          id="state"
                          name='state'
                          type='text'
                          placeholder="Enter your state"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-black transition-colors duration-300 font-light text-sm"
                          value={billingDetails.state}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="postalCode" className='text-sm font-medium text-gray-500 uppercase tracking-[0.2em]'>
                          Postal Code *
                        </label>
                        <input
                          id="postalCode"
                          name='postalCode'
                          type='text'
                          placeholder="Enter postal code"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-black transition-colors duration-300 font-light text-sm"
                          value={billingDetails.postalCode}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <label htmlFor="phone" className='text-sm font-medium text-gray-500 uppercase tracking-[0.2em]'>
                        Phone Number *
                      </label>
                      <input
                        id="phone"
                        name='phone'
                        type='tel'
                        placeholder="Enter your phone number"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-black transition-colors duration-300 font-light text-sm"
                        value={billingDetails.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </form>
                </div>

                {/* Payment Methods */}
                <div className='bg-white border border-gray-200 p-8'>
                  <h3 className='text-sm font-medium text-gray-500 uppercase tracking-[0.2em] mb-6'>
                    Payment Method
                  </h3>
                  
                  <div className='space-y-4'>
                    {/* Cash on Delivery */}
                    <div className={`border-2 transition-all duration-300 cursor-pointer ${
                      paymentMethod === 'CashOnDelivery' 
                        ? 'border-black bg-gray-50' 
                        : 'border-gray-200 hover:border-gray-400'
                    }`}>
                      <label htmlFor='cashOnDelivery' className='flex items-center p-6 cursor-pointer'>
                        <input
                          type='radio'
                          id='cashOnDelivery'
                          name='paymentMethod'
                          value='CashOnDelivery'
                          checked={paymentMethod === 'CashOnDelivery'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className='sr-only'
                        />
                        <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center mr-4 ${
                          paymentMethod === 'CashOnDelivery' 
                            ? 'border-black bg-black' 
                            : 'border-gray-300'
                        }`}>
                          {paymentMethod === 'CashOnDelivery' && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <div className="w-12 h-12 bg-gray-100 border border-gray-300 flex items-center justify-center mr-4">
                          <TruckIcon className='w-6 h-6 text-gray-600' />
                        </div>
                        <div className='flex-1'>
                          <div className='font-medium text-black tracking-wide'>Cash on Delivery</div>
                          <div className='text-sm text-gray-600 font-light'>Pay when your order arrives at your doorstep</div>
                        </div>
                      </label>
                    </div>

                    {/* Stripe Online Payment */}
                    <div className={`border-2 transition-all duration-300 cursor-pointer ${
                      paymentMethod === 'Stripe' 
                        ? 'border-black bg-gray-50' 
                        : 'border-gray-200 hover:border-gray-400'
                    }`}>
                      <label htmlFor='stripe' className='flex items-center p-6 cursor-pointer'>
                        <input
                          type='radio'
                          id='stripe'
                          name='paymentMethod'
                          value='Stripe'
                          checked={paymentMethod === 'Stripe'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className='sr-only'
                        />
                        <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center mr-4 ${
                          paymentMethod === 'Stripe' 
                            ? 'border-black bg-black' 
                            : 'border-gray-300'
                        }`}>
                          {paymentMethod === 'Stripe' && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <div className="w-12 h-12 bg-gray-100 border border-gray-300 flex items-center justify-center mr-4">
                          <CreditCardIcon className='w-6 h-6 text-gray-600' />
                        </div>
                        <div className='flex-1'>
                          <div className='font-medium text-black tracking-wide'>Online Payment</div>
                          <div className='text-sm text-gray-600 font-light'>Secure payment with credit/debit card via Stripe</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className='mt-6 p-4 bg-gray-50 border border-gray-200 flex items-center space-x-3'>
                    <ShieldCheckIcon className='w-5 h-5 text-gray-600 flex-shrink-0' />
                    <p className='text-xs text-gray-600 font-light'>
                      Your payment information is encrypted and secure. We never store your payment details.
                    </p>
                  </div>

                  {/* Place Order Button */}
                  <div className='mt-8'>
                    <button
                      type="submit"
                      onClick={handlePlaceOrder}
                      className="w-full bg-black text-white font-medium py-4 hover:bg-gray-800 transition-colors duration-300 text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
                    >
                      {isLoading 
                        ? 'Processing Order...' 
                        : paymentMethod === 'Stripe' 
                          ? 'Proceed to Payment' 
                          : `Place Order - ₹${totalPrice.toLocaleString()}`
                      }
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side - Order Summary */}
              <div className='lg:col-span-1'>
                <div className='bg-white border border-gray-200 p-8 sticky top-8'>
                  <h3 className='text-sm font-medium text-gray-500 uppercase tracking-[0.2em] mb-6'>
                    Order Summary
                  </h3>
                  
                  {/* Cart Items */}
                  <div className='space-y-4 mb-6 max-h-60 overflow-y-auto'>
                    {cart?.items?.map((item) => (
                      <div key={item._id} className='flex items-center space-x-4 p-4 bg-gray-50 border border-gray-200'>
                        <div className="w-12 h-12 bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                          <img 
                            src={item.productId.img || item.productId.image?.[0]} 
                            alt={item.productId.name}
                            className='w-full h-full object-cover'
                          />
                        </div>
                        <div className='flex-1 min-w-0'>
                          <p className='text-sm font-light text-black truncate tracking-wide'>{item.productId.name}</p>
                          <p className='text-xs text-gray-600 font-light uppercase tracking-wide'>
                            {item.productId.brandName}
                          </p>
                          <p className='text-xs text-gray-500 font-light'>Size: {item.size} | Qty: {item.quantity}</p>
                        </div>
                        <p className='text-sm font-light text-black'>₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>

                  <div className='border-t border-gray-200 pt-6'>
                    {/* Price Breakdown */}
                    <div className='space-y-3 mb-6'>
                      <div className='flex justify-between items-center'>
                        <span className='text-gray-600 font-light'>Subtotal ({cart?.items?.length || 0} items)</span>
                        <span className='font-light text-black'>₹{totalPrice.toLocaleString()}</span>
                      </div>
                      <div className='flex justify-between items-center'>
                        <span className='text-gray-600 font-light'>Shipping</span>
                        <span className='font-light text-black'>Free</span>
                      </div>
                      <div className='flex justify-between items-center'>
                        <span className='text-gray-600 font-light'>Tax</span>
                        <span className='font-light text-black'>Included</span>
                      </div>
                      <div className='border-t border-gray-200 pt-3'>
                        <div className='flex justify-between items-center'>
                          <span className='text-lg font-medium text-black tracking-wide'>Grand Total</span>
                          <span className='text-xl font-light text-black'>₹{totalPrice.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className='space-y-3'>
                      <div className='flex items-center space-x-3 text-sm text-gray-600'>
                        <CheckCircleIcon className='w-4 h-4 text-gray-600' />
                        <span className='font-light'>Free shipping & returns</span>
                      </div>
                      <div className='flex items-center space-x-3 text-sm text-gray-600'>
                        <CheckCircleIcon className='w-4 h-4 text-gray-600' />
                        <span className='font-light'>Secure payment processing</span>
                      </div>
                      <div className='flex items-center space-x-3 text-sm text-gray-600'>
                        <CheckCircleIcon className='w-4 h-4 text-gray-600' />
                        <span className='font-light'>Order tracking available</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout