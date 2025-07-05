import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from '../../components/ui/button';
import { TbLoader3 } from "react-icons/tb";
import Sidebar from '../Admin/Sidebar';

const AddProduct = () => {
    const [isLoading, setIsLoading] = useState(false);

    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        rating: "",
        size: "",
        category: "",
        inStock: "",
        brandName: "",
        image: null
    });

    const handleChange = (e) => {
        if (e.target.name === 'image') {
            setForm({
                ...form,

                image: file ? URL.createObjectURL(file) : null // Store only the file URL
            });
        } else {
            setForm({
                ...form,
                [e.target.name]: e.target.value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

    };

    return (
        <div className='min-h-screen'>
            <div className=' mx-auto bg-white'>
                <div className='flex'>
                    {/* Sidebar */}
                    <div className="hidden md:block">
                        <Sidebar />
                    </div>

                    {/* Main Content */}
                    <div className='flex-1'>
                        <div className='p-4 md:p-10'>
                            {/* Header */}
                            <div className="mb-2">
                                <h1 className="text-2xl font-light text-black mb-1 tracking-wide">Add New Product</h1>
                             
                            </div>

                            {/* Product Form Card - Left aligned, less gap */}
                            <div className="bg-white rounded-lg overflow-hidden">
                                <form
                                    onSubmit={handleSubmit}
                                    className="w-full"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Product Image */}
                                        <div className="grid w-full items-center gap-1.5">
                                            <label htmlFor="image" className='text-sm text-gray-600'>Product Image</label>
                                            <input
                                                id="image"
                                                name="image"
                                                type="file"
                                                accept="image/*"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        {/* Product Name */}
                                        <div className="grid w-full items-center gap-1.5">
                                            <label htmlFor="name" className='text-sm text-gray-600'>Product Name</label>
                                            <Input
                                                id="name"
                                                name="name"
                                                type="text"
                                                placeholder="Enter product name"
                                                className="w-full"
                                                value={form.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        {/* Brand Name */}
                                        <div className="grid w-full items-center gap-1.5">
                                            <label htmlFor="brandName" className='text-sm text-gray-600'>Brand Name</label>
                                            <Input
                                                id="brandName"
                                                name="brandName"
                                                type="text"
                                                placeholder="Enter brand name"
                                                className="w-full"
                                                value={form.brandName}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        {/* Category */}
                                        <div className="grid w-full items-center gap-1.5">
                                            <label htmlFor="category" className='text-sm text-gray-600'>Category</label>
                                            <Input
                                                id="category"
                                                name="category"
                                                type="text"
                                                placeholder="e.g., T-Shirts, Jeans"
                                                className="w-full"
                                                value={form.category}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        {/* Price */}
                                        <div className="grid w-full items-center gap-1.5">
                                            <label htmlFor="price" className='text-sm text-gray-600'>Price ($)</label>
                                            <Input
                                                id="price"
                                                name="price"
                                                type="number"
                                                placeholder="0.00"
                                                className="w-full"
                                                value={form.price}
                                                onChange={handleChange}
                                                min="0"
                                                step="0.01"
                                                required
                                            />
                                        </div>

                                        {/* Rating */}
                                        <div className="grid w-full items-center gap-1.5">
                                            <label htmlFor="rating" className='text-sm text-gray-600'>Rating (1-5)</label>
                                            <Input
                                                id="rating"
                                                name="rating"
                                                type="number"
                                                placeholder="4.5"
                                                className="w-full"
                                                value={form.rating}
                                                onChange={handleChange}
                                                min="1"
                                                max="5"
                                                step="0.1"
                                                required
                                            />
                                        </div>

                                        {/* Size */}
                                        <div className="grid w-full items-center gap-1.5">
                                            <label htmlFor="size" className='text-sm text-gray-600'>Size</label>
                                            <select
                                                id="size"
                                                name="size"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                value={form.size}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select size</option>
                                                <option value="XS">XS</option>
                                                <option value="S">S</option>
                                                <option value="M">M</option>
                                                <option value="L">L</option>
                                                <option value="XL">XL</option>
                                                <option value="XXL">XXL</option>
                                            </select>
                                        </div>

                                        {/* Stock Quantity */}
                                        <div className="grid w-full items-center gap-1.5">
                                            <label htmlFor="inStock" className='text-sm text-gray-600'>Stock Quantity</label>
                                            <Input
                                                id="inStock"
                                                name="inStock"
                                                type="number"
                                                placeholder="100"
                                                className="w-full"
                                                value={form.inStock}
                                                onChange={handleChange}
                                                min="0"
                                                required
                                            />
                                        </div>

                                        {/* Description (full width) */}
                                        <div className="md:col-span-2 grid w-full items-center gap-1.5">
                                            <label htmlFor="description" className='text-sm text-gray-600'>Description</label>
                                            <textarea
                                                id="description"
                                                name="description"
                                                placeholder="Enter product description"
                                                className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                                value={form.description}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className='mt-8'>
                                        <Button
                                            type="submit"
                                            className="bg-black hover:bg-gray-800 text-white cursor-pointer px-8 py-3 font-medium transition-colors"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? <TbLoader3 className="animate-spin mr-2" /> : null}
                                            {isLoading ? "Adding Product..." : "Add Product"}
                                        </Button>

                                        <div className='text-gray-500 mt-4'>
                                            <span className='text-sm'>Make sure all details are correct before submitting</span>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;