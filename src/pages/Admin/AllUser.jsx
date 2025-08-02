import React from 'react'
import Sidebar from './Sidebar'
import { useGetAllUsersQuery, useToggleUserBlockMutation, useDeleteUserMutation } from '../../APIs/admin'
import { toast } from 'react-toastify'
import { Switch } from "@/components/ui/switch"
import { MdDelete } from "react-icons/md"

const getInitial = (name = '') => name ? name.charAt(0).toUpperCase() : '?';

const AllUser = () => {
  const { data: users = [], isLoading, isError } = useGetAllUsersQuery();
  const [toggleUserBlock, { isLoading: isToggling }] = useToggleUserBlockMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const handleBlockToggle = async (userId) => {
    try {
      const res = await toggleUserBlock({ userId }).unwrap();
      toast.success(res?.message || 'User status updated');
    } catch (err) {
      toast.error(err?.data?.error || 'Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser({ userId }).unwrap();
      toast.success("User deleted successfully.");
    } catch (err) {
      toast.error(err?.data?.error || "Failed to delete user.");
    }
  };

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
          <h2 className="text-2xl font-light text-black">All Users</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your users</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th style={{padding: '16px 24px'}} className="font-medium">User</th>
                <th style={{padding: '16px 24px'}} className="font-medium">Email</th>
                <th style={{padding: '16px 24px'}} className="font-medium">Role</th>
                <th style={{padding: '16px 24px'}} className="font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4}>
                    <div className="min-h-[120px] flex items-center justify-center bg-white">
                      <div className="w-6 h-6 border-2 border-black border-t-transparent animate-spin"></div>
                    </div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-red-500">Failed to load users.</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">No users found.</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id || user.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td style={{padding: '16px 24px'}} className="flex items-center gap-3">
                      {user.img ? (
                        <img
                          src={user.img}
                          alt={user.name}
                          className="w-9 h-9 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <span className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold text-lg border border-gray-200">
                          {getInitial(user.name)}
                        </span>
                      )}
                      <span className="font-medium text-gray-900">{user.name}</span>
                    </td>
                    <td style={{padding: '16px 24px'}} className="text-gray-700">{user.email}</td>
                    <td style={{padding: '16px 24px'}} className="text-gray-700">{user.role}</td>
                    <td style={{padding: '16px 24px'}}>
                      <div className="flex items-center gap-4">
                        <Switch
                          checked={user.isBlocked}
                          disabled={isToggling}
                          onCheckedChange={() => handleBlockToggle(user._id || user.id)}
                        />
                        <button
                          className="text-red-600 hover:bg-red-50 rounded-full p-2 transition"
                          onClick={() => handleDeleteUser(user._id || user.id)}
                          title="Delete User"
                          disabled={isDeleting}
                        >
                          <MdDelete size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default AllUser