import React from 'react'
import Sidebar from './Sidebar'
import { useGetAllProductsQuery } from '../../APIs/admin';

const ManageProduct = () => {
  const { data: products = [], isLoading, isError } = useGetAllProductsQuery();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar: fixed on the left */}
      <div className="hidden md:block">
        <div className="fixed inset-y-0 left-0 w-72 z-30">
          <Sidebar />
        </div>
      </div>
      {/* Main content: scrollable */}
      <main className="flex-1 md:ml-72 h-screen overflow-y-auto p-6 md:p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-light text-black">Manage Products</h2>
          <p className="text-sm text-gray-500 mt-1">View and manage all products</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg overflow-x-auto">
          {isLoading ? (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="w-6 h-6 border-2 border-black border-t-transparent animate-spin"></div>
            </div>
          ) : isError ? (
            <div className="p-8 text-center text-red-500">Failed to load products.</div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-lg">No products to display.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th style={{padding: '16px 24px'}} className="font-medium">#</th>
                  <th style={{padding: '16px 24px'}} className="font-medium">Name</th>
                  <th style={{padding: '16px 24px'}} className="font-medium">Brand</th>
                  <th style={{padding: '16px 24px'}} className="font-medium">Price</th>
                  <th style={{padding: '16px 24px'}} className="font-medium">Stock</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, idx) => (
                  <tr
                    key={product._id || product.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td style={{padding: '16px 24px'}} className="text-gray-700">{idx + 1}</td>
                    <td style={{padding: '16px 24px'}} className="font-medium text-gray-900">{product.name}</td>
                    <td style={{padding: '16px 24px'}} className="text-gray-700">{product.brandName}</td>
                    <td style={{padding: '16px 24px'}} className="font-medium text-gray-900">₹{product.price}</td>
                    <td style={{padding: '16px 24px'}}>
                      {(product.inStock === 1 || product.stock > 0) ? (
                        <span className="inline-block px-3 py-1 text-xs font-medium border bg-green-50 text-green-700 border-green-200">
                          In Stock
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-1 text-xs font-medium border bg-red-50 text-red-700 border-red-200">
                          Out of Stock
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}

export default ManageProduct