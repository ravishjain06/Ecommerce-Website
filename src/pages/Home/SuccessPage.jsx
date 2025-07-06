import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const getSessionIdFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('session_id');
};

const SuccessPage = () => {
  const [status, setStatus] = useState('loading');
  const navigate = useNavigate();

  useEffect(() => {
    const sessionId = getSessionIdFromUrl();
    if (!sessionId) {
      setStatus('error');
      return;
    }
    const baseUrl = import.meta.env.VITE_BASE_URL;
    fetch(`${baseUrl}/api/v1/order/verify-payment?session_id=${sessionId}`)
      .then(res => res.json())
      .then(data => {
        if (
          data.success &&
          ((data.stripePaymentStatus && data.stripePaymentStatus.toLowerCase() === "paid") ||
           (data.orderPaymentStatus && data.orderPaymentStatus.toLowerCase() === "paid") ||
           (data.paymentStatus && data.paymentStatus.toLowerCase() === "paid") ||
           (data.order && data.order.paymentStatus && data.order.paymentStatus.toLowerCase() === "paid")) &&
          ((data.orderStatus && ["processing", "paid"].includes(data.orderStatus.toLowerCase())) ||
           (data.order && data.order.orderStatus && ["processing", "paid"].includes(data.order.orderStatus.toLowerCase())))
        ) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [navigate]);

  if (status === 'loading') {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center max-w-md mx-auto p-8'>
          <div className="mb-6">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          </div>
          <h3 className="text-xl font-light text-black mb-2 tracking-wide">Verifying payment...</h3>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center max-w-md mx-auto p-8'>
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto bg-gray-100 border border-gray-300 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-light text-black mb-2 tracking-wide">Payment Failed</h3>
          <p className='text-gray-600 font-light mb-6'>We could not verify your payment. Please try again or contact support.</p>
          <NavLink to="/cart">
            <button className='bg-black text-white font-medium px-8 py-3 hover:bg-gray-800 transition-colors text-sm tracking-wide'>
              RETURN TO CART
            </button>
          </NavLink>
        </div>
      </div>
    );
  }

  // Success UI
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
  );
};

export default SuccessPage;