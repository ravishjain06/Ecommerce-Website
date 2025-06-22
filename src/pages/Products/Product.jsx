import React, { useState, useEffect, useCallback } from 'react'
import Filter from './Filter'
import { SlidersHorizontalIcon, Search } from 'lucide-react'
import { useAllProductQuery, useFilterProductQuery } from '../../APIs/product'
import { NavLink, useParams, useSearchParams } from 'react-router-dom'
import { debounce } from 'lodash'
import { BiLoaderCircle } from "react-icons/bi";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const Product = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')

  // Get URL parameters
  const [searchParams] = useSearchParams()
  const categoryFromUrl = searchParams.get('category') || ''
  const clothingFromUrl = searchParams.get('clothing') || ''

  // Filter state - Initialize with URL params
  const [appliedFilters, setAppliedFilters] = useState({
    mainCategory: categoryFromUrl ? [categoryFromUrl] : [],
    priceRange: '',
    brands: [],
    search: '',
    clothing: clothingFromUrl || ''
  })

  const [selectedFilters, setSelectedFilters] = useState({
    mainCategory: appliedFilters.mainCategory || [],
    priceRange: appliedFilters.priceRange || '',
    brands: appliedFilters.brands || []
  })

  // Update filters when URL changes
  useEffect(() => {
    setAppliedFilters(prev => ({
      ...prev,
      mainCategory: categoryFromUrl ? [categoryFromUrl] : [],
      clothing: clothingFromUrl || ''
    }))
  }, [categoryFromUrl, clothingFromUrl])

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchValue) => {
      setAppliedFilters(prev => ({
        ...prev,
        search: searchValue
      }))
      setCurrentPage(1)
    }, 300),
    []
  )

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    debouncedSearch(value)
  }

  // Check if any filters are applied
  const hasFilters = (appliedFilters.mainCategory && appliedFilters.mainCategory.length > 0) ||
    (appliedFilters.priceRange && appliedFilters.priceRange !== '') ||
    (appliedFilters.brands && appliedFilters.brands.length > 0) ||
    (appliedFilters.search && appliedFilters.search !== '') ||
    (appliedFilters.clothing && appliedFilters.clothing !== '')

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setIsFilterOpen(false)
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Prepare filter parameters
  const filterParams = {
    clothing: appliedFilters.clothing || '',
    category: appliedFilters.mainCategory.length > 0 ? appliedFilters.mainCategory.join(',') : '',
    brandName: appliedFilters.brands.length > 0 ? appliedFilters.brands.join(',') : '',
    priceRange: appliedFilters.priceRange || '',
    search: appliedFilters.search || '',
    page: currentPage,
    limit: 12
  };

  // Always call filter API with current filters
  const { data, isLoading, error } = useFilterProductQuery(filterParams);

  // Get products and pagination from response
  const fetchProductFromTheApi = data?.data?.products || [];
  const pagination = data?.data?.pagination || {};

  console.log('=== DEBUG INFO ===');
  console.log('Search term:', searchTerm);
  console.log('Applied search:', appliedFilters.search);
  console.log('Filter params:', filterParams);
  console.log('Products:', fetchProductFromTheApi);
  console.log('==================');

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFiltersApply = (filters) => {
    console.log('Applied filters:', filters);
    setAppliedFilters(filters);
    setCurrentPage(1);
    if (isMobile) {
      setIsFilterOpen(false);
    }
  };

  const handleClearFilters = () => {
    console.log('🧹 Clearing all filters');
    setAppliedFilters({
      mainCategory: [],
      priceRange: '',
      brands: [],
      search: '',
      clothing: ''
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const getDisplayTitle = () => {
    if (appliedFilters.search) {
      return `Search results for "${appliedFilters.search}"`
    }
    if (clothingFromUrl) {
      return `${clothingFromUrl.charAt(0).toUpperCase() + clothingFromUrl.slice(1)} Collection`
    }
    if (categoryFromUrl) {
      return `${categoryFromUrl} Collection`
    }
    if (hasFilters) {
      return 'Filtered Results'
    }
    return 'Shop the Latest Trends'
  }

  const renderPaginationItems = () => {
    const items = [];
    const totalPages = pagination.totalPages || 1;
    const current = pagination.currentPage || 1;

    items.push(
      <PaginationItem key="prev">
        <PaginationPrevious
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (current > 1) handlePageChange(current - 1);
          }}
          className={current === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-[var(--purple)] hover:text-white'}
        />
      </PaginationItem>
    );

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= current - 1 && i <= current + 1)) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(i);
              }}
              isActive={i === current}
              className={`cursor-pointer ${i === current ? 'bg-[var(--purple)] text-white' : 'hover:bg-[var(--purple)] hover:text-white'}`}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      } else if (i === current - 2 || i === current + 2) {
        items.push(
          <PaginationItem key={`ellipsis-${i}`}>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    items.push(
      <PaginationItem key="next">
        <PaginationNext
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (current < totalPages) handlePageChange(current + 1);
          }}
          className={current === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-[var(--purple)] hover:text-white'}
        />
      </PaginationItem>
    );

    return items;
  };

  return (
    <div className='min-h-screen'>
      <div className='max-w-7xl mx-auto bg-white'>
        <div className='flex'>
          {/* Filter Component */}
          <Filter
            isMobile={isMobile}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            onFiltersApply={handleFiltersApply}
            onClearFilters={handleClearFilters}
            appliedFilters={appliedFilters}
          />

          {/* Main Content */}
          <div className='flex-1'>
            {/* Mobile Header with Filter Button */}
            {isMobile && (
              <div className="sticky top-0 z-30 bg-white border-b border-gray-200 p-4">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h1 className='text-xl font-bold text-gray-800'>Products</h1>
                    <p className='text-sm text-gray-600'>{pagination.totalProducts || 0} items</p>
                  </div>
                  <button
                    onClick={() => setIsFilterOpen(true)}
                    className='flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm'
                  >
                    <SlidersHorizontalIcon className='h-4 w-4' />
                    <span>Filter</span>
                    {hasFilters && (
                      <span className="bg-[var(--purple)] text-white text-xs rounded-full px-2 py-0.5 ml-1">
                        {(appliedFilters.mainCategory?.length || 0) + (appliedFilters.brands?.length || 0) + (appliedFilters.priceRange ? 1 : 0) + (appliedFilters.clothing ? 1 : 0) + (appliedFilters.search ? 1 : 0)}
                      </span>
                    )}
                  </button>
                </div>
                {/* Mobile Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--purple)] focus:border-transparent text-sm"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => {
                        setSearchTerm('')
                        setAppliedFilters(prev => ({ ...prev, search: '' }))
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className='p-4 md:p-6'>
              {/* Desktop Header */}
              {!isMobile && (
                <div className='mb-6'>
                  <div className='flex justify-between items-start gap-4'>
                    <div className="flex-1">
                      <h1 className='text-2xl font-bold text-gray-800 mb-2'>
                        {getDisplayTitle()}
                      </h1>
                      <div className='text-sm text-gray-600'>
                        Showing {pagination.currentPage ? ((pagination.currentPage - 1) * (pagination.limit || 12) + 1) : 1} - {Math.min((pagination.currentPage || 1) * (pagination.limit || 12), pagination.totalProducts || 0)} of {pagination.totalProducts || 0} products
                      </div>
                    </div>

                   
                    <div className="flex-shrink-0 w-80">
                      <div className="relative">
                      
                        <input
                          type="text"
                          placeholder="Search products..."
                          value={searchTerm}
                          onChange={handleSearchChange}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        />
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        {searchTerm && (
                          <button
                            onClick={() => {
                              setSearchTerm('')
                              setAppliedFilters(prev => ({ ...prev, search: '' }))
                            }}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            ✕
                          </button>
                        )}
                        {isLoading && appliedFilters.search && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--purple)]"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>


                </div>
              )}

              {isLoading && (
                <div className="flex items-center justify-center min-h-[200px] w-full">
                  <BiLoaderCircle className="animate-spin h-12 w-12 text-[var(--purple)]" />
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="flex items-center justify-center min-h-[400px] w-full">
                  <div className="text-center max-w-md mx-auto p-8">
                    {/* Error Icon */}
                    <div className="mb-6">
                      <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.764 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                    </div>

                    {/* Error Message */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Oops! Something went wrong
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      We couldn't load the products right now. This might be a temporary issue.
                    </p>

                    {/* Error Details (if available) */}
                    {error?.data?.message && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
                        <p className="text-sm text-red-700">{error.data.message}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={() => window.location.reload()}
                        className="bg-[var(--purple)] hover:bg-[var(--purple)] text-white cursor-pointer inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--purple)] transition-colors"
                        disabled={isLoading}
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Try Again
                      </button>

                      <button
                        onClick={() => {
                          handleClearFilters();
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--purple)] transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Go to Home
                      </button>
                    </div>


                  </div>
                </div>
              )}

              {/* Product Grid */}
              {!isLoading && !error && (
                <div className='grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6'>
                  {fetchProductFromTheApi?.map((product) => (
                    <div key={product?._id} className='bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100'>
                      <div className="relative">
                        <img
                          src={product?.image?.[0]}
                          className='aspect-square object-cover w-full'
                          alt={product?.name}
                          onError={(e) => {
                            e.target.src = "/public/jackets.jpg";
                          }}
                        />
                        {product?.discount && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                            {product.discount}% OFF
                          </div>
                        )}
                      </div>
                      <div className='p-3 md:p-4'>
                        <div className='flex justify-between items-start'>
                          <div className='flex-1 mr-2'>
                            <NavLink to={product?._id}>
                              <h3 className='font-semibold text-sm md:text-base mb-1 line-clamp-2 text-gray-900 hover:text-[var(--purple)] transition-colors'>
                                {product?.name}
                              </h3>
                            </NavLink>
                            <p className='text-gray-600 text-xs md:text-sm capitalize'>{product?.category}</p>
                            <p className='text-gray-500 text-xs'>{product?.brandName}</p>
                          </div>
                          <div className='flex flex-col items-end'>
                            <span className='font-bold text-sm md:text-lg text-gray-900'>₹{product?.price}</span>
                            {product?.originalPrice && (
                              <span className='text-xs text-gray-500 line-through'>₹{product?.originalPrice}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* No Results */}
              {!isLoading && !error && fetchProductFromTheApi?.length === 0 && (
                <div className="text-center py-12">
                  <div className="mb-4">
                    <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-5.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293H5" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {appliedFilters.search ? `No results found for "${appliedFilters.search}"` : 'No products found'}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {hasFilters ? 'Try adjusting your filters or search terms' : 'No products available at the moment'}
                  </p>
                  {hasFilters && (
                    <button
                      onClick={handleClearFilters}
                      className="bg-[var(--purple)] hover:bg-[var(--purple)] text-white cursor-pointer px-6 py-2 rounded-lg transition-colors"
                      disabled={isLoading}
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              )}

              {/* Pagination Component */}
              {!isLoading && !error && pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      {renderPaginationItems()}
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Space */}
      {isMobile && <div className="h-16"></div>}
    </div>
  )
}

export default Product