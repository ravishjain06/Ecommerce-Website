import React from 'react';
import Sidebar from './Sidebar';
import { FaUser, FaEnvelope, FaShieldAlt, FaCamera, FaEdit, FaCheckCircle } from 'react-icons/fa';
import { Input } from "@/components/ui/input";
import { useUserProfileQuery } from '../../APIs/user';
import { useSelector } from "react-redux";

const Profile = () => {

    const { data: userProfile, isLoading, isError } = useUserProfileQuery();
    console.log(userProfile?.user?.name);



    return (
        <div className='min-h-screen'>

            <div className='max-w-7xl mx-auto bg-white'>
                <div className='flex'>
                   
                    <div className="hidden md:block">
                        <Sidebar />
                    </div>

                 
                    <div className='flex-1'>
                        <div className='p-4 md:p-6'>
                            {/* Header */}
                            <div className="mb-6">
                                <h1 className="text-2xl font-bold text-gray-800 mb-2">My Profile</h1>
                                <p className="text-gray-600">Manage your account information and preferences</p>
                            </div>

                            {/* Profile Card */}
                            <div className="bg-white rounded-lg overflow-hidden">
                                {/* Profile Header */}
                                <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-4 sm:px-6 md:px-8 py-8 md:py-12 relative">
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                                            {/* Profile Picture */}
                                            <div className="relative">
                                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                                                    <FaUser className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />
                                                </div>
                                            </div>

                                            {/* User Info */}
                                            <div className="text-white text-center sm:text-left">
                                                <h2 className="text-xl md:text-2xl font-bold mb-1">{userProfile?.user?.name}</h2>
                                                <p className="text-purple-100 mb-2 capitalize">{userProfile?.user?.role}</p>
                                                <div className="flex items-center justify-center sm:justify-start space-x-2">

                                                </div>
                                            </div>
                                        </div>

                                        {/* Edit Button */}
                                        <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2">
                                            <FaEdit className="w-4 h-4" />
                                            <span>Edit Profile</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Profile Details */}
                                <div className="p-4 sm:p-6 md:p-8">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Account Information</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                        {/* Full Name */}
                                        <div className="grid w-full items-center gap-1.5">
                                            <label htmlFor="name" className="text-sm text-gray-600">

                                                Full Name
                                            </label>
                                            <Input
                                                id="name"
                                                type="text"
                                                defaultValue={userProfile?.user?.name || "Not provided"}
                                                className="w-full"
                                                disabled
                                            />
                                        </div>

                                        {/* Email */}
                                        <div className="grid w-full items-center gap-1.5">
                                            <label htmlFor="email" className="text-sm text-gray-600">

                                                Email Address
                                            </label>
                                            <Input
                                                id="email"
                                                type="email"
                                                defaultValue={userProfile?.user?.email || "Not provided"}
                                                className="w-full"
                                                disabled
                                            />
                                        </div>

                                        {/* Role */}
                                        <div className="grid w-full items-center gap-1.5">
                                            <label htmlFor="role" className="text-sm text-gray-600">

                                                Account Role
                                            </label>
                                            <Input
                                                id="role"
                                                type="text"
                                                defaultValue={userProfile?.user?.role || "Not provided"}
                                                className="w-full capitalize"
                                                disabled
                                            />
                                        </div>

                                        {/* User ID */}
                                        <div className="grid w-full items-center gap-1.5">
                                            <label htmlFor="userId" className="text-sm text-gray-600">
                                                User ID
                                            </label>
                                            <Input
                                                id="userId"
                                                type="text"
                                                defaultValue={userProfile?.user?._id || "Not provided"}
                                                className="w-full font-mono text-sm"
                                                disabled
                                            />
                                        </div>
                                    </div>

                                    {/* Account Status */}
                                    <div className="mt-8 pt-6 ">
                                        <h4 className="text-lg font-medium text-gray-900 mb-4">Account Status</h4>
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-green-100 text-green-800">
                                                <FaCheckCircle className="w-4 h-4" />
                                                <span className="font-medium">Verified Account</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;