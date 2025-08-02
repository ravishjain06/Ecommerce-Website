import React, { useEffect } from 'react'
import { useGetWishlistQuery } from '../../APIs/product'
import { NavLink } from 'react-router-dom'
import { HeartIcon } from 'lucide-react'

const Whishlist = () => {
  const { data, isLoading, isError } = useGetWishlistQuery()
  const wishlist = data?.wishlist || []
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [wishlist]);

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
       <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-6 h-6 border-2 border-black border-t-transparent animate-spin"></div>
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
              <HeartIcon className="w-8 h-8 text-gray-600" />
            </div>
          </div>
          <h3 className="text-xl font-light text-black mb-2 tracking-wide">Error loading wishlist</h3>
          <p className='text-gray-600 font-light mb-6'>Unable to load your wishlist right now</p>
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

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <div className='max-w-7xl mx-auto'>
          <div className='bg-white'>
            <div className='p-4 md:p-6 lg:p-8'>
              <div className='mb-16'>
                <p className="text-xs font-medium tracking-[0.3em] text-gray-500 uppercase mb-2">Wishlist</p>
                <h1 className='text-3xl md:text-4xl lg:text-5xl font-light text-black mb-4'>
                  My<span className="block font-extralight text-gray-600">Wishlist</span>
                </h1>
                  <p className="text-gray-600 font-light mb-6 max-w-2xl">
                Review your selected items and proceed to checkout when ready
              </p>
              </div>
              <div className='text-center py-16'>
                <div className="mb-6">
                  <div className="w-16 h-16 mx-auto bg-gray-100 border border-gray-300 flex items-center justify-center">
                    <HeartIcon className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-xl font-light text-black mb-2 tracking-wide">No wishlist items found</h3>
                <p className='text-gray-600 font-light mb-6'>You haven't added any products to your wishlist yet</p>
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
          <div className='p-4 md:p-6 lg:p-8'>
            <div className='mb-16'>
              <p className="text-xs font-medium tracking-[0.3em] text-gray-500 uppercase mb-2">Wishlist</p>
              <h1 className='text-3xl md:text-4xl lg:text-5xl font-light text-black mb-4'>
                My<span className="block font-extralight text-gray-600">Wishlist</span>
              </h1>
              <p className="text-gray-600 font-light mb-6 max-w-2xl">
                  View and manage your favorite products. Add or remove items from your wishlist and easily shop them anytime.
                </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {wishlist.map(product => (
                <div
                  key={product?._id}
                  className="group relative bg-white border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col h-full"
                >
                  {/* Product Image - Fixed aspect ratio */}
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img 
                      src={product?.image?.[0]} 
                      alt={product?.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => { e.target.src = '/public/jackets.jpg'; }}
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300"></div>
                    {/* Discount Badge */}
                    {product?.discount && (
                      <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-xs font-medium tracking-wide">
                        {product.discount}% OFF
                      </div>
                    )}
                  </div>
                  {/* Product Info - Flex grow to fill remaining space */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex-grow">
                      <NavLink to={`/product/${product?._id}`}>
                        <h3 className="text-lg font-light text-black tracking-wide hover:text-gray-600 transition-colors line-clamp-2 mb-2">
                          {product?.name}
                        </h3>
                      </NavLink>
                      <p className="text-sm text-gray-600 font-light uppercase tracking-wide mb-1">
                        {product?.category}
                      </p>
                      <p className="text-xs text-gray-500 font-light uppercase tracking-wide mb-3">
                        {product?.brandName}
                      </p>
                    </div>
                    {/* Price and Shop Link - Always at bottom */}
                    <div className="flex justify-between items-end mt-auto">
                      <div>
                        <span className="text-lg font-light text-black">₹{product?.price}</span>
                        {product?.originalPrice && (
                          <div className="text-sm text-gray-500 line-through font-light">₹{product?.originalPrice}</div>
                        )}
                      </div>
                      <NavLink to={`/product/${product?._id}`} className="hidden md:block">
                        <span className="inline-flex items-center text-black text-sm tracking-wide border-b border-gray-300 pb-1 hover:border-black transition-all duration-300 cursor-pointer">
                          SHOP NOW
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </span>
                      </NavLink>
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

export default Whishlist