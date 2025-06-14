import React, { useState, useEffect } from 'react';

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const backgroundImages = [
    '/bg1.jpg',
    '/bg2.jpg', 
    '/bg3.jpg'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000); // Change every 10 seconds

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <div className="p-8">
      <div
        className="relative w-full bg-cover bg-center bg-no-repeat rounded-xl overflow-hidden transition-all duration-1000 ease-in-out"
        style={{ 
          backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
          height: 'calc(100vh - 120px)' // More space from top and bottom
        }}
      >
        {/* Dark overlay */}
       
       

        {/* Carousel indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;