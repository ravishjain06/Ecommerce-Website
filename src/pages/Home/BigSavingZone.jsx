import React from 'react'
import { motion } from 'framer-motion'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'

const BigSavingZone = () => {
    const deals = [
        {
            src: "/saving1.jpg",
            alt: "Premium Collection Sale",
            title: "Premium Collection",
            discount: "UP TO 40% OFF",
            description: "Luxury pieces at unbeatable prices"
        },
        {
            src: "/saving2.jpg", 
            alt: "Summer Essentials",
            title: "Summer Essentials",
            discount: "BUY 2 GET 1 FREE",
            description: "Perfect for the season ahead"
        },
        {
            src: "/saving3.jpg",
            alt: "New Arrivals Sale", 
            title: "New Arrivals",
            discount: "25% OFF",
            description: "Latest styles now on sale"
        },
        {
            src: "/saving4.jpg",
            alt: "Clearance Sale",
            title: "Final Clearance",
            discount: "UP TO 60% OFF", 
            description: "Last chance for these styles"
        },
        {
            src: "/saving5.jpg",
            alt: "Flash Sale",
            title: "Flash Sale",
            discount: "LIMITED TIME",
            description: "Exclusive 48-hour deals"
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
                        Limited Time Offers
                    </p>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-black">
                        Big Saving 
                        <span className="block font-extralight text-gray-600">
                            Zone
                        </span>
                    </h2>
                </motion.div>

                {/* First Row - 3 Deal Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {deals.slice(0, 3).map((deal, index) => (
                        <motion.div
                            key={deal.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="group relative bg-white border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <LazyLoadImage
                                    src={deal.src}
                                    alt={deal.alt}
                                    effect="blur"
                                    width="100%"
                                    height="256"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/30"></div>
                                
                                {/* Deal Content */}
                                <div className="absolute inset-0 flex items-end p-6">
                                    <div className="text-white space-y-2">
                                        <div className="bg-black px-3 py-1 text-xs font-semibold tracking-wide inline-block">
                                            {deal.discount}
                                        </div>
                                        <h3 className="text-xl font-light">
                                            {deal.title}
                                        </h3>
                                        <p className="text-sm text-gray-200 font-light">
                                            {deal.description}
                                        </p>
                                        <button className="inline-flex items-center text-white text-sm tracking-wide border-b border-white/40 pb-1 hover:border-white transition-all duration-300 mt-2">
                                            SHOP NOW
                                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Geometric Accent */}
                                <div className="absolute top-4 right-4 w-8 h-8 border border-white/30"></div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Second Row - 2 Larger Deal Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {deals.slice(3, 5).map((deal, index) => (
                        <motion.div
                            key={deal.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: (index + 3) * 0.1 }}
                            className="group relative bg-white border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                        >
                            <div className="relative h-80 overflow-hidden">
                                <LazyLoadImage
                                    src={deal.src}
                                    alt={deal.alt}
                                    effect="blur"
                                    width="100%"
                                    height="320"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/30"></div>
                                
                                {/* Deal Content */}
                                <div className="absolute inset-0 flex items-end p-8">
                                    <div className="text-white space-y-3">
                                        <div className="bg-black px-4 py-2 text-sm font-semibold tracking-wide inline-block">
                                            {deal.discount}
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-light">
                                            {deal.title}
                                        </h3>
                                        <p className="text-base text-gray-200 font-light max-w-sm">
                                            {deal.description}
                                        </p>
                                        <button className="inline-flex items-center bg-white text-black px-6 py-3 font-medium text-sm tracking-wide hover:bg-gray-100 transition-all duration-300 mt-4">
                                            SHOP NOW
                                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Geometric Accent */}
                                <div className="absolute top-6 right-6 w-12 h-12 border border-white/30"></div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-center mt-16 pt-12 border-t border-gray-200"
                >
                    <p className="text-gray-600 font-light mb-6 max-w-2xl mx-auto">
                        Don't miss out on these incredible deals. Limited time offers on premium fashion pieces.
                    </p>
                    <button className="bg-black text-white font-medium px-8 py-3 hover:bg-gray-800 transition-all duration-300 text-sm tracking-wide">
                        VIEW ALL DEALS
                    </button>
                </motion.div>

            </div>
        </section>
    )
}

export default BigSavingZone