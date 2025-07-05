import React, { useState, useEffect } from 'react'
import { ChevronDownIcon, ChevronUpIcon, XIcon, Search } from 'lucide-react'

const Filter = ({ 
  isMobile = false, 
  isOpen = false, 
  onClose = () => {}, 
  onFiltersApply = () => {},
  onClearFilters = () => {},
  appliedFilters = {}
}) => {
  const [openSections, setOpenSections] = useState({
    mainCategory: true,
    price: true,
    brand: true
  })

  const [selectedFilters, setSelectedFilters] = useState({
    mainCategory: appliedFilters.mainCategory || [],
    priceRange: appliedFilters.priceRange || '',
    brands: appliedFilters.brands || [],
    search: appliedFilters.search || ''
  })

  // Update local state when applied filters change
  useEffect(() => {
    setSelectedFilters({
      mainCategory: appliedFilters.mainCategory || [],
      priceRange: appliedFilters.priceRange || '',
      brands: appliedFilters.brands || [],
      search: appliedFilters.search || ''
    })
  }, [appliedFilters])

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleMainCategoryChange = (mainCategory) => {
     setSelectedFilters(prev => {
      const updatedMainCategory = prev.mainCategory.includes(mainCategory)
        ? prev.mainCategory.filter(c => c !== mainCategory)
        : [...prev.mainCategory, mainCategory];
      const updatedFilters = {
        ...prev,
        mainCategory: updatedMainCategory
      };
    
      onFiltersApply(updatedFilters);
      return updatedFilters;
    });
  }

  const handleBrandChange = (brand) => {
    setSelectedFilters(prev => {
      const updatedBrands = prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand];
      const updatedFilters = { ...prev, brands: updatedBrands };
      onFiltersApply(updatedFilters);
      return updatedFilters;
    });
  }

  const handlePriceRangeChange = (value) => {
    setSelectedFilters(prev => {
      const updatedFilters = { ...prev, priceRange: value };
      onFiltersApply(updatedFilters);
      return updatedFilters;
    });
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      mainCategory: [],
      priceRange: '',
      brands: [],
      search: ''
    })
    onClearFilters()
  }

  const applyFilters = () => {
    onFiltersApply(selectedFilters);
    if (isMobile) onClose();
  }

  // Prevent body scroll when mobile filter is open
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobile, isOpen])

  const categories = [
    'T-Shirts',
    'Hoodies & Sweatshirts',
    'Jackets & Coats',
    'Jeans',
    'Trousers',
    'Shorts',
    'Ethnic Wear',
    'Track Pants & Joggers'
  ]

  const priceRanges = [
    { label: 'Under ₹1,000', value: 'under-1000' },
    { label: '₹1,000 - ₹2,000', value: '1000-2000' },
    { label: '₹2,000 - ₹5,000', value: '2000-5000' },
    { label: '₹5,000 - ₹10,000', value: '5000-10000' },
    { label: 'Above ₹10,000', value: 'above-10000' }
  ]

  const brands = [
    'Nike', 'Adidas', 'Puma', 'H&M', 'Zara', 'Levi\'s',
    'Tommy Hilfiger', 'Calvin Klein', 'Polo Ralph Lauren', 'GAP'
  ]

  // Desktop Filter
  if (!isMobile) {
    return (
      <div className="w-80 bg-white border-r border-gray-200 h-fit sticky top-16">
        <div className="p-6 lg:p-8">
          <div className="mb-8">
            <p className="text-xs font-medium tracking-[0.3em] text-gray-500 uppercase mb-2">
              Refine Selection
            </p>
            <h2 className='text-2xl font-light text-black tracking-wide'>
              Filters
            </h2>
          </div>

          <FilterContent
            categories={categories}
            priceRanges={priceRanges}
            brands={brands}
            openSections={openSections}
            selectedFilters={selectedFilters}
            toggleSection={toggleSection}
            handleMainCategoryChange={handleMainCategoryChange}
            handleBrandChange={handleBrandChange}
            handlePriceRangeChange={handlePriceRangeChange} // <-- add this line
            setSelectedFilters={setSelectedFilters}
            applyFilters={applyFilters}
            clearAllFilters={clearAllFilters}
            isMobile={false}
          />
        </div>
      </div>
    )
  }

  // Mobile Filter - Bottom Sheet
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <div className={`fixed inset-x-0 bottom-0 z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className="bg-white max-h-[90vh] flex flex-col">
          
          {/* Mobile Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-1 bg-gray-300"></div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-medium tracking-[0.3em] text-gray-500 uppercase mb-1">
                  Refine Selection
                </p>
                <h2 className='text-xl font-light text-black tracking-wide'>Filters</h2>
              </div>
              <button 
                onClick={onClose} 
                className='w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors duration-300'
              >
                <XIcon className='h-5 w-5 text-gray-600' />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <FilterContent
              categories={categories}
              priceRanges={priceRanges}
              brands={brands}
              openSections={openSections}
              selectedFilters={selectedFilters}
              toggleSection={toggleSection}
              handleMainCategoryChange={handleMainCategoryChange}
              handleBrandChange={handleBrandChange}
              handlePriceRangeChange={handlePriceRangeChange}
              setSelectedFilters={setSelectedFilters}
              applyFilters={applyFilters}
              clearAllFilters={clearAllFilters}
              isMobile={true}
            />
          </div>

        </div>
      </div>
    </>
  )
}

// Filter Content Component
const FilterContent = ({
  categories,
  priceRanges,
  brands,
  openSections,
  selectedFilters,
  toggleSection,
  handleMainCategoryChange,
  handleBrandChange,
  handlePriceRangeChange, // <-- add this line
  setSelectedFilters,
  applyFilters,
  clearAllFilters,
  isMobile
}) => {
  return (
    <div className="space-y-8">
  

      {/* Category Filter */}
      <div className="border-b border-gray-200 pb-6">
        <div
          className='flex justify-between items-center cursor-pointer py-2 group'
          onClick={() => toggleSection('mainCategory')}
        >
          <h3 className='text-sm font-medium text-gray-500 uppercase tracking-[0.2em] group-hover:text-black transition-colors duration-300'>
            Category
          </h3>
          <div className="w-6 h-6 flex items-center justify-center">
            {openSections.mainCategory ?
              <ChevronUpIcon className='h-4 w-4 text-gray-500 group-hover:text-black transition-colors duration-300' /> :
              <ChevronDownIcon className='h-4 w-4 text-gray-500 group-hover:text-black transition-colors duration-300' />
            }
          </div>
        </div>

        {openSections.mainCategory && (
          <div className='space-y-3 pt-4'>
            {categories.map((category) => (
              <label key={category} className='flex items-center cursor-pointer group'>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedFilters.mainCategory.includes(category)}
                    onChange={() => handleMainCategoryChange(category)}
                    className='sr-only'
                  />
                  <div className={`w-4 h-4 border-2 flex items-center justify-center transition-all duration-300 ${
                    selectedFilters.mainCategory.includes(category)
                      ? 'bg-black border-black'
                      : 'border-gray-300 group-hover:border-gray-400'
                  }`}>
                    {selectedFilters.mainCategory.includes(category) && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className='ml-3 text-sm text-gray-700 font-light group-hover:text-black transition-colors duration-300'>
                  {category}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div className="border-b border-gray-200 pb-6">
        <div
          className='flex justify-between items-center cursor-pointer py-2 group'
          onClick={() => toggleSection('price')}
        >
          <h3 className='text-sm font-medium text-gray-500 uppercase tracking-[0.2em] group-hover:text-black transition-colors duration-300'>
            Price Range
          </h3>
          <div className="w-6 h-6 flex items-center justify-center">
            {openSections.price ?
              <ChevronUpIcon className='h-4 w-4 text-gray-500 group-hover:text-black transition-colors duration-300' /> :
              <ChevronDownIcon className='h-4 w-4 text-gray-500 group-hover:text-black transition-colors duration-300' />
            }
          </div>
        </div>

        {openSections.price && (
          <div className='space-y-3 pt-4'>
            {priceRanges.map((range) => (
              <label key={range.value} className='flex items-center cursor-pointer group'>
                <div className="relative">
                  <input
                    type="radio"
                    name="priceRange"
                    value={range.value}
                    checked={selectedFilters.priceRange === range.value}
                    onChange={(e) => handlePriceRangeChange(e.target.value)}
                    className='sr-only'
                  />
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    selectedFilters.priceRange === range.value
                      ? 'bg-black border-black'
                      : 'border-gray-300 group-hover:border-gray-400'
                  }`}>
                    {selectedFilters.priceRange === range.value && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
                <span className='ml-3 text-sm text-gray-700 font-light group-hover:text-black transition-colors duration-300'>
                  {range.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Brand Filter */}
      <div className="pb-6">
        <div
          className='flex justify-between items-center cursor-pointer py-2 group'
          onClick={() => toggleSection('brand')}
        >
          <h3 className='text-sm font-medium text-gray-500 uppercase tracking-[0.2em] group-hover:text-black transition-colors duration-300'>
            Brand
          </h3>
          <div className="w-6 h-6 flex items-center justify-center">
            {openSections.brand ?
              <ChevronUpIcon className='h-4 w-4 text-gray-500 group-hover:text-black transition-colors duration-300' /> :
              <ChevronDownIcon className='h-4 w-4 text-gray-500 group-hover:text-black transition-colors duration-300' />
            }
          </div>
        </div>

        {openSections.brand && (
          <div className='space-y-3 pt-4'>
            {brands.map((brand) => (
              <label key={brand} className='flex items-center cursor-pointer group'>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedFilters.brands.includes(brand)}
                    onChange={() => handleBrandChange(brand)}
                    className='sr-only'
                  />
                  <div className={`w-4 h-4 border-2 flex items-center justify-center transition-all duration-300 ${
                    selectedFilters.brands.includes(brand)
                      ? 'bg-black border-black'
                      : 'border-gray-300 group-hover:border-gray-400'
                  }`}>
                    {selectedFilters.brands.includes(brand) && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className='ml-3 text-sm text-gray-700 font-light group-hover:text-black transition-colors duration-300'>
                  {brand}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

     
    
    </div>
  )
}

export default Filter