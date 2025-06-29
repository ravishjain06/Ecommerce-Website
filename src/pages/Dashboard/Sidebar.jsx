import React from 'react';
import { FaShoppingBag, FaHeart, FaUser, FaSignOutAlt, FaWpforms } from 'react-icons/fa';
import { useLogoutMutation } from '../../APIs/user';
import { useDispatch, useSelector } from 'react-redux';
import { setLogout } from '../../features/userSlice';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { icon: FaUser, label: 'My Profile', href: '/profile' },
    { icon: FaShoppingBag, label: 'My Orders', href: '/orders' },
    { icon: FaHeart, label: 'Wishlist', href: '/wishlist' },

  ];

  const dispatch = useDispatch()
  const navigate = useNavigate();

  const user = useSelector(state => state?.auth?.user);

  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      navigate("/")
      dispatch(setLogout());
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="w-full md:w-80 bg-white border-r border-gray-200 h-fit md:h-screen">
      <div className="p-6 lg:p-8">
        {/* Header - hidden on mobile */}
        <div className="mb-8 hidden md:block">
          <p className="text-xs font-medium tracking-[0.3em] text-gray-500 uppercase mb-2">
            Account Dashboard
          </p>
          <h2 className='text-2xl font-light text-black tracking-wide mb-4'>
            Hello, {user?.name || 'User'}   
          </h2>
          <p className="text-sm text-gray-600 font-light">Welcome to your account</p>
        </div>


        {/* Mobile: Only My Orders and Wishlist */}
        <div className="grid grid-cols-2 gap-2 mb-1 md:hidden m-[-5px]">
          {[
            { icon: FaShoppingBag, label: 'My Orders', href: '/orders' },
            { icon: FaHeart, label: 'Wishlist', href: '/wishlist' },
          ].map((item, index) => (
            <NavLink
              to={item.href}
              key={index}
              className="group flex items-center justify-center p-4  bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-300"
            >
              <item.icon className="w-5 h-5 mr-2 text-gray-500 group-hover:text-gray-700" />
              <span className="text-sm font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Desktop: All menu items */}
        <div className="hidden md:flex md:flex-col md:space-y-2 mb-8">
          {menuItems.map((item, index) => (
            <NavLink
              to={item.href}
              key={index}
              className='group flex items-center p-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-all duration-300'
            >
              <item.icon className='w-5 h-5 mr-3 text-gray-500 group-hover:text-gray-700' />
              <span className='text-sm font-medium'>{item.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Logout Section - only on desktop */}
        <div className="border-t border-gray-200 pt-6 hidden md:block">
          <div
            className='group flex items-center p-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-300 cursor-pointer'
            onClick={handleLogout}
          >
            <FaSignOutAlt className='w-5 h-5 mr-3 text-gray-500 group-hover:text-red-500' />
            <span className='text-sm font-medium'>Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;