import React from 'react'

const FaishonCard = () => {
  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1 */}
        <div
          className="relative w-full h-80 bg-cover bg-center bg-no-repeat rounded-xl overflow-hidden bg-gradient-to-r from-yellow-600 to-yellow-400"
          style={{ backgroundImage: 'url(/Card1.png)', backgroundColor: '#ca8a04' }}
        >
          <div className="relative z-10 flex items-start justify-start h-full p-8">
            <div className="text-left text-black max-w-xs">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Low Price</h2>
              <h3 className="text-xl md:text-2xl font-semibold mb-3">High Coziness</h3>
              <p className="text-lg font-medium mb-4">Up to 50% Off</p>
              <button className="text-white font-semibold underline hover:no-underline transition-all">
                Explore Items
              </button>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div
          className="relative w-full h-80 bg-cover bg-center bg-no-repeat rounded-xl overflow-hidden"
          style={{ backgroundImage: 'url(/Card2.png)', backgroundColor: '#9333ea' }}
        >
          <div className="relative z-10 flex items-start justify-start h-full p-8">
            <div className="text-left text-white max-w-xs">
              <h2 className="text-xl md:text-2xl font-bold mb-2">Beyoung Presents</h2>
              <h3 className="text-2xl md:text-3xl font-semibold mb-3">Breezy Summer Style</h3>
              <p className="text-lg font-medium mb-4">Up to 50% Off</p>
              <button className="text-white font-semibold underline hover:no-underline transition-all">
                Explore Items
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FaishonCard