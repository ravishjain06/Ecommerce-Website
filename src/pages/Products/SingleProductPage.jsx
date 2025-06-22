import React, { useState, useEffect } from 'react'
import { ChevronRightIcon, StarIcon, ShoppingCartIcon, ShieldCheckIcon, RulerIcon, TruckIcon, RefreshCwIcon } from 'lucide-react'
import { useGetProductByIdQuery } from '../../APIs/product'

import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useAddToCartMutation } from '../../APIs/cart'

const ProductDetail = () => {
    const [selectedImage, setSelectedImage] = useState(0)
    const [selectedSize, setSelectedSize] = useState('')
    const [selectedColor, setSelectedColor] = useState('')
    const [rating] = useState(4.5)

    const user = useSelector((state) => state.auth.user);
    const userId = user?._id
    const images = [
        '/public/jackets.jpg',
        '/public/jackets.jpg',
        '/public/joggers.webp',
        '/public/jackets.jpg',
        '/public/jackets.jpg'
    ]

    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    const colors = [
        { name: 'Black', code: '#000000' },
        { name: 'White', code: '#FFFFFF' },
        { name: 'Navy', code: '#1E3A8A' },
        { name: 'Red', code: '#DC2626' }
    ]

    const params = useParams()
    const id = params.id
    console.log(id);
    const { data } = useGetProductByIdQuery(id)
    console.log(data);
    const navigate = useNavigate()

    const [addToCart, { data: cartData, isLoading, isError }] = useAddToCartMutation()
    console.log(cartData, isLoading, isError);

    useEffect(() => {
        if (cartData) {
            console.log('Cart Data:', cartData);
        }
    }, [cartData]);


    const handleAddToCart = async () => {
        if (!selectedSize || !selectedColor) {
            alert('Please select size and color');
            return;
        }

        try {
            const cartItemData = {
                userId: userId,
                size: selectedSize,
                color: selectedColor,
                quantity: 1
            };

            console.log('Sending cart data:', cartItemData);
            console.log('Product ID:', id);

            const result = await addToCart({ data: cartItemData, productId: id }).unwrap();
            navigate('/cart');
        } catch (error) {
            console.error('Failed to add product to cart:', error);
            console.log('Full error object:', JSON.stringify(error, null, 2));
            alert(`Failed to add product to cart: ${error.message || 'Unknown error'}`);
        }
    }

    return (
        <div className='min-h-screen'>
            <div className='max-w-7xl mx-auto bg-white'>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 md:p-8'>

                    {/* Left Side - Images */}
                    <div className='space-y-4'>
                        {/* Main Image */}
                        <div className='aspect-square bg-gray-100 rounded-lg overflow-hidden'>
                            <img
                                src={images[selectedImage]}
                                alt="Product"
                                className='w-full h-full object-cover'
                            />
                        </div>

                        {/* Thumbnail Images */}
                        <div className='grid grid-cols-4 gap-2'>
                            {images.slice(0, 4).map((image, index) => (
                                <div
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 ${selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                                        }`}
                                >
                                    <img
                                        src={image}
                                        alt={`Product ${index + 1}`}
                                        className='w-full h-full object-cover'
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side - Product Details */}
                    <div className='space-y-6'>

                        {/* Breadcrumb */}
                        <div className='flex items-center text-sm text-gray-600'>
                            <span>Home</span>
                            <ChevronRightIcon className='h-4 w-4 mx-2' />
                            <span>Men</span>
                            <ChevronRightIcon className='h-4 w-4 mx-2' />
                            <span>Jackets</span>
                            <ChevronRightIcon className='h-4 w-4 mx-2' />
                            <span className='text-gray-900'>Premium Jacket</span>
                        </div>

                        {/* Title */}
                        <div>
                            <h1 className='text-2xl md:text-3xl font-bold text-gray-900 mb-2'>
                                {data?.product?.name || 'Product Name'}
                            </h1>
                            <p className='text-gray-600'>{data?.product?.brandName || 'Brand Name'}</p>
                        </div>

                        {/* Star Rating */}
                        <div className='flex items-center space-x-2'>
                            <div className='flex items-center'>
                                {[...Array(5)].map((_, index) => (
                                    <StarIcon
                                        key={index}
                                        className={`h-5 w-5 ${index < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className='text-sm text-gray-600'>({rating})</span>
                        </div>

                        {/* Size Selection */}
                        <div>
                            <h3 className='text-sm font-semibold text-gray-900 mb-3'>
                                Size {!selectedSize && <span className='text-red-500'>*</span>}
                            </h3>
                            <div className='flex flex-wrap gap-2'>
                                {sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`w-10 h-10 border rounded-lg text-sm font-medium transition-colors ${selectedSize === size
                                            ? 'border-blue-500 bg-blue-50 text-blue-600'
                                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color Selection */}
                        <div>
                            <h3 className='text-sm font-semibold text-gray-900 mb-3'>
                                Color {!selectedColor && <span className='text-red-500'>*</span>}
                            </h3>
                            <div className='flex space-x-3'>
                                {colors.map((color) => (
                                    <button
                                        key={color.name}
                                        onClick={() => setSelectedColor(color.name)}
                                        className={`w-8 h-8 rounded-full border-2 ${selectedColor === color.name ? 'border-gray-900' : 'border-gray-300'
                                            }`}
                                        style={{ backgroundColor: color.code }}
                                    />
                                ))}
                            </div>
                            {selectedColor && (
                                <p className='text-sm text-gray-600 mt-2'>Selected: {selectedColor}</p>
                            )}
                        </div>

                        {/* Price and Add to Cart */}
                        <div className='flex items-center space-x-4'>
                            <button
                                onClick={handleAddToCart}
                                disabled={isLoading || !selectedSize || !selectedColor} // Removed !user?.id condition
                                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-lg transition-colors ${isLoading || !selectedSize || !selectedColor
                                        ? 'bg-gray-400 cursor-not-allowed text-white'
                                        : 'bg-black text-white hover:bg-gray-800'
                                    }`}
                            >
                                <ShoppingCartIcon className='h-5 w-5' />
                                <span>{isLoading ? 'Adding...' : 'Add to Cart'}</span>
                            </button>
                            <div className='text-right'>
                                <span className='text-2xl font-bold text-gray-900'>
                                    ₹{data?.product?.price || '2,999'}
                                </span>
                            </div>
                        </div>

                        {/* Validation Messages */}
                        {(!selectedSize || !selectedColor) && (
                            <p className='text-sm text-red-500'>
                                Please select {!selectedSize && 'size'} {!selectedSize && !selectedColor && 'and'} {!selectedColor && 'color'}
                            </p>
                        )}

                        {/* Divider */}
                        <hr className='border-gray-200' />

                        {/* Features */}
                        <div className='grid grid-cols-2 gap-4'>
                            <div className='flex items-center space-x-3'>
                                <button className="p-2 bg-gray-100 rounded-md">
                                    <ShieldCheckIcon className="text-lg text-gray-700 transition-colors" />
                                </button>
                                <span className='text-sm text-gray-700'>Secure Payment</span>
                            </div>

                            <div className='flex items-center space-x-3'>
                                <button className="p-2 bg-gray-100 rounded-md">
                                    <RulerIcon className="text-lg text-gray-700 transition-colors" />
                                </button>
                                <span className='text-sm text-gray-700'>Size and Fit Guide</span>
                            </div>

                            <div className='flex items-center space-x-3'>
                                <button className="p-2 bg-gray-100 rounded-md">
                                    <TruckIcon className="text-lg text-gray-700 transition-colors" />
                                </button>
                                <span className='text-sm text-gray-700'>Free Shipping</span>
                            </div>

                            <div className='flex items-center space-x-3'>
                                <button className="p-2 bg-gray-100 rounded-md">
                                    <RefreshCwIcon className="text-lg text-gray-700 transition-colors" />
                                </button>
                                <span className='text-sm text-gray-700'>Free Returns</span>
                            </div>
                        </div>



                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetail