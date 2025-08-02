import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const FashionCard = () => {
  const navigate = useNavigate();

  const handleDiscoverMore = () => {
    navigate('/product', {
      state: {
        mainCategory: ['Hoodies & Sweatshirts']
      }
    });
  };

  return (
    <section className="bg-gray-50 py-16 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="text-xs font-medium tracking-[0.3em] text-gray-500 uppercase mb-2">
            Trending Now
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-black">
            Style
            <span className="block font-extralight text-gray-600">
              Collections
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Card 1 - Premium Collection */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="group relative bg-white border border-gray-200 overflow-hidden"
          >
            <div className="relative h-96 overflow-hidden">
              <img
                src="/Card1.png"
                alt="Premium Collection"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20"></div>
            </div>

            <div className="absolute inset-0 flex items-end p-8">
              <div className="text-white space-y-3">
                <div className="space-y-1">
                  <p className="text-xs tracking-[0.2em] uppercase opacity-80">
                    Premium Collection
                  </p>
                  <h3 className="text-2xl md:text-3xl font-light">
                    Minimalist
                    <span className="block font-extralight">
                      Comfort
                    </span>
                  </h3>
                </div>
                <p className="text-sm opacity-90 font-light">
                  Carefully crafted pieces for everyday elegance
                </p>
                <button
                  className="inline-flex items-center text-white text-sm tracking-wide border-b border-white/40 pb-1 hover:border-white transition-all duration-300 cursor-pointer"
                  onClick={handleDiscoverMore}
                >
                  DISCOVER MORE
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>


          </motion.div>

          {/* Card 2 - Seasonal Collection */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="group relative  overflow-hidden"
          >
            <div className="relative  h-96 overflow-hidden group">
              <img
                src="/Card2.png"
                alt="Seasonal Collection"
                className="w-full h-full object-cover object-[center_30%] transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40"></div>
            </div>

            <div className="absolute inset-0 flex items-end p-8">
              <div className="text-white space-y-3">
                <div className="space-y-1">
                  <p className="text-xs tracking-[0.2em] uppercase opacity-80">
                    New Season
                  </p>
                  <h3 className="text-2xl md:text-3xl font-light">
                    Contemporary
                    <span className="block font-extralight">
                      Classics
                    </span>
                  </h3>
                </div>
                <p className="text-sm opacity-90 font-light">
                  Timeless designs with modern sensibility
                </p>
                <button
                  className="inline-flex items-center text-white text-sm tracking-wide border-b border-white/40 pb-1 hover:border-white transition-all duration-300 cursor-pointer"
                  onClick={() => navigate('/product', {
                    state: {
                      mainCategory: ['T-Shirts']
                    }
                  })}
                >
                  VIEW COLLECTION
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>


          </motion.div>

        </div>


      </div>
    </section>
  )
}

export default FashionCard