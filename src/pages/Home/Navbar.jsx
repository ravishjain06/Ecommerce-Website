import { useState, useEffect } from 'react'
import { NavLink, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { BsCart2 } from 'react-icons/bs'
import { CiHeart, CiUser, CiSearch } from 'react-icons/ci'
import { HiMenu, HiX } from 'react-icons/hi'
import { useSelector } from 'react-redux'
import { Button } from '../../components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
    { to: '/product?clothing=mens', label: 'Men' },
    { to: '/product?clothing=women', label: 'Women' },
    { to: '/product?clothing=gen-z', label: 'Gen Z' },
    { to: '/product?clothing=classic-luxury', label: 'Classic Luxury' },
]

const accountLinks = [
    { to: '/cart', label: 'My Cart', icon: <BsCart2 className="text-xl" /> },
    { to: '/wishlist', label: 'Wishlist', icon: <CiHeart className="text-xl" /> },
    { to: '/profile', label: 'Profile', icon: <CiUser className="text-xl" /> },
]

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [searchInput, setSearchInput] = useState('') // Use for input value
    const [searchParams] = useSearchParams()
    const navigate = useNavigate(); // Add navigate

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);


    const location = useLocation();

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
                                <NavLink to={"/wishlist"} className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300 relative">
                                    <CiHeart className="text-xl text-gray-700" />
                                </NavLink>
                                <NavLink to={"/cart"} className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300 relative">
                                    <BsCart2 className="text-xl text-gray-700" />

                                </NavLink>
                                <NavLink to={"/profile"} className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300">
                                    <CiUser className="text-xl text-gray-700" />
                                </NavLink>
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
                                                    className="flex items-center gap-3 text-gray-700 hover:text-black font-light transition-colors duration-300 py-2"
                                                    onClick={toggleMobileMenu}
                                                >
                                                    {link.icon}
                                                    {link.label}
                                                </NavLink>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Auth Buttons for Mobile */}
                                {!isAuthenticated && (
                                    <div className="p-6 ">
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