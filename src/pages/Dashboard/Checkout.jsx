import React, { useState } from 'react'
import { ChevronRightIcon, CreditCardIcon, TruckIcon } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from '../../components/ui/button'
import { useCreateOrderMutation } from '../../APIs/order'
import { useGetCartQuery } from '../../APIs/cart'
import { useSelector } from 'react-redux'

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
      <div className='max-w-6xl mx-auto py-8 px-4'>
        
        {/* Breadcrumb */}
        <div className='flex items-center text-sm text-gray-600 mb-6'>
          <span>Home</span>
          <ChevronRightIcon className='h-4 w-4 mx-2' />
          <span>Cart</span>
          <ChevronRightIcon className='h-4 w-4 mx-2' />
          <span className='text-gray-900'>Checkout</span>
        </div>

        {/* Main Heading */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>Checkout</h1>
          <p className='text-gray-600'>Complete your order details below</p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          
          {/* Left Side - Billing Details & Payment */}
          <div className='lg:col-span-2 space-y-8'>
            
            {/* Billing Details */}
            <div className='bg-white rounded-lg shadow-sm p-6'>
              <h2 className='text-xl font-semibold text-gray-900 mb-6'>Billing Details</h2>
              
              <form onSubmit={handlePlaceOrder} className='space-y-5'>
                
                {/* Name Fields */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className="grid w-full items-center gap-1.5">
                    <label htmlFor="firstName" className='text-sm text-gray-600'>
                      First Name *
                    </label>
                    <Input
                      id="firstName"
                      name='firstName'
                      type='text'
                      placeholder="Enter your first name"
                      className="w-full"
                      value={billingDetails.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <label htmlFor="lastName" className='text-sm text-gray-600'>
                      Last Name *
                    </label>
                    <Input
                      id="lastName"
                      name='lastName'
                      type='text'
                      placeholder="Enter your last name"
                      className="w-full"
                      value={billingDetails.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Street */}
                <div className="grid w-full items-center gap-1.5">
                  <label htmlFor="street" className='text-sm text-gray-600'>
                    Street *
                  </label>
                  <Input
                    id="street"
                    name='street'
                    type='text'
                    placeholder="Enter your street"
                    className="w-full"
                    value={billingDetails.street}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Address */}
                <div className="grid w-full items-center gap-1.5">
                  <label htmlFor="address" className='text-sm text-gray-600'>
                    Address *
                  </label>
                  <Input
                    id="address"
                    name='address'
                    type='text'
                    placeholder="Apartment, suite, etc."
                    className="w-full"
                    value={billingDetails.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* City, State, Postal Code */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div className="grid w-full items-center gap-1.5">
                    <label htmlFor="city" className='text-sm text-gray-600'>
                      City *
                    </label>
                    <Input
                      id="city"
                      name='city'
                      type='text'
                      placeholder="Enter your city"
                      className="w-full"
                      value={billingDetails.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <label htmlFor="state" className='text-sm text-gray-600'>
                      State *
                    </label>
                    <Input
                      id="state"
                      name='state'
                      type='text'
                      placeholder="Enter your state"
                      className="w-full"
                      value={billingDetails.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <label htmlFor="postalCode" className='text-sm text-gray-600'>
                      Postal Code *
                    </label>
                    <Input
                      id="postalCode"
                      name='postalCode'
                      type='text'
                      placeholder="Enter postal code"
                      className="w-full"
                      value={billingDetails.postalCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="grid w-full items-center gap-1.5">
                  <label htmlFor="phone" className='text-sm text-gray-600'>
                    Phone *
                  </label>
                  <Input
                    id="phone"
                    name='phone'
                    type='tel'
                    placeholder="Enter your phone number"
                    className="w-full"
                    value={billingDetails.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* HR Line */}
                <div className="flex items-center w-full my-8 space-x-4 text-gray-500 text-sm">
                  <hr className="flex-grow border-t border-gray-300" />
                  <span className="whitespace-nowrap">PAYMENT METHOD</span>
                  <hr className="flex-grow border-t border-gray-300" />
                </div>

                {/* Payment Methods */}
                <div>
                  <h3 className='text-lg font-semibold text-gray-900 mb-4'>Choose Payment Method</h3>
                  
                  <div className='space-y-3'>
                    {/* Cash on Delivery */}
                    <div className='flex items-center p-4 border border-gray-300 rounded-lg hover:border-blue-500 transition-colors'>
                      <input
                        type='radio'
                        id='cashOnDelivery'
                        name='paymentMethod'
                        value='CashOnDelivery'
                        checked={paymentMethod === 'CashOnDelivery'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className='w-4 h-4 text-blue-600'
                      />
                      <label htmlFor='cashOnDelivery' className='ml-3 flex items-center cursor-pointer flex-1'>
                        <TruckIcon className='w-5 h-5 text-gray-600 mr-3' />
                        <div>
                          <div className='font-medium text-gray-900'>Cash on Delivery</div>
                          <div className='text-sm text-gray-600'>Pay when your order arrives</div>
                        </div>
                      </label>
                    </div>

                    {/* Stripe Online Payment */}
                    <div className='flex items-center p-4 border border-gray-300 rounded-lg hover:border-blue-500 transition-colors'>
                      <input
                        type='radio'
                        id='stripe'
                        name='paymentMethod'
                        value='Stripe'
                        checked={paymentMethod === 'Stripe'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className='w-4 h-4 text-blue-600'
                      />
                      <label htmlFor='stripe' className='ml-3 flex items-center cursor-pointer flex-1'>
                        <CreditCardIcon className='w-5 h-5 text-gray-600 mr-3' />
                        <div>
                          <div className='font-medium text-gray-900'>Online Payment (Stripe)</div>
                          <div className='text-sm text-gray-600'>Secure payment with credit/debit card</div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Place Order Button */}
                <div className='mt-8'>
                  <Button
                    type="submit"
                    className="bg-[var(--purple)] hover:bg-[var(--purple)] text-white cursor-pointer w-full py-3"
                    disabled={isLoading}
                  >
                    {isLoading 
                      ? 'Processing...' 
                      : paymentMethod === 'Stripe' 
                        ? 'Proceed to Payment' 
                        : `Place Order - ₹${totalPrice.toLocaleString()}`
                    }
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Side - Order Summary */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-lg shadow-sm p-6 sticky top-8'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>Order Summary</h3>
              
              {/* Cart Items */}
              <div className='space-y-3 mb-4'>
                {cart?.items?.map((item) => (
                  <div key={item._id} className='flex items-center space-x-3'>
                    <img 
                      src={item.productId.img || item.productId.image?.[0]} 
                      alt={item.productId.name}
                      className='w-12 h-12 object-cover rounded'
                    />
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium text-gray-900 truncate'>{item.productId.name}</p>
                      <p className='text-xs text-gray-600'>Size: {item.size} | Qty: {item.quantity}</p>
                    </div>
                    <p className='text-sm font-semibold'>₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <hr className='border-gray-200 mb-4' />

              {/* Price Breakdown */}
              <div className='space-y-2 mb-4'>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600'>Subtotal</span>
                  <span className='font-semibold'>₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600'>Shipping</span>
                  <span className='font-semibold text-green-600'>Free</span>
                </div>
                <hr className='border-gray-200' />
                <div className='flex justify-between text-base font-bold'>
                  <span>Total</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
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