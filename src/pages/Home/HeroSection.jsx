import React, { useEffect, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { NavLink } from 'react-router-dom'

// AnimatedNumber with smooth counting effect
const AnimatedNumber = ({ value, duration = 1.2, ...props }) => {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    let start = 0
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      setDisplay(Math.floor(progress * (value - start) + start))
      if (progress < 1) {
        requestAnimationFrame(step)
      } else {
        setDisplay(value)
      }
    }
    requestAnimationFrame(step)
    // Cleanup
    return () => setDisplay(value)
  }, [value, duration])

  return (
    <span {...props}>{display.toLocaleString()}</span>
  )
}

const HeroSection = () => {
  return (
    <section className="min-h-screen bg-white flex items-center px-4 lg:px-8 overflow-hidden relative">
      {/* Subtle Background Pattern */}
      <div className={`absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg%20width='60'%20height='60'%20viewBox='0%200%2060%2060'%20xmlns='http://www.w3.org/2000/svg'%3E%3Cg%20fill='none'%20fill-rule='evenodd'%3E%3Cg%20fill='%23000000'%20fill-opacity='0.02'%3E%3Ccircle%20cx='30'%20cy='30'%20r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-40`}></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full relative z-10">
        {/* Right Side - Minimal Image Composition (MOBILE FIRST) */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative h-[400px] md:h-[500px] lg:h-[600px] order-1 lg:order-none"
        >
          {/* Main Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute inset-0 overflow-hidden group"
          >
            <img
              src="./143c9cf90e1f4e72b7a1fb8ddae0662a.jpg"
              alt="Premium fashion collection"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 "
            />
            <div className="absolute inset-0 bg-black/10"></div>
          </motion.div>

          {/* Minimal Floating Elements */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm p-4 border border-gray-200"
          >
            <p className="text-black font-medium text-sm">NEW ARRIVAL</p>
            <p className="text-gray-600 text-xs tracking-wide">ESSENTIAL SERIES</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="absolute top-6 right-6 bg-black text-white p-3"
          >
            <p className="font-medium text-sm">30% OFF</p>
            <p className="text-xs opacity-80">LIMITED</p>
          </motion.div>

          {/* Geometric Accent */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
            className="absolute -top-4 -left-4 w-12 h-12 md:w-20 md:h-20 border border-gray-300"
          ></motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1.6 }}
            className="absolute -bottom-4 -right-4 w-10 h-10 md:w-16 md:h-16 bg-gray-900"
          ></motion.div>
        </motion.div>

        {/* Left Side - Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-gray-900 space-y-8 text-center lg:text-left max-w-2xl mx-auto lg:mx-0 order-2 lg:order-none"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <p className="text-xs font-medium tracking-[0.3em] text-gray-500 uppercase">
              Premium Collection
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.1] tracking-tight text-black">
              Refined
              <span className="block font-extralight text-gray-600">
                Minimalism
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-base md:text-lg leading-relaxed text-gray-600 font-light max-w-md"
          >
            Thoughtfully designed pieces that embody sophistication and timeless elegance. Where quality craftsmanship meets contemporary aesthetics.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 pt-6"
          >
            <NavLink to={"/product"}>
              <button className="bg-black cursor-pointer text-white font-medium px-8 py-3 hover:bg-gray-800 transition-all duration-300 text-sm tracking-wide">
                VIEW COLLECTION
              </button>
            </NavLink>

          </motion.div>

          {/* Minimal Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex gap-8 pt-8 pb-6 border-t border-gray-200"
          >
            <div>
              <p className="text-xl font-light text-black">
                <AnimatedNumber value={500} duration={1.2} />+
              </p>
              <p className="text-xs text-gray-500 tracking-wide">ITEMS</p>
            </div>
            <div>
              <p className="text-xl font-light text-black">
                <AnimatedNumber value={50000} duration={1.5} />+
              </p>
              <p className="text-xs text-gray-500 tracking-wide">CUSTOMERS</p>
            </div>
            <div>
              <p className="text-xl font-light text-black">
                <AnimatedNumber value={95} duration={1.8} />%
              </p>
              <p className="text-xs text-gray-500 tracking-wide">SATISFACTION</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection
