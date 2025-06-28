import React from 'react'
import { NavLink } from 'react-router-dom';

const SuccessPage = () => {
  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
      <div className='text-center max-w-md mx-auto p-8'>
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto bg-gray-100 border border-gray-300 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>

          </div>
        </div>
        <h3 className="text-xl font-light text-black mb-2 tracking-wide">
          Order Successful!
        </h3>
        <p className='text-gray-600 font-light mb-6'>
          Thank you for your purchase. Your order has been placed successfully and is being processed.
        </p>
        <NavLink to="/product">
          <button className='bg-black text-white font-medium px-8 py-3 hover:bg-gray-800 transition-colors text-sm tracking-wide '>
            CONTINUE SHOPPING
          </button>
        </NavLink>
      </div>
    </div>
  )
}

export default SuccessPage