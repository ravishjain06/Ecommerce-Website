import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { User, Mail, Shield, Calendar, Settings, Camera, Edit3, Eye, EyeOff, ChevronRight, Phone } from 'lucide-react';
import { LuLoaderCircle } from 'react-icons/lu';
import { Input } from "@/components/ui/input";
import { useUserProfileQuery, useUpdateProfileMutation, useLogoutMutation } from '../../APIs/user';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { setLogout } from '../../features/userSlice';
import { toast } from 'react-toastify';
import { FaSignOutAlt } from 'react-icons/fa';

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        profilePicture: null
    });
    const [previewImage, setPreviewImage] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { data: userProfile, isLoading, isError, refetch } = useUserProfileQuery();
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
    const [logout] = useLogoutMutation();

    const user = userProfile?.user;

    const handleLogout = async () => {
        try {
            await logout().unwrap();
            navigate("/")
            dispatch(setLogout());
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    // Initialize form data when user data is loaded
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                password: '',
                profilePicture: null
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                profilePicture: file
            }));

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        try {
            const updateData = new FormData();
            updateData.append('name', formData.name);
            updateData.append('email', formData.email);
            updateData.append('phone', formData.phone);

            if (formData.password) {
                updateData.append('password', formData.password);
            }

            if (formData.profilePicture) {
                updateData.append('profilePicture', formData.profilePicture);
            }

            await updateProfile(updateData).unwrap();
            toast.success('Profile updated successfully!');
            setIsEditing(false);
            setPreviewImage(null);
            setFormData(prev => ({ ...prev, password: '', profilePicture: null }));
            refetch(); // Refresh user data
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to update profile');
        }
    };

    const handleCancel = () => {
        // Reset form data
        setFormData({
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || '',
            password: '',
            profilePicture: null
        });
        setPreviewImage(null);
        setIsEditing(false);
    };

    if (isLoading) {
        return (
            <div className='min-h-screen bg-gray-50'>
                <div className='max-w-7xl mx-auto'>
                    <div className='flex'>
                        <div className="hidden md:block">
                            <Sidebar />
                        </div>
                        <div className='flex-1 flex items-center justify-center'>
                            <div className="text-center">
                                <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-gray-600 font-light">Loading profile...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-50'>
            <div className='max-w-7xl mx-auto'>
                <div className='flex flex-col md:flex-row'>
                    {/* Sidebar: always visible, responsive layout inside */}
                    <div>
                        <Sidebar />
                    </div>

                    <div className='flex-1 p-4 md:p-6 lg:p-8'>
                        {/* Profile Header and Edit Button OUTSIDE the card */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4 max-w-2xl mx-auto">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-light text-black mb-2">Profile Settings</h1>
                                <p className="text-gray-600 font-light">Manage your personal information and account preferences</p>
                            </div>
                            <button
                                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                disabled={isUpdating}
                                className={`px-4 py-2 text-sm font-medium transition-colors duration-300 flex items-center gap-2 disabled:opacity-50 ${isEditing
                                        ? 'bg-green-600 text-white hover:bg-green-700'
                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <Edit3 className="w-4 h-4" />
                                {isUpdating ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}
                            </button>
                        </div>
                        <div className="bg-white border border-gray-200 max-w-2xl mx-auto">
                            {/* Profile Picture */}
                            <div className="text-center mb-6 pt-8">
                                <div className="relative inline-block">
                                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4 mx-auto overflow-hidden">
                                        {previewImage ? (
                                            <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                        ) : user?.profilePicture ? (
                                            <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-10 h-10 text-gray-500" />
                                        )}
                                    </div>
                                    {isEditing && (
                                        <label className="absolute -bottom-1 right-6 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors cursor-pointer">
                                            <Camera className="w-4 h-4" />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>
                                <h3 className="text-lg font-medium text-black mb-1">{formData.name || user?.name || 'User Name'}</h3>
                            </div>
                            {/* Quick Stats */}
                            <div className="flex flex-col md:flex-row md:space-x-4 mb-8 px-6">
                                <div className="flex-1  flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4 md:mb-0">
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                                        <span className="text-sm text-gray-600">Member since</span>
                                    </div>
                                    <span className="text-sm font-medium text-black">
                                        {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}
                                    </span>
                                </div>
                                <div className="flex-1 flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center">
                                        <Shield className="w-4 h-4 text-gray-500 mr-2" />
                                        <span className="text-sm text-gray-600">Account Status</span>
                                    </div>
                                    <span className="text-sm font-medium text-green-600">Verified</span>
                                </div>
                            </div>
                            {/* Personal Information */}
                            <div className="px-6 pb-8">
                                <h4 className="text-lg font-medium text-black mb-6 flex items-center">
                                    <User className="w-5 h-5 mr-2" />
                                    Personal Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                        <Input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className={`w-full ${isEditing ? 'bg-white border-gray-300 focus:border-black' : 'bg-gray-50 border-gray-200'} transition-colors`}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                        <div className="relative">
                                            <Input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className={`w-full pr-10 ${isEditing ? 'bg-white border-gray-300 focus:border-black' : 'bg-gray-50 border-gray-200'} transition-colors`}
                                            />
                                            <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                        <div className="relative">
                                            <Input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                placeholder="Add phone number"
                                                disabled={!isEditing}
                                                className={`w-full pr-10 ${isEditing ? 'bg-white border-gray-300 focus:border-black' : 'bg-gray-50 border-gray-200'} transition-colors`}
                                            />
                                            <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                                        <Input
                                            type="date"
                                            disabled={!isEditing}
                                            className={`w-full ${isEditing ? 'bg-white border-gray-300 focus:border-black' : 'bg-gray-50 border-gray-200'} transition-colors`}
                                        />
                                    </div>
                                </div>
                                {/* Action Buttons */}
                                {isEditing && (
                                    <div className="mt-8 pt-6 border-t border-gray-200">
                                        <div className="flex gap-4">
                                            <button
                                                onClick={handleSave}
                                                disabled={isUpdating}
                                                className="px-6 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors text-sm disabled:opacity-50 flex items-center gap-2"
                                            >
                                                {isUpdating && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                                                {isUpdating ? 'Saving...' : 'Save Changes'}
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                disabled={isUpdating}
                                                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm disabled:opacity-50"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:hidden p-4">
                    <button
                        onClick={handleLogout}
                        className="w-full bg-black text-white font-medium py-3 px-4 hover:bg-red-700 transition-colors text-sm tracking-wide flex items-center justify-center gap-2"
                    >
                        <FaSignOutAlt/>
                        Logout
                    </button>
                </div>
            </div>

            {/* Loading overlay */}
            {isUpdating && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm mx-4 border border-gray-100">
                        <div className="text-center">
                            {/* Simple LuLoaderCircle */}
                            <div className="flex justify-center mb-6">
                                <LuLoaderCircle className="w-12 h-12 text-black animate-spin" />
                            </div>

                            <h3 className="text-lg font-medium text-black mb-2">Updating Profile</h3>
                            <p className="text-sm text-gray-600 font-light leading-relaxed">
                                Please wait while we save your changes...
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;