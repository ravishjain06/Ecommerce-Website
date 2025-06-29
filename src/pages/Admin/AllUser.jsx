import React from 'react'
import Sidebar from './Sidebar'
import { useGetAllUsersQuery } from '../../APIs/admin'

const AllUser = () => {
  const { data: users = [], isLoading, isError } = useGetAllUsersQuery();
  console.log(users)

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 lg:p-8">
        <h2 className="text-2xl font-light text-black tracking-wide mb-6">All Users</h2>
        <div className="overflow-x-auto rounded-lg shadow border border-gray-200 bg-white">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : isError ? (
            <div className="p-8 text-center text-red-500">Failed to load users.</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {users.map((user, idx) => (
                  <tr key={user._id || user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{idx + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{user.status || 'Active'}</span>
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

export default AllUser