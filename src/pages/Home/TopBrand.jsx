import React from 'react'
import { motion } from 'framer-motion'

const TopBrand = () => {
  const brands = [
    {
      id: 1,
      name: "Nike",
      logo: "/nike-logo.jpg",
      description: "Just Do It"
    },
    {
      id: 2,
      name: "Adidas",
      logo: "/adidas-logo.jpg",
      description: "Impossible is Nothing"
    },
    {
      id: 3,
      name: "Puma",
      logo: "/puma-logo.jpg",
      description: "Forever Faster"
    },
    {
      id: 4,
      name: "Zara",
      logo: "/zara-logo.jpg",
      description: "Love Your Curves"
    },
    {
      id: 5,
      name: "H&M",
      logo: "/hm-logo.jpg",
      description: "Fashion and Quality"
    },
    {
      id: 6,
      name: "Uniqlo",
      logo: "/uniqlo-logo.jpg",
      description: "LifeWear"
    }
  ]

  return (
    <section className="bg-gray-50 py-16 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-medium tracking-[0.3em] text-gray-500 uppercase mb-2">
            Premium Partners
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-black">
            Top Brand 
            <span className="block font-extralight text-gray-600">
              Collection
            </span>
          </h2>
          <p className="text-gray-600 font-light mt-4 max-w-2xl mx-auto">
            Discover exclusive pieces from the world's most prestigious fashion brands
          </p>
        </motion.div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative bg-white border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              {/* Brand Logo Container */}
              <div className="relative aspect-square p-8 flex items-center justify-center">
                <img 
                  src={brand.logo} 
                  alt={brand.name}
                  className="h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300"></div>
              </div>

              {/* Brand Info */}
              <div className="p-4 border-t border-gray-100">
                <h3 className="text-sm font-medium text-black tracking-wide uppercase text-center">
                  {brand.name}
                </h3>
                <p className="text-xs text-gray-500 text-center mt-1 font-light">
                  {brand.description}
                </p>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/10">
                <span className="bg-black text-white px-4 py-2 text-xs font-medium tracking-wide">
                  SHOP {brand.name.toUpperCase()}
                </span>
              </div>

              {/* Geometric Accent */}
              <div className="absolute top-2 right-2 w-4 h-4 border border-gray-300 opacity-30"></div>
            </motion.div>
          ))}
        </div>

        {/* Featured Deal Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="bg-white border border-gray-200 rounded-lg overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="space-y-6">
                <div>
                  <span className="bg-black text-white px-3 py-1 text-xs font-semibold tracking-wide">
                    LIMITED TIME OFFER
                  </span>
                  <h3 className="text-2xl md:text-3xl font-light text-black mt-4">
                    Brand 
                    <span className="block font-extralight text-gray-600">
                      Partnerships
                    </span>
                  </h3>
                </div>
                <p className="text-gray-600 font-light max-w-md">
                  Get exclusive access to premium collections from our partner brands with special member pricing and early access to new releases.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="bg-black text-white font-medium px-6 py-3 hover:bg-gray-800 transition-all duration-300 text-sm tracking-wide">
                    EXPLORE BRANDS
                  </button>
                  <button className="border border-gray-300 text-gray-700 font-medium px-6 py-3 hover:bg-gray-50 transition-all duration-300 text-sm tracking-wide">
                    MEMBER BENEFITS
                  </button>
                </div>
              </div>
            </div>
            <div className="relative h-64 lg:h-auto">
              <img 
                src="/brand-partnership.jpg" 
                alt="Brand Partnership" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/5"></div>
            </div>
          </div>
        </motion.div>

        {/* Brand Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-12 border-t border-gray-200"
        >
          {[
            { number: "50+", label: "Premium Brands" },
            { number: "10K+", label: "Products Available" },
            { number: "95%", label: "Customer Satisfaction" },
            { number: "24/7", label: "Brand Support" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl md:text-3xl font-light text-black">
                {stat.number}
              </div>
              <div className="text-sm text-gray-600 font-light mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}

export default TopBrand