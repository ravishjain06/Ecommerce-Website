import React from 'react';
import { MdDashboard } from "react-icons/md";
import { FaHeart, FaUser, FaSignOutAlt, FaWpforms, FaUsers, FaPlus, FaListOl } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { icon: MdDashboard, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: FaUsers, label: 'All Users', href: '/admin/users' },
    { icon: FaPlus, label: 'Add Product', href: '/admin/add-product' },
    { icon: FaWpforms, label: 'Manage Products', href: '/admin/manage-product' },
    { icon: FaListOl, label: 'Total Orders', href: '/admin/orders' },
  ];

  const mobileItems = [
    { icon: FaListOl, label: 'Orders', href: '/admin/orders' },
    { icon: FaPlus, label: 'Add Product', href: '/admin/add-product' },
  ];

  return (
    <div className="w-full md:w-72 bg-white border-r border-gray-100 h-fit md:h-screen">
      <div className="p-4 md:p-6">
        
        {/* Header - Desktop Only */}
        <div className="mb-8 hidden md:block border-b border-gray-50 pb-6">
          <div className="mb-1">
            <span className="text-xs font-medium tracking-widest text-gray-400 uppercase">
              Admin
            </span>
          </div>
          <h2 className="text-xl font-light text-black tracking-tight mb-1">
            Dashboard
          </h2>
          <p className="text-sm text-gray-500 font-light">
            Store Management
          </p>
        </div>

        {/* Mobile Navigation - 2 Column Grid */}
        <div className="grid grid-cols-2 gap-3 md:hidden">
          {mobileItems.map((item, index) => (
            <NavLink
              to={item.href}
              key={index}
              className={({ isActive }) =>
                `group flex flex-col items-center justify-center p-4 border transition-all duration-200 ${
                  isActive
                    ? 'bg-black text-white border-black'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 border-gray-200'
                }`
              }
            >
              <item.icon className="w-5 h-5 mb-2" />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Desktop Navigation - Vertical List */}
        <nav className="hidden md:block space-y-1">
          {menuItems.map((item, index) => (
            <NavLink
              to={item.href}
              key={index}
              className={({ isActive }) =>
                `group flex items-center px-3 py-2.5 border text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-black text-white border-black'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-transparent hover:border-gray-200'
                }`
              }
            >
              <item.icon className="w-4 h-4 mr-3" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Optional: Admin Profile Section - Desktop Only */}
        <div className="hidden md:block mt-8 pt-6 border-t border-gray-50">
          <div className="flex items-center px-3 py-2">
            <div className="w-8 h-8 bg-gray-100 border border-gray-200 flex items-center justify-center mr-3">
              <FaUser className="w-4 h-4 text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Admin</p>
              <p className="text-xs text-gray-500">admin@store.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;