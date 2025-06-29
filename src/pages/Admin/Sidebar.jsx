import React from 'react';
import { FaShoppingBag, FaHeart, FaUser, FaSignOutAlt, FaWpforms, FaUsers, FaPlus, FaListOl } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    
    { icon: FaUsers, label: 'All Users', href: '/admin/users' },
    { icon: FaPlus, label: 'Add Product', href: '/admin/add-product' },
    { icon: FaWpforms, label: 'Manage Products', href: '/admin/products' },
    { icon: FaListOl, label: 'Total Orders', href: '/admin/orders' },
   
  ];

  return (
    <div className="w-full md:w-80 bg-white border-r border-gray-200 h-fit md:h-screen">
      <div className="p-6 lg:p-8">
        {/* Header - hidden on mobile */}
        <div className="mb-8 hidden md:block">
          <p className="text-xs font-medium tracking-[0.3em] text-gray-500 uppercase mb-2">
            Admin Dashboard
          </p>
          <h2 className='text-2xl font-light text-black tracking-wide mb-4'>
            Welcome, Admin
          </h2>
          <p className="text-sm text-gray-600 font-light">Manage your store</p>
        </div>

        {/* Mobile: Only Orders and Add Product */}
        <div className="grid grid-cols-2 gap-2 mb-1 md:hidden m-[-5px]">
          { [
              { icon: FaListOl, label: 'Orders', href: '/admin/orders' },
              { icon: FaPlus, label: 'Add Product', href: '/admin/add-product' },
            ].map((item, index) => (
              <NavLink
                to={item.href}
                key={index}
                className="group flex items-center justify-center p-4 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-300"
              >
                <item.icon className="w-5 h-5 mr-2 text-gray-500 group-hover:text-gray-700" />
                <span className="text-sm font-medium">{item.label}</span>
              </NavLink>
            )) }
        </div>

        {/* Desktop: All menu items */}
        <div className="hidden md:flex md:flex-col md:space-y-2 mb-8">
          { menuItems.map((item, index) => (
              <NavLink
                to={item.href}
                key={index}
                className='group flex items-center p-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-all duration-300'
              >
                <item.icon className='w-5 h-5 mr-3 text-gray-500 group-hover:text-gray-700' />
                <span className='text-sm font-medium'>{item.label}</span>
              </NavLink>
            )) }
        </div>

  
      </div>
    </div>
  );
};

export default Sidebar;