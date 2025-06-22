import React, { useState, useEffect } from 'react'
import { ChevronDownIcon, ChevronUpIcon, XIcon } from 'lucide-react'

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
    search: appliedFilters.search || '' // <-- add this
  })

  // Update local state when applied filters change
  useEffect(() => {
    setSelectedFilters({
      mainCategory: appliedFilters.mainCategory || [],
      priceRange: appliedFilters.priceRange || '',
      brands: appliedFilters.brands || [],
      search: appliedFilters.search || '' // <-- add this 
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
      console.log('Selected mainCategory:', updatedMainCategory); // Log immediately

    
      onFiltersApply(updatedFilters);

      return updatedFilters;
    });
  }

  const handleBrandChange = (brand) => {
    setSelectedFilters(prev => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand]
    }))
  }

  const clearAllFilters = () => {
    setSelectedFilters({
      mainCategory: [],
      priceRange: '',
      brands: [],
      search: '' // <-- add this
    })
    onClearFilters()
  }

  const applyFilters = () => {
    onFiltersApply(selectedFilters)
    if (isMobile) {
      onClose()
    }
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
      <div className="w-72 bg-white border-r border-l border-b border-gray-200 h-fit">
        <div className="p-4">
          <div className="mb-4">
            <h2 className='text-lg font-bold text-gray-800'>Filters</h2>
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
        <div className="bg-white rounded-t-2xl max-h-[90vh] flex flex-col">
          <div className="flex justify-center py-2">
            <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
          </div>

          <div className="flex justify-between items-center px-4 pb-3 border-b border-gray-200">
            <h2 className='text-lg font-bold text-gray-800'>Filters</h2>
            <button onClick={onClose} className='p-1 hover:bg-gray-100 rounded-full'>
              <XIcon className='h-4 w-4 text-gray-600' />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3">
            <FilterContent
              categories={categories}
              priceRanges={priceRanges}
              brands={brands}
              openSections={openSections}
              selectedFilters={selectedFilters}
              toggleSection={toggleSection}
              handleMainCategoryChange={handleMainCategoryChange}
              handleBrandChange={handleBrandChange}
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

// Filter Content Component remains the same but with updated prop names
const FilterContent = ({
  categories,
  priceRanges,
  brands,
  openSections,
  selectedFilters,
  toggleSection,
  handleMainCategoryChange,
  handleBrandChange,
  setSelectedFilters,
  applyFilters,
  clearAllFilters,
  isMobile
}) => {
  return (
    <div className="space-y-4">
      {/* Search Input - New Section */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={selectedFilters.search}
          onChange={e => setSelectedFilters(prev => ({
            ...prev,
            search: e.target.value
          }))}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        />
      </div>

      {/* Main Category Filter */}
      <div>
        <div
          className='flex justify-between items-center cursor-pointer py-2'
          onClick={() => toggleSection('mainCategory')}
        >
          <h3 className='text-sm font-semibold text-gray-700'>Category</h3>
          {openSections.mainCategory ?
            <ChevronUpIcon className='h-4 w-4 text-gray-500' /> :
            <ChevronDownIcon className='h-4 w-4 text-gray-500' />
          }
        </div>

        {openSections.mainCategory && (
          <div className='space-y-2 pt-2'>
            {categories.map((category) => (
              <label key={category} className='flex items-center cursor-pointer'>
                <input
                  type="checkbox"
                  checked={selectedFilters.mainCategory.includes(category)}
                  onChange={() => handleMainCategoryChange(category)}
                  className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-3 flex-shrink-0'
                />
                <span className='text-sm text-gray-700 select-none flex-1'>{category}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div>
        <div
          className='flex justify-between items-center cursor-pointer py-2'
          onClick={() => toggleSection('price')}
        >
          <h3 className='text-sm font-semibold text-gray-700'>Price Range</h3>
          {openSections.price ?
            <ChevronUpIcon className='h-4 w-4 text-gray-500' /> :
            <ChevronDownIcon className='h-4 w-4 text-gray-500' />
          }
        </div>

        {openSections.price && (
          <div className='space-y-2 pt-2'>
            {priceRanges.map((range) => (
              <label key={range.value} className='flex items-center cursor-pointer'>
                <input
                  type="radio"
                  name="priceRange"
                  value={range.value}
                  checked={selectedFilters.priceRange === range.value}
                  onChange={(e) => setSelectedFilters(prev => ({
                    ...prev,
                    priceRange: e.target.value
                  }))}
                  className='w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 mr-3 flex-shrink-0'
                />
                <span className='text-sm text-gray-700 select-none flex-1'>{range.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Brand Filter */}
      <div>
        <div
          className='flex justify-between items-center cursor-pointer py-2'
          onClick={() => toggleSection('brand')}
        >
          <h3 className='text-sm font-semibold text-gray-700'>Brand</h3>
          {openSections.brand ?
            <ChevronUpIcon className='h-4 w-4 text-gray-500' /> :
            <ChevronDownIcon className='h-4 w-4 text-gray-500' />
          }
        </div>

        {openSections.brand && (
          <div className='space-y-2 pt-2'>
            {brands.map((brand) => (
              <label key={brand} className='flex items-center cursor-pointer'>
                <input
                  type="checkbox"
                  checked={selectedFilters.brands.includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                  className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-3 flex-shrink-0'
                />
                <span className='text-sm text-gray-700 select-none flex-1'>{brand}</span>
              </label>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

export default Filter