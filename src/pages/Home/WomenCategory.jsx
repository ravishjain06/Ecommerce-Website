import React from 'react'

const WomenCategory = () => {
  const categories = [
    {
      id: 1,
      name: "Tops & T-Shirts",
      image: "/tops-tshirts.jpg",
      description: "Stylish tops for every occasion"
    },
    {
      id: 2,
      name: "Jeans & Trousers",
      image: "/jeans-trousers.jpg",
      description: "Comfortable and trendy bottoms"
    },
     {
      id: 3,
      name: "Kurtis & Kurtas",
      image: "/kurtis-kurtas.jpg",
      description: "Perfect for warm weather"
    },
    {
      id: 4,
      name: "Dresses & Jumpsuits",
      image: "/dresses-jumpsuits.jpg",
      description: "Elegant one-piece outfits"
    }
  ]

  return (
    <div className="p-4 md:p-8">
      {/* Heading */}
      <div className="text-left mb-6 md:mb-8 border-l-4 pl-4" style={{ borderColor: '#8A33FD' }}>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
          Women's Categories
        </h2>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 px-4 md:px-8">
        {categories.map(category => (
          <div key={category.id} className="text-center">
            <div className="relative rounded-xl overflow-hidden mb-3 md:mb-4 mx-auto aspect-[3/4] w-full max-w-[282px]">
              <img 
                src={category.image} 
                alt={category.name}
                className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="text-sm md:text-lg font-semibold text-gray-800 mb-1">{category.name}</h3>
            <p className="text-xs md:text-sm text-gray-600">{category.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WomenCategory