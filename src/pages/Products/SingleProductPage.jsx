import React, { useState, useEffect } from 'react'
import { ChevronRightIcon, StarIcon, ShoppingCartIcon, ShieldCheckIcon, RulerIcon, TruckIcon, RefreshCwIcon, HeartIcon, ShareIcon, MinusIcon, PlusIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion';

import { useGetProductByIdQuery } from '../../APIs/product'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useAddToCartMutation } from '../../APIs/cart'
import { useWishlistAddMutation, useGetWishlistQuery, useWishlistRemoveMutation } from '../../APIs/product'

const ProductDetail = () => {
    const [selectedImage, setSelectedImage] = useState(0)
    const [selectedSize, setSelectedSize] = useState('')
    const [selectedColor, setSelectedColor] = useState('')
    const [quantity, setQuantity] = useState(1)
    const [rating] = useState(4.5)
    const [cartSuccess, setCartSuccess] = useState(false)
    const [cartMessage, setCartMessage] = useState("");
    const [wishlistMessage, setWishlistMessage] = useState(""); // Add for wishlist messages
    const [showCartPanel, setShowCartPanel] = useState(false);
    const [cartPanelProduct, setCartPanelProduct] = useState(null);

    const user = useSelector((state) => state.auth.user);
    const userId = user?._id
    
    const params = useParams();
    const id = params.id;
    // Use backend images
    const { data, isLoading: isProductLoading} = useGetProductByIdQuery(id)
    let images = [];
    if (Array.isArray(data?.product?.image) && data.product.image.length > 0) {
        images = data.product.image;
    } else if (data?.product?.img) {
        images = [data.product.img];
    } else {
        images = ['']; 
    }

    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    const colors = [
        { name: 'Black', code: '#000000' },
        { name: 'White', code: '#FFFFFF' },
        { name: 'Navy', code: '#1E3A8A' },
        { name: 'Red', code: '#DC2626' }
    ]

      React.useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }, []);

    const [addToCart, { data: cartData, isLoading, isError }] = useAddToCartMutation()
    const [addToWishlist, { isLoading: isWishlistLoading }] = useWishlistAddMutation();
    const [removeFromWishlist, { isLoading: isRemoveLoading }] = useWishlistRemoveMutation();
    const { data: wishlistData, refetch: refetchWishlist } = useGetWishlistQuery();
    const wishlistIds = wishlistData?.wishlist?.map(p => p._id) || [];



    const handleAddToCart = async () => {
        setCartMessage("");
        if (!selectedSize || !selectedColor) {
            setCartMessage("Please select size and color");
            setTimeout(() => setCartMessage(""), 2000);
            return;
        }
        try {
            const cartItemData = {
                userId: userId,
                size: selectedSize,
                color: selectedColor,
                quantity: quantity
            };
            const result = await addToCart({ data: cartItemData, productId: id });
            if (result?.data?.success) {
                setCartMessage(result?.data?.message || "Added to cart!");
                // Show slide-in panel with product details
                setCartPanelProduct({
                    name: data?.product?.name,
                    image: images[selectedImage],
                    size: selectedSize,
                    color: selectedColor,
                    quantity,
                    price: data?.product?.price,
                    brand: data?.product?.brandName,
                });
                setShowCartPanel(true);
                setTimeout(() => setShowCartPanel(false), 2000);
            } else if (result?.error) {
                setCartMessage(result?.error?.data?.message || "Failed to add product to cart.");
            }
            setTimeout(() => setCartMessage(""), 2000); // Hide after 2 seconds
        } catch (error) {
            setCartMessage(error?.data?.message || "Failed to add product to cart.");
            setTimeout(() => setCartMessage(""), 2000);
        }
    };

    const handleWishlist = async () => {
        setWishlistMessage("");
        try {
            let result;
            if (!wishlistIds.includes(id)) {
                result = await addToWishlist({ productId: id });
            } else {
                result = await removeFromWishlist({ productId: id });
            }
            refetchWishlist();
            if (result?.data?.message) {
                setWishlistMessage(result.data.message);
            } else if (result?.error) {
                setWishlistMessage(result?.error?.data?.message || "Wishlist action failed.");
            }
            setTimeout(() => setWishlistMessage(""), 2000); // Hide after 2 seconds
        } catch (error) {
            setWishlistMessage(error?.data?.message || "Wishlist action failed.");
            setTimeout(() => setWishlistMessage(""), 2000);
        }
    };

    const incrementQuantity = () => setQuantity(prev => prev + 1)
    const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1)

    // Stock logic
    const stock = data?.product?.inStock ?? 0;
    const isOutOfStock = stock <= 0;
   if (isProductLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-6 h-6 border-2 border-black border-t-transparent animate-spin"></div>
    </div>
        );
    }
    return (
        <div className='min-h-screen bg-gray-50'>
            <div className='max-w-7xl mx-auto'>
                <div className='bg-white'>
                    
                

                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-0'>

                        {/* Left Side - Images */}
                        <div className='p-8 lg:p-12 border-r border-gray-200'>
                            {/* Main Image */}
                            <div className='aspect-square bg-gray-100 border border-gray-200 overflow-hidden mb-6'>
                                <img
                                    src={images[selectedImage] || '/public/jackets.jpg'}
                                    alt="Product"
                                    className='w-full h-full object-cover hover:scale-105 transition-transform duration-500'
                                />
                            </div>

                            {/* Thumbnail Images */}
                            <div className='grid grid-cols-4 gap-4'>
                                {images.length > 0 ? (
                                    images.slice(0, 4).map((image, index) => (
                                        <div
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`aspect-square bg-gray-100 border-2 overflow-hidden cursor-pointer transition-all duration-300 ${
                                                selectedImage === index 
                                                    ? 'border-black' 
                                                    : 'border-gray-200 hover:border-gray-400'
                                            }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`Product ${index + 1}`}
                                                className='w-full h-full object-cover'
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <div className='col-span-4 text-center text-gray-400 text-sm'>No images available</div>
                                )}
                            </div>
                        </div>

                        {/* Right Side - Product Details */}
                        <div className='p-8 lg:p-12 space-y-8'>

                            {/* Product Header */}
                            <div className='space-y-4'>
                                <div>
                                    <p className="text-xs font-medium tracking-[0.3em] text-gray-500 uppercase mb-2">
                                        {data?.product?.brandName || 'Brand Name'}
                                    </p>
                                    <h1 className='text-3xl md:text-4xl font-light text-black mb-4 tracking-wide'>
                                        {data?.product?.name || 'Product Name'}
                                    </h1>
                                </div>

                                {/* Rating */}
                                <div className='flex items-center space-x-4'>
                                    <div className='flex items-center space-x-1'>
                                        {[...Array(5)].map((_, index) => (
                                            <StarIcon
                                                key={index}
                                                className={`h-4 w-4 ${
                                                    index < Math.floor(rating) 
                                                        ? 'text-black fill-current' 
                                                        : 'text-gray-300'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <span className='text-sm text-gray-600 font-light'>({rating}) • 127 reviews</span>
                                </div>

                                {/* Price */}
                                <div className='flex items-center space-x-4'>
                                    <span className='text-3xl font-light text-black'>
                                        ₹{data?.product?.price || '2,999'}
                                    </span>
                                    {data?.product?.originalPrice && (
                                        <span className='text-lg text-gray-500 line-through font-light'>
                                            ₹{data?.product?.originalPrice}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Size Selection */}
                            <div className='space-y-4'>
                                <div className="flex items-center gap-4">
                                    <h3 className='text-sm font-medium text-gray-500 uppercase tracking-[0.2em] m-0'>
                                        Size {!selectedSize && <span className='text-red-500'>*</span>}
                                    </h3>
                                    {isOutOfStock && (
                                        <span className='px-4 py-1 text-xs font-light tracking-wide bg-red-50 text-red-600 border border-red-200'>Out of Stock</span>
                                    )}
                                    {!isOutOfStock && (
                                        <span className='px-4 py-1 text-xs font-light tracking-wide bg-green-50 text-green-700 border border-green-200'>In Stock</span>
                                    )}
                                </div>
                                <div className='flex flex-wrap gap-3'>
                                    {sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`w-12 h-12 border text-sm font-medium transition-all duration-300 ${
                                                selectedSize === size
                                                    ? 'border-black bg-black text-white'
                                                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                            }`}
                                            disabled={isOutOfStock}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Color Selection */}
                            <div className='space-y-4'>
                                <h3 className='text-sm font-medium text-gray-500 uppercase tracking-[0.2em]'>
                                    Color {!selectedColor && <span className='text-red-500'>*</span>}
                                </h3>
                                <div className='flex space-x-4'>
                                    {colors.map((color) => (
                                        <button
                                            key={color.name}
                                            onClick={() => setSelectedColor(color.name)}
                                            className={`w-10 h-10 border-2 transition-all duration-300 ${
                                                selectedColor === color.name 
                                                    ? 'border-black scale-110' 
                                                    : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                            style={{ backgroundColor: color.code }}
                                        />
                                    ))}
                                </div>
                                {selectedColor && (
                                    <p className='text-sm text-gray-600 font-light'>Selected: {selectedColor}</p>
                                )}
                            </div>

                            {/* Quantity */}
                            <div className='space-y-4'>
                                <h3 className='text-sm font-medium text-gray-500 uppercase tracking-[0.2em]'>
                                    Quantity
                                </h3>
                                <div className='flex items-center border border-gray-300 w-fit'>
                                    <button
                                        onClick={decrementQuantity}
                                        className='p-3 hover:bg-gray-50 transition-colors duration-300'
                                    >
                                        <MinusIcon className='h-4 w-4 text-gray-600' />
                                    </button>
                                    <span className='px-6 py-3 font-medium text-black border-x border-gray-300'>
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={incrementQuantity}
                                        className='p-3 hover:bg-gray-50 transition-colors duration-300'
                                    >
                                        <PlusIcon className='h-4 w-4 text-gray-600' />
                                    </button>
                                </div>
                            </div>

                            {/* Validation Messages */}
                            {(!selectedSize || !selectedColor) && (
                                <div className='p-4 bg-red-50 border border-red-200'>
                                    <p className='text-sm text-red-600 font-light'>
                                        Please select {!selectedSize && 'size'} {!selectedSize && !selectedColor && ' and '} {!selectedColor && 'color'} to continue
                                    </p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="w-full flex flex-col md:flex-row gap-4">
                                {/* Add to Cart Button */}
                                <button
                                    onClick={handleAddToCart}
                                    disabled={isLoading || !selectedSize || !selectedColor || isOutOfStock}
                                    className={`w-full md:w-1/2 flex items-center justify-center space-x-3 py-4 px-6 text-sm font-medium tracking-wide transition-all duration-300 ${
                                        isLoading || !selectedSize || !selectedColor || isOutOfStock
                                            ? 'bg-gray-400 cursor-not-allowed text-white'
                                            : 'bg-black text-white hover:bg-gray-800'
                                    }`}
                                >
                                    {isLoading ? (
                                       <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin duration-500"></div>
                                    ) : (
                                        <ShoppingCartIcon className='h-5 w-5' />
                                    )}
                                    <span>{isOutOfStock ? 'OUT OF STOCK' : isLoading ? '' : 'ADD TO CART'}</span>
                                </button>
                                {/* Wishlist Button */}
                                <button
                                    className={`w-full md:w-1/2 flex items-center justify-center space-x-2 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-300 text-sm font-medium tracking-wide ${wishlistIds.includes(id) ? 'text-red-500 border-red-300 bg-red-50' : ''}`}
                                    onClick={handleWishlist}
                                    disabled={isWishlistLoading || isRemoveLoading}
                                    type="button"
                                >
                                    {(isWishlistLoading || isRemoveLoading) ? (
                                      ""
                                    ) : (
                                        <HeartIcon className='h-4 w-4' />
                                    )}
                                    <span>
                                        {wishlistIds.includes(id)
                                            ? (isRemoveLoading ? <div className="w-4 h-4 border-2 border-black border-t-transparent animate-spin duration-500"></div> : 'Wishlisted')
                                            : (isWishlistLoading ? <div className="w-4 h-4 border-2 border-black border-t-transparent animate-spin duration-500"></div> : 'WISHLIST')}
                                    </span>
                                </button>
                            </div>
                            {/* Cart message */}
                            {cartMessage && (
                                <p className={`text-sm font-medium text-center mt-2 text-red-600`}>
                                    {cartMessage}
                                </p>
                            )}
                            {/* Wishlist message */}
                            {wishlistMessage && (
                                <p className="text-sm font-medium text-center mt-2 text-red-600">
                                    {wishlistMessage}
                                </p>
                            )}
                            {/* Features */}
                            <div className='border-t border-gray-200 pt-8'>
                                <h3 className='text-sm font-medium text-gray-500 uppercase tracking-[0.2em] mb-6'>
                                    Product Features
                                </h3>
                                <div className='grid grid-cols-1 gap-4'>
                                    <div className='flex items-center space-x-4 p-4 bg-gray-50 border border-gray-200'>
                                        <div className="w-12 h-12 bg-white border border-gray-300 flex items-center justify-center">
                                            <ShieldCheckIcon className="h-6 w-6 text-gray-600" />
                                        </div>
                                        <div>
                                            <span className='text-sm font-medium text-black tracking-wide'>SECURE PAYMENT</span>
                                            <p className='text-xs text-gray-600 font-light'>100% secure payment methods</p>
                                        </div>
                                    </div>

                                    <div className='flex items-center space-x-4 p-4 bg-gray-50 border border-gray-200'>
                                        <div className="w-12 h-12 bg-white border border-gray-300 flex items-center justify-center">
                                            <TruckIcon className="h-6 w-6 text-gray-600" />
                                        </div>
                                        <div>
                                            <span className='text-sm font-medium text-black tracking-wide'>FREE SHIPPING</span>
                                            <p className='text-xs text-gray-600 font-light'>Free shipping on orders over ₹999</p>
                                        </div>
                                    </div>

                                    <div className='flex items-center space-x-4 p-4 bg-gray-50 border border-gray-200'>
                                        <div className="w-12 h-12 bg-white border border-gray-300 flex items-center justify-center">
                                            <RefreshCwIcon className="h-6 w-6 text-gray-600" />
                                        </div>
                                        <div>
                                            <span className='text-sm font-medium text-black tracking-wide'>EASY RETURNS</span>
                                            <p className='text-xs text-gray-600 font-light'>30-day return policy</p>
                                        </div>
                                    </div>

                                    <div className='flex items-center space-x-4 p-4 bg-gray-50 border border-gray-200'>
                                        <div className="w-12 h-12 bg-white border border-gray-300 flex items-center justify-center">
                                            <RulerIcon className="h-6 w-6 text-gray-600" />
                                        </div>
                                        <div>
                                            <span className='text-sm font-medium text-black tracking-wide'>SIZE GUIDE</span>
                                            <p className='text-xs text-gray-600 font-light'>Find your perfect fit</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Product Description */}
                            <div className='border-t border-gray-200 pt-8'>
                                <h3 className='text-sm font-medium text-gray-500 uppercase tracking-[0.2em] mb-4'>
                                    Product Details
                                </h3>
                                <div className='prose prose-sm text-gray-600 font-light leading-relaxed'>
                                    <p>
                                        {data?.product?.description || 'This premium product offers exceptional quality and style. Crafted with attention to detail and made from the finest materials for lasting comfort and durability.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cart Panel - Slide in from right */}
            <AnimatePresence>
  {showCartPanel && cartPanelProduct && (
    <motion.div
      initial={{ x: 350, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 350, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30, duration: 1 }} // <-- slower animation
      className="fixed top-8 right-8 z-[100] w-80 max-w-full bg-white shadow-2xl border border-gray-200"
      style={{ borderRadius: 0 }}
    >
      <div className="flex gap-4 p-4 border-b border-gray-100">
        <img
          src={cartPanelProduct.image}
          alt={cartPanelProduct.name}
          className="w-16 h-16 object-cover border"
        />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-black truncate">{cartPanelProduct.name}</div>
          <div className="text-xs text-gray-500 truncate">{cartPanelProduct.brand}</div>
          <div className="text-sm text-gray-700 mt-1">
            <span className="font-medium">Size:</span> {cartPanelProduct.size} &nbsp;|&nbsp;
            <span className="font-medium">Color:</span> {cartPanelProduct.color}
          </div>
          <div className="text-sm text-gray-700">
            <span className="font-medium">Qty:</span> {cartPanelProduct.quantity}
          </div>
          <div className="text-base font-bold text-black mt-2">
            ₹{cartPanelProduct.price}
          </div>
        </div>
      </div>
      <div className="px-4 py-3 text-green-700 text-sm font-semibold flex items-center justify-center gap-2">
        <ShoppingCartIcon className="w-5 h-5 text-green-700" />
        <span>Added to cart!</span>
      </div>
    </motion.div>
  )}
</AnimatePresence>
        </div>
    )
}

export default ProductDetail