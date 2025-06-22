import React from 'react';
import { FaShoppingBag, FaHeart, FaUser, FaSignOutAlt,FaWpforms  } from 'react-icons/fa';
import { useLogoutMutation } from '../../APIs/user';
import { useDispatch } from 'react-redux';
import { setLogout } from '../../features/userSlice';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { icon: FaUser, label: 'My Profile', href: '/profile' },
    { icon: FaShoppingBag, label: 'My Orders', href: '/orders' },
    { icon: FaHeart, label: 'Wishlist', href: '/wishlist' },
    { icon: FaWpforms ,label: 'Add Product', href: '/add-product' },

  ];

  const dispatch = useDispatch()
  const navigate = useNavigate();

  const [logout, { data, isLoading, error }] = useLogoutMutation();

  const handleLogout = async () => {
    console.log('Logout clicked');
    try {
      const result = await logout().unwrap();
      console.log("Logout Data:", result);
      // Assuming the logout API returns a success message or status
      navigate("/")
      dispatch(setLogout());
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="w-60 bg-white  h-fit">
      <div className="p-4">
        {/* Header */}
        <div className="mb-8 pb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Hello Ravish</h2>
          <p className="text-sm text-gray-600">Welcome to your account</p>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-2">
          {/* Menu Items */}
          {menuItems.map((item, index) => (
            <NavLink to={item.href} key={index} className='flex px-2 items-center cursor-pointer py-3 hover:bg-gray-100 rounded'>
              <item.icon className='w-4 h-4 text-gray-600 hover:text-gray-800 mr-3 flex-shrink-0' />
              <span className='text-sm text-gray-700 select-none flex-1'>{item.label}</span>
            </NavLink>
          ))}

          <div 
            className='flex items-center px-2 cursor-pointer py-3 hover:bg-gray-100 rounded'
            onClick={handleLogout}
          >
            <FaSignOutAlt className='w-4 h-4 text-gray-600 hover:text-gray-800 mr-3 flex-shrink-0' />
            <span className='text-sm text-gray-700 select-none flex-1 font-medium'>Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;