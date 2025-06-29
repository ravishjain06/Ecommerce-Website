import React from 'react'
import Sidebar from './Sidebar'
import { useGetAllProductsQuery } from '../../APIs/admin';

const ManageProduct = () => {
  const { data: products = [], isLoading, isError } = useGetAllProductsQuery();

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 lg:p-8">
        <h2 className="text-2xl font-light text-black tracking-wide mb-6">Manage Products</h2>
        <div className="overflow-x-auto rounded-lg shadow border border-gray-200 bg-white min-h-[200px]">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : isError ? (
            <div className="p-8 text-center text-red-500">Failed to load products.</div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-lg">No products to display.</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {products.map((product, idx) => (
                  <tr key={product._id || product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{idx + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.brandName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">₹{product.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {product.inStock === 1 || product.stock > 0 ? (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">In Stock</span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600">Out of Stock</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default ManageProduct