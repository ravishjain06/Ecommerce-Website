import React, { useState } from 'react'
import { ChevronRightIcon, CreditCardIcon, TruckIcon, ShieldCheckIcon, CheckCircleIcon } from 'lucide-react'
import { useCreateOrderMutation } from '../../APIs/order'
import { useGetCartQuery } from '../../APIs/cart'
import { useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { TbLoader3 } from "react-icons/tb";
const Checkout = () => {
  const user = useSelector(state => state.auth.user)
  const { data: cartData, refetch } = useGetCartQuery()
  const [createOrder, { isLoading }] = useCreateOrderMutation()
  const navigate = useNavigate()

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
  const [missingFields, setMissingFields] = useState([])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setBillingDetails(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const requiredFields = [
      'firstName', 'lastName', 'street', 'city', 'state', 'postalCode', 'phone'
    ];
    const missing = requiredFields.filter(field => !billingDetails[field]);
    const errors = [...missing];

    // Only letters for names and location fields
    const alphaRegex = /^[A-Za-z\s]+$/;

    if (billingDetails.firstName && !alphaRegex.test(billingDetails.firstName)) {
      if (!errors.includes('firstName')) errors.push('firstName');
      toast.error('First name should contain only letters');
    }
    if (billingDetails.lastName && !alphaRegex.test(billingDetails.lastName)) {
      if (!errors.includes('lastName')) errors.push('lastName');
      toast.error('Last name should contain only letters');
    }
    if (billingDetails.city && !alphaRegex.test(billingDetails.city)) {
      if (!errors.includes('city')) errors.push('city');
      toast.error('City should contain only letters');
    }
    if (billingDetails.state && !alphaRegex.test(billingDetails.state)) {
      if (!errors.includes('state')) errors.push('state');
      toast.error('State should contain only letters');
    }

    // Phone validation (exactly 10 digits)
    if (
      billingDetails.phone &&
      !/^[0-9]{10}$/.test(billingDetails.phone)
    ) {
      if (!errors.includes('phone')) errors.push('phone');
      toast.error('Please enter a valid 10-digit phone number');
    }

    // Postal code validation (5-10 digits)
    if (
      billingDetails.postalCode &&
      !/^[0-9]{5,10}$/.test(billingDetails.postalCode)
    ) {
      if (!errors.includes('postalCode')) errors.push('postalCode');
      toast.error('Please enter a valid postal code (5-10 digits)');
    }

    setMissingFields(errors);

    if (errors.length > 0) {
      // Remove scroll logic if you want, but this does NOT block API if no errors
      return;
    }

    if (!cart?.items || cart.items.length === 0) {
      toast.error('Your cart is empty')
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

      const result = await createOrder(orderData).unwrap()

      if (paymentMethod === 'CashOnDelivery') {
        toast.success(`Order placed successfully!`)
        await refetch(); // <-- Force cart refresh after COD order
        navigate('/orders')
      } else if (paymentMethod === 'Stripe') {
        if (result.success && result.checkoutUrl) {
          // Store order info in localStorage for post-payment reference
          localStorage.setItem('pendingOrderId', result.orderId)
          localStorage.setItem('stripeSessionId', result.sessionId)

          // Optionally, refetch cart before redirecting to Stripe
          await refetch();

          // Redirect to Stripe hosted checkout page
          window.location.href = result.checkoutUrl
        } else {
          toast.error('No Stripe checkout URL received from server')
        }
      }

    } catch (error) {
      console.error('Order failed:', error)
      if (error.data) {
        toast.error(`Order failed: ${error.data.message || 'Unknown server error'}`)
      } else if (error.message) {
        toast.error(`Order failed: ${error.message}`)
      } else {
        toast.error('Failed to place order. Please try again.')
      }
    }
  }

  const cart = cartData?.data
  const totalPrice = cartData?.totalPrice || 0
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-6 h-6 border-2 border-black border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto'>
        <div className='bg-white'>



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
                          className={`w-full px-4 py-3 bg-gray-50 border ${missingFields.includes('firstName') ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-black transition-colors duration-300 font-light text-[16px]`}
                          value={billingDetails.firstName}
                          onChange={handleInputChange}
                          minLength={2}
                          maxLength={32}
                          required
                        />
                        {missingFields.includes('firstName') && <span className="text-xs text-red-500">First name is required</span>}
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
                          className={`w-full px-4 py-3 bg-gray-50 border ${missingFields.includes('lastName') ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-black transition-colors duration-300 font-light text-[16px]`}
                          value={billingDetails.lastName}
                          onChange={handleInputChange}
                          minLength={2}
                          maxLength={32}
                          required
                        />
                        {missingFields.includes('lastName') && <span className="text-xs text-red-500">Last name is required</span>}
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
                        className={`w-full px-4 py-3 bg-gray-50 border ${missingFields.includes('street') ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-black transition-colors duration-300 font-light text-[16px]`}
                        value={billingDetails.street}
                        onChange={handleInputChange}
                        minLength={2}
                        maxLength={64}
                        required
                      />
                      {missingFields.includes('street') && <span className="text-xs text-red-500">Street address is required</span>}
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
                        className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-black transition-colors duration-300 font-light text-[16px]`}
                        value={billingDetails.address}
                        onChange={handleInputChange}
                        maxLength={64}
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
                          className={`w-full px-4 py-3 bg-gray-50 border ${missingFields.includes('city') ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-black transition-colors duration-300 font-light text-[16px]`}
                          value={billingDetails.city}
                          onChange={handleInputChange}
                          minLength={2}
                          maxLength={32}
                          required
                        />
                        {missingFields.includes('city') && <span className="text-xs text-red-500">City is required</span>}
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
                          className={`w-full px-4 py-3 bg-gray-50 border ${missingFields.includes('state') ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-black transition-colors duration-300 font-light text-[16px]`}
                          value={billingDetails.state}
                          onChange={handleInputChange}
                          minLength={2}
                          maxLength={32}
                          required
                        />
                        {missingFields.includes('state') && <span className="text-xs text-red-500">State is required</span>}
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
                          className={`w-full px-4 py-3 bg-gray-50 border ${missingFields.includes('postalCode') ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-black transition-colors duration-300 font-light text-[16px]`}
                          value={billingDetails.postalCode}
                          onChange={handleInputChange}
                          pattern="^[0-9]{5,10}$"
                          minLength={5}
                          maxLength={10}
                          required
                        />
                        {missingFields.includes('postalCode') && <span className="text-xs text-red-500">Valid postal code is required</span>}
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
                        className={`w-full px-4 py-3 bg-gray-50 border ${missingFields.includes('phone') ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-black transition-colors duration-300 font-light text-[16px]`}
                        value={billingDetails.phone}
                        onChange={handleInputChange}
                        pattern="^[0-9]{10}$"
                        minLength={10}
                        maxLength={10}
                        required
                      />
                      {missingFields.includes('phone') && <span className="text-xs text-red-500">Valid phone number is required</span>}
                    </div>
                    <div className='mt-8'>
                      <button
                        type="submit"
                        className="w-full bg-black text-white font-medium py-4 hover:bg-gray-800 transition-colors duration-300 text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center">

<div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin duration-500"></div>
                          </span>
                        ) : paymentMethod === 'Stripe' ? (
                          'Proceed to Payment'
                        ) : (
                          <span className="flex items-center justify-center">
                            Place Order - ₹{totalPrice.toLocaleString()}
                          </span>
                        )}
                      </button>
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
                    <div className={`border-2 transition-all duration-300 cursor-pointer ${paymentMethod === 'CashOnDelivery'
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
                        <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center mr-4 ${paymentMethod === 'CashOnDelivery'
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
                    <div className={`border-2 transition-all duration-300 cursor-pointer ${paymentMethod === 'Stripe'
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
                        <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center mr-4 ${paymentMethod === 'Stripe'
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
                      className="w-full bg-black text-white font-medium py-4 hover:bg-gray-800 transition-colors duration-300 text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">

<div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin duration-500"></div>
                        </span>
                      ) : paymentMethod === 'Stripe' ? (
                        'Proceed to Payment'
                      ) : (
                        <span className="flex items-center justify-center">
                          Place Order - ₹{totalPrice.toLocaleString()}
                        </span>
                      )}
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
                        <div className="w-12 h-12 bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                          <img
                            src={
                              item.productId.image?.[0] ||
                              item.productId.img ||
                              '/noImg.jpg'
                            }
                            alt={item.productId.name}
                            className="w-full h-full object-cover object-center"
                            loading="lazy"
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