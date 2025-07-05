import React from 'react'
import { motion } from 'framer-motion'

const Limelight = () => {
  const categories = [
    {
      id: 1,
      name: "Sequined Dresses",
      image: "/sequined-dresses.jpg",
      description: "Sparkle and shine"
    },
    {
      id: 2,
      name: "Oversized Tees",
      image: "/oversized-tees.jpg",
      description: "Comfort meets style"
    },
    {
      id: 3,
      name: "Cargo Pants with Edge",
      image: "/cargo-pants.jpg",
      description: "Urban streetwear"
    },
    {
      id: 4,
      name: "Partywear",
      image: "/partywear.jpg",
      description: "Ready to celebrate"
    }
  ]

  return (
    <section className="bg-white py-16 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-medium tracking-[0.3em] text-gray-500 uppercase mb-2">
            Trending Now
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-black">
            In The 
            <span className="block font-extralight text-gray-600">
              Limelight
            </span>
          </h2>
          <p className="text-gray-600 font-light mt-4 max-w-2xl mx-auto">
            Spotlight pieces that define this season's fashion narrative
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
              className="group relative bg-white border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              {/* Category Image */}
              <motion.div
                initial={{ scale: 0.96, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.15 }}
                className="relative aspect-[3/4] overflow-hidden"
              >
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: 0.45 + index * 0.15 }}
                  className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300"
                ></motion.div>
                {/* Trending Badge */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: 0.65 + index * 0.15 }}
                  className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-xs font-medium tracking-wide"
                >
                  TRENDING
                </motion.div>
              </motion.div>
              {/* Category Info */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.15 }}
                className="p-6 space-y-2"
              >
                <h3 className="text-lg font-light text-black tracking-wide">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600 font-light">
                  {category.description}
                </p>
              
              </motion.div>
            </motion.div>
          ))}
        </div>


      </div>
    </section>
  )
}

export default Limelight