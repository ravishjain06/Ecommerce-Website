import React from 'react'

const NewArrival = () => {
  return (
    <div className="p-8">
      {/* Heading */}
      <div className="text-left mb-8 border-l-4 pl-4" style={{ borderColor: '#8A33FD' }}>
        <h3 className="text-3xl md:text-3xl font-bold text-gray-800 mb-2">
          New Arrival
        </h3>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* Joggers */}
        <div className="text-left">
          <div className="relative rounded-xl overflow-hidden mb-4">
            <img 
              src="/joggers.webp" 
              alt="Joggers"
              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Joggers</h3>
        </div>

        {/* Sweatshirt */}
        <div className="text-left">
          <div className="relative rounded-xl overflow-hidden mb-4">
            <img 
              src="/sweatshirt.jpg" 
              alt="Sweatshirt"
              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Sweatshirt</h3>
        </div>

        {/* T-shirt */}
        <div className="text-left">
          <div className="relative rounded-xl overflow-hidden mb-4">
            <img 
              src="/tshirt.jpg" 
              alt="T-shirt"
              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">T-shirt</h3>
        </div>

        {/* Shirt */}
        <div className="text-left">
          <div className="relative rounded-xl overflow-hidden mb-4">
            <img 
              src="/shirt.jpg" 
              alt="Shirt"
              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Shirt</h3>
        </div>
      </div>
    </div>
  )
}

export default NewArrival