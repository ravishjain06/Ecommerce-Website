import React from 'react'

const TopBrand = () => {
  const brands = [
    {
      id: 1,
      name: "Nike",
      logo: "/nike-logo.jpg"
    },
    {
      id: 2,
      name: "Adidas",
      logo: "/adidas-logo.jpg"
    },
    {
      id: 3,
      name: "Puma",
      logo: "/puma-logo.jpg"
    },
    {
      id: 4,
      name: "Zara",
      logo: "/zara-logo.jpg"
    },
    {
      id: 5,
      name: "H&M",
      logo: "/hm-logo.jpg"
    },
  ]

  return (
    <div className="py-8 px-4 md:px-8 min-h-[300px] bg-gradient-to-b from-gray-900 to-black">
     
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
          Top Brand Deal
        </h2>
   
        <p className="text-yellow-400 text-lg md:text-xl font-semibold">
          Up To 60% Off On Brands
        </p>
      </div>

      {/* Brands Grid */}
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 justify-items-center">
          {brands.map(brand => (
            <div 
              key={brand.id} 
              className="flex items-center justify-center p-4 md:p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-100 hover:border-gray-200 w-full max-w-[150px]"
            >
              <img 
                src={brand.logo} 
                alt={brand.name}
                className="h-12 md:h-16 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TopBrand