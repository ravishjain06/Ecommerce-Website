import { useState, useEffect, useRef } from 'react'
import { NavLink, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { CiShoppingCart } from "react-icons/ci";
import { CiHeart, CiUser, CiSearch } from 'react-icons/ci'
import { HiMenu, HiX } from 'react-icons/hi'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from '../../components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { useGetCartQuery } from '../../APIs/cart'
import { useLogoutMutation } from '../../APIs/user' // Add this import
import { setLogout } from '../../features/userSlice' // Add this import
import { FaSignOutAlt } from 'react-icons/fa'; // already imported
import { MdDashboard } from "react-icons/md"; // Add this import for dashboard icon
import { BiUserCircle } from "react-icons/bi"; // Add this for default avatar

const navLinks = [
    { to: '/product?clothing=mens', label: 'Men' },
    { to: '/product?clothing=women', label: 'Women' },
    { to: '/product?clothing=gen-z', label: 'Gen Z' },
    { to: '/product?clothing=classic-luxury', label: 'Classic Luxury' },
]

const accountLinks = [
    { to: '/cart', label: 'My Cart', icon: <CiShoppingCart  className="text-xl" /> },
    { to: '/wishlist', label: 'Wishlist', icon: <CiHeart className="text-xl" /> },
    { to: '/profile', label: 'Profile', icon: <CiUser className="text-xl" /> },
]

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [searchInput, setSearchInput] = useState('')
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false) // <-- Add this
    const [searchParams] = useSearchParams()
    const navigate = useNavigate(); // Add navigate
    const dispatch = useDispatch() // Add this

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const user = useSelector((state) => state.auth.user);

    console.log("User:", user);

    const role = user?.role;

    // Get cart data
    const { data: cartData } = useGetCartQuery(undefined, {
        skip: !isAuthenticated // Only fetch if user is authenticated
    });
    
    // Add logout mutation
    const [logout] = useLogoutMutation(); // already present
    
    // Calculate cart item count
    const cartItemCount = cartData?.data?.items?.length || 0;

    const location = useLocation();
    const profileMenuRef = useRef(null);

    // Helper to get current clothing param
    const getActiveClothing = () => {
        const params = new URLSearchParams(location.search);
        return params.get('clothing');
    };
    const activeClothing = getActiveClothing();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen)
    }

    // Handle search submit
    const handleMobileSearch = (e) => {
        e.preventDefault();
        let url = '/product?';
        if (activeClothing) url += `clothing=${activeClothing}&`;
        if (searchInput) url += `search=${encodeURIComponent(searchInput)}`;
        else url = '/product'; // fallback if no search
        navigate(url);
        setIsSearchOpen(false);
    };

    // Logout handler
    const handleLogout = async () => {
        try {
            await logout().unwrap();
            dispatch(setLogout());
            setIsProfileMenuOpen(false);
            navigate("/");
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    // Handle outside click for profile menu
    useEffect(() => {
        function handleClickOutside(event) {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setSearchInput(searchParams.get('search') || '');
    }, [searchParams]);

    return (
        <div>
            {/* Top Bar */}
            <div className="bg-black text-white text-xs py-2 px-4 md:px-8">
                <div className="flex justify-between items-center max-w-7xl mx-auto">
                    <p className="font-light tracking-wide">Free shipping on orders over ₹500</p>
                    <div className="hidden md:flex items-center gap-4">
                        <span>Need help? Call +91 98765 43210</span>
                        <span>|</span>
                        <span>Track Order</span>
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="flex items-center h-16 px-4 md:px-8 justify-between max-w-7xl mx-auto">

                    {/* Logo */}
                    <NavLink to={"/"} className="flex-shrink-0 flex items-center">
                        <h1 className='text-2xl md:text-3xl font-light tracking-wide text-black'>
                            W E A R E X
                        </h1>
                    </NavLink>

                    {/* Navigation Items - Desktop */}
                    <div className="hidden lg:flex items-center gap-8 ml-12">
                        {navLinks.map(link => {
                            // Extract clothing value from link.to
                            const clothingValue = new URLSearchParams(link.to.split('?')[1]).get('clothing');
                            const isActive = activeClothing === clothingValue;
                            return (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    className={
                                        `text-sm font-light tracking-wide transition-all duration-300 py-2 relative ${isActive
                                            ? 'text-black border-b-2 border-black'
                                            : 'text-gray-600 hover:text-black'
                                        }`
                                    }
                                >
                                    {link.label}
                                </NavLink>
                            );
                        })}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-2">

                        {/* Mobile Search Toggle */}
                        {location.pathname !== "/product" && (
                            <button
                                className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
                                onClick={toggleSearch}
                            >
                                <CiSearch className="text-xl text-gray-700" />
                            </button>
                        )}

                        {isAuthenticated ? (
                            <div className="hidden md:flex gap-2 items-center">
                                <NavLink to={"/wishlist"} className="flex items-center justify-center p-2 hover:bg-gray-100 rounded-full transition-colors duration-300 relative">
                                    <CiHeart className="text-xl text-gray-700" />
                                </NavLink>
                                <NavLink to={"/cart"} className="flex items-center justify-center p-2 hover:bg-gray-100 rounded-full transition-colors duration-300 relative">
                                    <CiShoppingCart className="text-xl text-gray-700" />
                                    {cartItemCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center min-w-[20px] border-2 border-white">
                                            {cartItemCount > 99 ? '99+' : cartItemCount}
                                        </span>
                                    )}
                                </NavLink>
                                {/* Avatar Icon with Dropdown */}
                                <div className="relative flex items-center justify-center" ref={profileMenuRef}>
                                    <button
                                        className="flex items-center justify-center cursor-pointer p-2 rounded-full transition-colors duration-300"
                                        onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                                    >
                                        {user?.profilePicture ? (
                                            <img
                                                src={user.profilePicture}
                                                alt="avatar"
                                                className="w-7 h-7 rounded-full object-cover border border-gray-200"
                                            />
                                        ) : (
                                            <img
                                                src="/default-avatar.png"
                                                alt="default avatar"
                                                className="w-7 h-7 rounded-full object-cover border border-gray-200"
                                            />
                                        )}
                                    </button>
                                    {isProfileMenuOpen && (
                                        <div
                                            className="absolute right-0 top-full mt-3 w-52 bg-white border border-gray-200 rounded-lg shadow-xl z-50"
                                            style={{ minWidth: '200px' }}
                                        >
                                            <NavLink
                                                to="/profile"
                                                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 font-light tracking-wide text-sm flex items-center gap-2"
                                                onClick={() => setIsProfileMenuOpen(false)}
                                            >
                                                <BiUserCircle className="text-lg" />
                                                Profile
                                            </NavLink>
                                            {role === 'admin' && user?.category !== 'trouser' && (
                                                <NavLink
                                                    to="/admin/dashboard"
                                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 font-light tracking-wide text-sm flex items-center gap-2"
                                                    onClick={() => setIsProfileMenuOpen(false)}
                                                >
                                                    <MdDashboard className="text-lg" />
                                                    Dashboard
                                                </NavLink>
                                            )}
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 font-light tracking-wide text-sm flex items-center gap-2"
                                            >
                                                <FaSignOutAlt className="text-lg" />
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className='gap-3 hidden md:flex'>
                                <NavLink to="/auth/login">
                                    <button className="bg-black hover:bg-gray-800 text-white font-light px-4 py-1.5 text-xs tracking-wide transition-all duration-300 w-full md:w-auto">
                                        LOGIN
                                    </button>
                                </NavLink>
                                <NavLink to="/auth/register">
                                    <button className="bg-white hover:bg-gray-50 text-black border border-gray-300 font-light px-4 py-1.5 text-xs tracking-wide transition-all duration-300 w-full md:w-auto">
                                        SIGN UP
                                    </button>
                                </NavLink>
                            </div>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
                            onClick={toggleMobileMenu}
                        >
                            <HiMenu className="text-xl text-gray-700" />
                        </button>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                {isSearchOpen && (
                    <div className="md:hidden px-4 pb-4 border-t border-gray-200">
                        <form className="relative" onSubmit={handleMobileSearch}>
                            <input
                                type="text"
                                placeholder="Search for products..."
                                className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-[16px] focus:outline-none focus:border-black transition-colors duration-300"
                                value={searchInput}
                                onChange={e => setSearchInput(e.target.value)}
                            />
                            <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <CiSearch className="text-lg text-gray-500" />
                            </button>
                        </form>
                    </div>
                )}
            </div>

            {/* Mobile Sidebar Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Overlay */}
                        <div
                            className="fixed inset-0 bg-[#0000005e] bg-opacity-50 z-50 lg:hidden"
                            onClick={toggleMobileMenu}
                        ></div>

                        {/* Sidebar with animation */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween', duration: 0.35 }}
                            className="fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-2xl lg:hidden flex flex-col"
                        >

                            {/* Sidebar Header */}
                            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                                <h1 className='text-xl font-light tracking-wide text-black'>MENU</h1>
                                <button
                                    onClick={toggleMobileMenu}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
                                >
                                    <HiX className="text-xl text-gray-700" />
                                </button>
                            </div>

                            {/* Sidebar Content */}
                            <div className="flex-1 overflow-y-auto">

                                {/* Navigation Links */}
                                <div className="p-6 border-b border-gray-200">
                                    <h3 className="text-xs font-medium tracking-[0.2em] text-gray-500 uppercase mb-4">
                                        Categories
                                    </h3>
                                    <div className="space-y-3">
                                        {navLinks.map(link => (
                                            <NavLink
                                                key={link.to}
                                                to={link.to}
                                                className="block text-gray-700 hover:text-black font-light transition-colors duration-300 py-2"
                                                onClick={toggleMobileMenu}
                                            >
                                                {link.label}
                                            </NavLink>
                                        ))}
                                    </div>
                                </div>

                                {/* Account Section */}
                                {isAuthenticated && (
                                    <div className="p-6 border-b border-gray-200">
                                        <h3 className="text-xs font-medium tracking-[0.2em] text-gray-500 uppercase mb-4">
                                            Account
                                        </h3>
                                        <div className="space-y-3">
                                            {accountLinks.map(link => (
                                                <NavLink
                                                    key={link.to}
                                                    to={link.to}
                                                    className="flex items-center gap-3 text-gray-700 hover:text-black font-light transition-colors duration-300 py-2 relative"
                                                    onClick={toggleMobileMenu}
                                                >
                                                    <div className="relative">
                                                        {link.icon}
                                                        {/* Cart Badge for Mobile Menu */}
                                                        {link.to === '/cart' && cartItemCount > 0 && (
                                                            <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-medium rounded-full h-4 w-4 flex items-center justify-center min-w-[16px] text-[10px]">
                                                                {cartItemCount > 99 ? '99+' : cartItemCount}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {link.label}
                                                </NavLink>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Auth Buttons for Mobile */}
                                {!isAuthenticated ? (
                                    <div className="p-6">
                                        <div className="space-y-3">
                                            <NavLink to="/auth/login" onClick={toggleMobileMenu}>
                                                <button className="w-full mb-2 bg-black hover:bg-gray-800 text-white font-light py-3 text-sm tracking-wide transition-all duration-300">
                                                    LOGIN
                                                </button>
                                            </NavLink>
                                            <NavLink to="/auth/register" onClick={toggleMobileMenu}>
                                                <button className="w-full bg-white hover:bg-gray-50 text-black border border-gray-300 font-light py-3 text-sm tracking-wide transition-all duration-300">
                                                    SIGN UP
                                                </button>
                                            </NavLink>
                                        </div>
                                    </div>
                                ) : (
                                    /* Logout Button for Authenticated Users */
                                    <div className="p-6">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full bg-black text-white font-light py-3 text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2"
                                        >
                                            <FaSignOutAlt className="text-sm" />
                                            LOGOUT
                                        </button>
                                    </div>
                                )}

                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <Outlet />
        </div>
    )
}

export default Navbar