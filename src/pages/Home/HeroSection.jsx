import React, { useState, useEffect } from 'react';
import "../../App.css"
const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const backgroundImages = [
    '/bg1.jpg',
    '/bg2.jpg', 
    '/bg3.jpg'
  ];

  const heroContent = [
    {
      title: "Discover Amazing Products",
      subtitle: "Shop the latest trends with unbeatable prices",
      cta: "Shop Now"
    },
    {
      title: "Premium Quality Guaranteed",
      subtitle: "Experience excellence in every purchase",
      cta: "Explore"
    },
    {
      title: "Fast & Free Delivery",
      subtitle: "Get your orders delivered right to your door",
      cta: "Order Now"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Faster transition

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Images */}
      {backgroundImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url(${image})` }}
        />
      ))}
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-start h-full px-8 lg:px-16">
        <div className="max-w-2xl text-white">
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight animate-fadeInUp">
            {heroContent[currentImageIndex].title}
          </h1>
          <p className="text-xl lg:text-2xl mb-8 opacity-90 animate-fadeInUp animation-delay-200">
            {heroContent[currentImageIndex].subtitle}
          </p>
          <div className="flex gap-4 animate-fadeInUp animation-delay-400">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
              {heroContent[currentImageIndex].cta}
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-black transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => setCurrentImageIndex(currentImageIndex === 0 ? backgroundImages.length - 1 : currentImageIndex - 1)}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={() => setCurrentImageIndex(currentImageIndex === backgroundImages.length - 1 ? 0 : currentImageIndex + 1)}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Modern Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className="group relative"
          >
            <div className={`w-12 h-1 rounded-full transition-all duration-300 ${
              index === currentImageIndex 
                ? 'bg-white shadow-lg' 
                : 'bg-white/40 hover:bg-white/60'
            }`} />
            {index === currentImageIndex && (
              <div className="absolute inset-0 w-12 h-1 bg-blue-500 rounded-full animate-pulse" />
            )}
          </button>
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 text-white animate-bounce">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;