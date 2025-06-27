import React from 'react'
import { motion } from 'framer-motion'
import { NavLink, useNavigate } from 'react-router-dom'

const NewArrival = () => {
  const products = [
    { src: "/joggers.webp", alt: "Joggers", name: "Joggers", price: "$89" },
    { src: "/sweatshirt.jpg", alt: "Sweatshirt", name: "Sweatshirt", price: "$129" },
    { src: "/tshirt.jpg", alt: "T-shirt", name: "T-shirt", price: "$45" },
    { src: "/shirt.jpg", alt: "Shirt", name: "Shirt", price: "$75" }
  ]

  const navigate = useNavigate();

  const handleQuickView = (productName) => {
    navigate(`/product?category=${encodeURIComponent(productName)}`);
  };

  return (
    <section className="bg-white py-16 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-medium tracking-[0.3em] text-gray-500 uppercase mb-2">
            Latest Drops
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-black">
            New 
            <span className="block font-extralight text-gray-600">
              Arrivals
            </span>
          </h2>
        </motion.div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative bg-white border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden aspect-square">
                <img 
                  src={product.src} 
                  alt={product.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-all duration-300"></div>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    className="bg-white text-black px-4 py-2 text-sm font-medium tracking-wide hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => handleQuickView(product.name)}
                  >
                    QUICK VIEW
                  </button>
                </div>

                {/* New Badge */}
                <div className="absolute top-3 left-3 bg-black text-white px-2 py-1 text-xs font-medium tracking-wide">
                  NEW
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 space-y-2">
                <h3 className="text-base font-light text-black tracking-wide uppercase">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 font-light">
                  {product.price}
                </p>
              </div>

              {/* Geometric Accent */}
              <div className="absolute top-3 right-3 w-6 h-6 border border-gray-300 opacity-50"></div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12 pt-8 border-t border-gray-200"
        >
          <p className="text-gray-600 font-light mb-6 max-w-xl mx-auto">
            Discover our latest pieces crafted with precision and attention to detail
          </p>
   
        </motion.div>

      </div>
    </section>
  )
}

export default NewArrival