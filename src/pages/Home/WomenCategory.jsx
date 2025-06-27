import React from 'react'
import { motion } from 'framer-motion'

const WomenCategory = () => {
  const categories = [
    {
      id: 1,
      name: "Tops & T-Shirts",
      image: "/tops-tshirts.jpg",
      description: "Stylish tops for every occasion",
      items: "200+ Items"
    },
    {
      id: 2,
      name: "Jeans & Trousers",
      image: "/jeans-trousers.jpg",
      description: "Comfortable and trendy bottoms",
      items: "120+ Items"
    },
    {
      id: 3,
      name: "Kurtis & Kurtas",
      image: "/kurtis-kurtas.jpg",
      description: "Perfect for warm weather",
      items: "95+ Items"
    },
    {
      id: 4,
      name: "Dresses & Jumpsuits",
      image: "/dresses-jumpsuits.jpg",
      description: "Elegant one-piece outfits",
      items: "180+ Items"
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
            Shop by Category
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-black">
            Women's 
            <span className="block font-extralight text-gray-600">
              Collection
            </span>
          </h2>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative bg-white border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              {/* Category Image */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300"></div>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="bg-white text-black px-6 py-3 text-sm font-medium tracking-wide hover:bg-gray-100 transition-colors duration-200">
                    BROWSE CATEGORY
                  </button>
                </div>

                {/* Item Count Badge */}
                <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 text-xs font-medium tracking-wide">
                  {category.items}
                </div>

                {/* Wishlist Icon */}
                <button className="absolute top-4 left-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110">
                  <svg className="w-4 h-4 text-gray-700 hover:text-red-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              {/* Category Info */}
              <div className="p-6 space-y-2">
                <h3 className="text-lg font-light text-black tracking-wide">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600 font-light">
                  {category.description}
                </p>
                
                {/* View Link */}
                <div className="pt-3">
                  <span className="inline-flex items-center text-black text-sm tracking-wide border-b border-gray-300 pb-1 hover:border-black transition-all duration-300 cursor-pointer">
                    VIEW ALL
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Geometric Accent */}
              <div className="absolute bottom-4 right-4 w-6 h-6 border border-gray-300 opacity-50 rotate-45"></div>
            </motion.div>
          ))}
        </div>

        {/* Featured Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 bg-white border border-gray-200 rounded-lg overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-medium tracking-[0.3em] text-gray-500 uppercase mb-2">
                    Exclusive Collection
                  </p>
                  <h3 className="text-2xl md:text-3xl font-light text-black">
                    Feminine 
                    <span className="block font-extralight text-gray-600">
                      Elegance
                    </span>
                  </h3>
                </div>
                <p className="text-gray-600 font-light max-w-md">
                  Discover our curated selection of sophisticated pieces designed for the modern woman who values both style and comfort.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="bg-black text-white font-medium px-6 py-3 hover:bg-gray-800 transition-all duration-300 text-sm tracking-wide">
                    EXPLORE COLLECTION
                  </button>
                  <button className="border border-gray-300 text-gray-700 font-medium px-6 py-3 hover:bg-gray-50 transition-all duration-300 text-sm tracking-wide">
                    STYLE GUIDE
                  </button>
                </div>
              </div>
            </div>
            <div className="relative h-64 lg:h-auto">
              <img 
                src="/women-banner.jpg" 
                alt="Women's Collection" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/5"></div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-center mt-16 pt-12 border-t border-gray-200"
        >
          <p className="text-gray-600 font-light mb-6 max-w-2xl mx-auto">
            From casual everyday wear to elegant evening pieces, find everything you need to express your unique style
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-black text-white font-medium px-8 py-3 hover:bg-gray-800 transition-all duration-300 text-sm tracking-wide">
              VIEW ALL CATEGORIES
            </button>
            <button className="border border-gray-300 text-gray-700 font-medium px-8 py-3 hover:bg-gray-50 transition-all duration-300 text-sm tracking-wide">
              SIZE CHART
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

export default WomenCategory