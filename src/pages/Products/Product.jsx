import React, { useState, useEffect, useCallback } from 'react'
import Filter from './Filter'
import { SlidersHorizontalIcon, Search, X } from 'lucide-react'
import { useAllProductQuery, useFilterProductQuery, useGetWishlistQuery, useWishlistAddMutation, useWishlistRemoveMutation } from '../../APIs/product'
import { NavLink, useParams, useSearchParams } from 'react-router-dom'
import { debounce } from 'lodash'

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
  const brandNameFromUrl = searchParams.get('brandName') || ''

  // Filter state - Initialize with URL params
  const [appliedFilters, setAppliedFilters] = useState({
    mainCategory: categoryFromUrl ? [categoryFromUrl] : [],
    priceRange: '',
    brands: brandNameFromUrl ? [brandNameFromUrl] : [], // <-- add this
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
      clothing: clothingFromUrl || '',
      brands: brandNameFromUrl ? [brandNameFromUrl] : [],
      search: searchParams.get('search') || '', // <-- sync search param from URL
    }))
  }, [categoryFromUrl, clothingFromUrl, brandNameFromUrl, searchParams])

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

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  // When user applies filters, always keep clothing if set
  const handleFiltersApply = (filters) => {
    setAppliedFilters(prev => ({
      ...prev,
      ...filters,
      clothing: prev.clothing // always keep clothing if set
    }));
    setCurrentPage(1);
    if (isMobile) setIsFilterOpen(false);
  };

  // When user clears filters, keep clothing if it was set from URL
  const handleClearFilters = () => {
    setAppliedFilters(prev => ({
      mainCategory: [],
      priceRange: '',
      brands: [],
      search: '',
      clothing: prev.clothing // keep clothing if set, or '' if not
    }));
    setSearchTerm('');
    setCurrentPage(1);
  };

  const getActiveFilters = () => {
    const filters = [];
    if (appliedFilters.clothing) filters.push({ key: 'clothing', value: appliedFilters.clothing });
    if (appliedFilters.mainCategory && appliedFilters.mainCategory.length > 0) {
      appliedFilters.mainCategory.forEach(cat => filters.push({ key: 'mainCategory', value: cat }));
    }
    if (appliedFilters.brands && appliedFilters.brands.length > 0) {
      appliedFilters.brands.forEach(brand => filters.push({ key: 'brands', value: brand }));
    }
    if (appliedFilters.priceRange) filters.push({ key: 'priceRange', value: appliedFilters.priceRange });
    if (appliedFilters.search) filters.push({ key: 'search', value: appliedFilters.search });
    return filters;
  };

  const activeFilters = getActiveFilters();

  const getDisplayTitle = () => {
    if (activeFilters.length === 1) {
      const filter = activeFilters[0];
      if (filter.key === 'clothing' || filter.key === 'mainCategory') {
        return `${filter.value.charAt(0).toUpperCase() + filter.value.slice(1)} Collection`;
      }
      if (filter.key === 'search') {
        return 'Search Results';
      }
      return 'Product Collection';
    }
    return 'Product Collection';
  };

  const getDisplaySubtitle = () => {
    if (appliedFilters.search) {
      return `Showing results for "${appliedFilters.search}"`;
    }
    if (appliedFilters.clothing) {
      return `Discover our carefully curated collection of premium fashion pieces for ${appliedFilters.clothing}.`;
    }
    if (appliedFilters.mainCategory && appliedFilters.mainCategory.length > 0) {
      return `Explore our selection in ${appliedFilters.mainCategory[0]}.`;
    }
    return 'Discover our carefully curated collection of premium fashion pieces';
  };

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
          className={`${current === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-black hover:text-white'} border-gray-300 text-gray-700`}
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
              className={`cursor-pointer border-gray-300 ${i === current ? 'bg-black text-white border-black' : 'text-gray-700 hover:bg-black hover:text-white'}`}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      } else if (i === current - 2 || i === current + 2) {
        items.push(
          <PaginationItem key={`ellipsis-${i}`}>
            <PaginationEllipsis className="text-gray-500" />
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
          className={`${current === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-black hover:text-white'} border-gray-300 text-gray-700`}
        />
      </PaginationItem>
    );

    return items;
  };

  const [addToWishlist] = useWishlistAddMutation();
  const [removeFromWishlist] = useWishlistRemoveMutation();
  const { data: wishlistData, refetch: refetchWishlist } = useGetWishlistQuery();
  const wishlistIds = wishlistData?.wishlist?.map(p => p._id) || [];

  // Scroll to top on mount or when page changes (not on filter changes)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [currentPage]);

  return (
    <div className='flex flex-col min-h-screen bg-gray-50 overflow-y-scroll'>
      <div className='max-w-7xl mx-auto flex-1 w-full min-w-0'>
        <div className='flex items-start'>
          <div className='self-start'>
            <Filter
              isMobile={isMobile}
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              onFiltersApply={handleFiltersApply}
              onClearFilters={handleClearFilters}
              appliedFilters={appliedFilters}
            />
          </div>

          {/* Main Content */}
          <div className='flex-1'>
            {/* Mobile Header with Filter Button */}
            {isMobile && (
              <div className="sticky top-0 z-30 bg-white border-b border-gray-200 p-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h1 className='text-xl font-light text-black tracking-wide'>{getDisplayTitle()}</h1>
                    <p className='text-sm text-gray-600 font-light'>{pagination.totalProducts || 0} items available</p>
                  </div>
                  <button
                    onClick={() => setIsFilterOpen(true)}
                    className='flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 hover:bg-gray-50 transition-colors text-sm font-light tracking-wide'
                  >
                    <SlidersHorizontalIcon className='h-4 w-4' />
                    <span>FILTER</span>
                    {hasFilters && (
                      <span className="bg-black text-white text-xs px-2 py-1 ml-1">
                        {(appliedFilters.mainCategory?.length || 0) + (appliedFilters.brands?.length || 0) + (appliedFilters.priceRange ? 1 : 0) + (appliedFilters.clothing ? 1 : 0) + (appliedFilters.search ? 1 : 0)}
                      </span>
                    )}
                  </button>
                </div>

                {/* Show active filters on mobile */}
                {activeFilters.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {activeFilters.map((filter, idx) => (
                      <span
                        key={filter.key + filter.value + idx}
                        className="flex items-center bg-gray-100 text-black px-2 py-1 rounded-full text-xs font-medium capitalize"
                      >
                        {filter.value}
                        <button
                          onClick={() => {
                            // Remove only this filter
                            setAppliedFilters(prev => {
                              const updated = { ...prev };
                              if (filter.key === 'clothing') updated.clothing = '';
                              if (filter.key === 'mainCategory') updated.mainCategory = prev.mainCategory.filter(cat => cat !== filter.value);
                              if (filter.key === 'brands') updated.brands = prev.brands.filter(brand => brand !== filter.value);
                              if (filter.key === 'priceRange') updated.priceRange = '';
                              if (filter.key === 'search') {
                                updated.search = '';
                                setSearchTerm('');
                              }
                              return updated;
                            });
                            setCurrentPage(1);
                          }}
                          className="ml-1 flex items-center justify-center w-4 h-4 rounded-full hover:bg-gray-200 text-gray-500 hover:text-black transition-colors"
                          title="Remove filter"
                          type="button"
                        >
                          <X className="w-2 h-2" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Mobile Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-black transition-colors font-light text-sm"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => {
                        setSearchTerm('')
                        setAppliedFilters(prev => ({ ...prev, search: '' }))
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className='p-4 md:p-6 lg:p-8'>
              {/* Desktop Header */}
              {!isMobile && (
                <div className='mb-16'>
                  <div className='flex justify-between items-start gap-8'>
                    <div className="flex-1">
                      <p className="text-xs font-medium tracking-[0.3em] text-gray-500 uppercase mb-2">
                        Product Collection
                      </p>
                      <h1 className='text-3xl md:text-4xl lg:text-5xl font-light text-black mb-2'>
                        {getDisplayTitle().split(' ').slice(0, -1).join(' ')}
                        <span className="block font-extralight text-gray-600">
                          {getDisplayTitle().split(' ').slice(-1)}
                        </span>
                      </h1>

                      {/* Show active filters as tags below the title if more than 0 */}
                      {activeFilters.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                          {activeFilters.map((filter, idx) => (
                            <span
                              key={filter.key + filter.value + idx}
                              className="flex items-center bg-gray-100 text-black px-3 py-1 rounded-full text-sm font-medium capitalize"
                            >
                              {filter.value}
                              <button
                                onClick={() => {
                                  // Remove only this filter
                                  setAppliedFilters(prev => {
                                    const updated = { ...prev };
                                    if (filter.key === 'clothing') updated.clothing = '';
                                    if (filter.key === 'mainCategory') updated.mainCategory = prev.mainCategory.filter(cat => cat !== filter.value);
                                    if (filter.key === 'brands') updated.brands = prev.brands.filter(brand => brand !== filter.value);
                                    if (filter.key === 'priceRange') updated.priceRange = '';
                                    if (filter.key === 'search') {
                                      updated.search = '';
                                      setSearchTerm('');
                                    }
                                    return updated;
                                  });
                                  setCurrentPage(1);
                                  // Optionally update URL here if needed
                                }}
                                className="ml-2 flex items-center justify-center w-5 h-5 rounded-full hover:bg-gray-200 text-gray-500 hover:text-black transition-colors"
                                title="Remove filter"
                                type="button"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}

                      <p className="text-gray-600 font-light mb-6 max-w-2xl">
                        {getDisplaySubtitle()}
                      </p>
                      <div className='text-sm text-gray-600 font-light'>
                        Showing {pagination.currentPage ? ((pagination.currentPage - 1) * (pagination.limit || 12) + 1) : 1} - {Math.min((pagination.currentPage || 1) * (pagination.limit || 12), pagination.totalProducts || 0)} of {pagination.totalProducts || 0} products
                      </div>
                    </div>

                    <div className="flex-shrink-0 w-80">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search products..."
                          value={searchTerm}
                          onChange={handleSearchChange}
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-black transition-colors font-light text-sm"
                        />
                        {searchTerm && (
                          <button
                            onClick={() => {
                              setSearchTerm('')
                              setAppliedFilters(prev => ({ ...prev, search: '' }))
                            }}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                          >
                            ✕
                          </button>
                        )}
                        {isLoading && appliedFilters.search && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center min-h-[400px] w-full">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-light">Loading products...</p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="flex items-center justify-center min-h-[400px] w-full">
                  <div className="text-center max-w-md mx-auto p-8">
                    <div className="mb-6">
                      <div className="w-16 h-16 mx-auto bg-gray-100 border border-gray-300 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.764 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                    </div>

                    <h3 className="text-xl font-light text-black mb-2 tracking-wide">
                      Something went wrong
                    </h3>
                    <p className="text-gray-600 font-light mb-6 leading-relaxed">
                      We couldn't load the products right now. Please try again.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={() => window.location.reload()}
                        className="bg-black text-white font-medium px-6 py-3 hover:bg-gray-800 transition-colors text-sm tracking-wide"
                        disabled={isLoading}
                      >
                        TRY AGAIN
                      </button>
                      <button
                        onClick={handleClearFilters}
                        className="border border-gray-300 text-gray-700 font-medium px-6 py-3 hover:bg-gray-50 transition-colors text-sm tracking-wide"
                      >
                        CLEAR FILTERS
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Product Grid - Same as Limelight */}
              {!isLoading && !error && (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {fetchProductFromTheApi?.map((product, index) => (
                    <div
                      key={product?._id}
                      className="group relative bg-white border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col h-full"
                    >
                      {/* Product Image - Fixed aspect ratio */}
                      <div className="relative aspect-[3/4] overflow-hidden">
                        <img 
                          src={product?.image?.[0]}
                          alt={product?.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300"></div>

                        {/* Discount Badge */}
                        {product?.discount && (
                          <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-xs font-medium tracking-wide">
                            {product.discount}% OFF
                          </div>
                        )}

                        {/* Wishlist Icon */}
                        <button
                          className={`absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white hover:scale-110 ${wishlistIds.includes(product._id) ? 'text-red-500' : 'text-gray-700'}`}
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (!wishlistIds.includes(product._id)) {
                              await addToWishlist({ productId: product._id });
                            } else {
                              await removeFromWishlist({ productId: product._id });
                            }
                            refetchWishlist();
                          }}
                          title={wishlistIds.includes(product._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                          type="button"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </div>

                      {/* Product Info - Flex grow to fill remaining space */}
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex-grow">
                          <NavLink to={product?._id}>
                            <h3 className="text-lg font-light text-black tracking-wide hover:text-gray-600 transition-colors line-clamp-2 mb-2">
                              {product?.name}
                            </h3>
                          </NavLink>
                          <p className="text-sm text-gray-600 font-light uppercase tracking-wide mb-1">
                            {product?.category}
                          </p>
                          <p className="text-xs text-gray-500 font-light uppercase tracking-wide mb-3">
                            {product?.brandName}
                          </p>
                        </div>
                        
                        {/* Price and Shop Link - Always at bottom */}
                        <div className="flex justify-between items-end mt-auto">
                          <div>
                            <span className="text-lg font-light text-black">₹{product?.price}</span>
                            {product?.originalPrice && (
                              <div className="text-sm text-gray-500 line-through font-light">₹{product?.originalPrice}</div>
                            )}
                          </div>
                          
                          {/* Hide Shop Now button on mobile */}
                          <NavLink to={product?._id} className="hidden md:block">
                            <span className="inline-flex items-center text-black text-sm tracking-wide border-b border-gray-300 pb-1 hover:border-black transition-all duration-300 cursor-pointer">
                              SHOP NOW
                              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </span>
                          </NavLink>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* No Results */}
              {!isLoading && !error && fetchProductFromTheApi?.length === 0 && (
                <div className="text-center py-16">
                  <div className="mb-6">
                    <div className="w-16 h-16 mx-auto bg-gray-100 border border-gray-300 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-5.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293H5" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-light text-black mb-2 tracking-wide">
                    {appliedFilters.search ? `No results found` : 'No products available'}
                  </h3>
                  <p className="text-gray-600 font-light mb-6">
                    {appliedFilters.search ? `No products match "${appliedFilters.search}"` : 'No products available at the moment'}
                  </p>
                  {hasFilters && (
                    <button
                      onClick={handleClearFilters}
                      className="bg-black text-white font-medium px-8 py-3 hover:bg-gray-800 transition-colors text-sm tracking-wide"
                    >
                      CLEAR ALL FILTERS
                    </button>
                  )}
                </div>
              )}

              {/* Pagination Component */}
              {!isLoading && !error && pagination.totalPages > 1 && (
                <div className="mt-16 flex justify-center">
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