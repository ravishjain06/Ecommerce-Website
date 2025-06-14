import React from 'react'

const Poster = () => {
  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Div with Background Image */}
        <div 
          className="relative w-full h-[600px] bg-cover bg-center bg-no-repeat rounded-xl overflow-hidden"
          style={{ backgroundImage: 'url(/tree.png)' }}
        >
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center text-white px-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Special Collection</h2>
              <p className="text-sm md:text-base mb-4 opacity-90">Discover our latest trends</p>
              <button className="bg-white text-black px-6 py-2 rounded-md font-semibold hover:bg-gray-100 transition-colors">
                Shop Now
              </button>
            </div>
          </div>
        </div>

        {/* Second Div with Regular Image */}
        <div className="relative rounded-xl overflow-hidden">
          <img 
            src="/poster.jpg" 
            alt="Poster"
            className="w-full h-[600px] object-cover hover:scale-105 transition-transform duration-300 rounded-xl"
          />
        </div>
      </div>
    </div>
  )
}

export default Poster