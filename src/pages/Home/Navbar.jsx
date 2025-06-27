import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { BsCart2 } from 'react-icons/bs'
import { CiHeart, CiUser, CiSearch } from 'react-icons/ci'
import { HiMenu, HiX } from 'react-icons/hi'
import { useSelector } from 'react-redux'
import { Button } from '../../components/ui/button'

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

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    console.log(isAuthenticated)


    

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen)
    }

    return (
        <div>
            {/* Top Bar */}
            <div className="bg-black text-white text-xs py-2 px-4 md:px-8">
                <div className="flex justify-between items-center max-w-7xl mx-auto">
                    <p className="font-light tracking-wide">Free shipping on orders over $99</p>
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
                        {navLinks.map(link => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) => 
                                    `text-sm font-light tracking-wide transition-all duration-300 py-2 relative ${
                                        isActive 
                                            ? 'text-black border-b-2 border-black' 
                                            : 'text-gray-600 hover:text-black'
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </div>

           

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-2">
                        
                        {/* Mobile Search Toggle */}
                        <button 
                            className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
                            onClick={toggleSearch}
                        >
                            <CiSearch className="text-xl text-gray-700" />
                        </button>

                        {isAuthenticated ? (
                            <div className="hidden md:flex gap-2 items-center">
                                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300 relative">
                                    <CiHeart className="text-xl text-gray-700" />
                                    <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        3
                                    </span>
                                </button>
                                <NavLink to={"/cart"} className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300 relative">
                                    <BsCart2 className="text-xl text-gray-700" />
                                    <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        2
                                    </span>
                                </NavLink>
                                <NavLink to={"/profile"} className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300">
                                    <CiUser className="text-xl text-gray-700" />
                                </NavLink>
                            </div>
                        ) : (
                            <div className='gap-3 hidden md:flex'>
                                <NavLink to="/auth/login">
                                    <Button className="bg-black hover:bg-gray-800 text-white font-light px-6 py-2 text-sm tracking-wide transition-all duration-300">
                                        LOGIN
                                    </Button>
                                </NavLink>
                                <NavLink to="/auth/register">
                                    <Button className="bg-white hover:bg-gray-50 text-black border border-gray-300 font-light px-6 py-2 text-sm tracking-wide transition-all duration-300">
                                        SIGN UP
                                    </Button>
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
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search for products..."
                                className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors duration-300"
                            />
                            <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <CiSearch className="text-lg text-gray-500" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Sidebar Menu */}
            {isMobileMenuOpen && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
                        onClick={toggleMobileMenu}
                    ></div>

                    {/* Sidebar */}
                    <div className="fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-2xl lg:hidden flex flex-col">
                        
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
                                <div className="p-6">
                                    <div className="space-y-3">
                                        <NavLink to="/auth/login" onClick={toggleMobileMenu}>
                                            <Button className="w-full bg-black hover:bg-gray-800 text-white font-light py-3 text-sm tracking-wide transition-all duration-300">
                                                LOGIN
                                            </Button>
                                        </NavLink>
                                        <NavLink to="/auth/register" onClick={toggleMobileMenu}>
                                            <Button className="w-full bg-white hover:bg-gray-50 text-black border border-gray-300 font-light py-3 text-sm tracking-wide transition-all duration-300">
                                                SIGN UP
                                            </Button>
                                        </NavLink>
                                    </div>
                                </div>
                            )}

                            {/* Quick Links */}
                            <div className="p-6">
                                <h3 className="text-xs font-medium tracking-[0.2em] text-gray-500 uppercase mb-4">
                                    Quick Links
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <a href="#" className="block text-gray-600 hover:text-black transition-colors duration-300">Track Order</a>
                                    <a href="#" className="block text-gray-600 hover:text-black transition-colors duration-300">Size Guide</a>
                                    <a href="#" className="block text-gray-600 hover:text-black transition-colors duration-300">Contact Us</a>
                                    <a href="#" className="block text-gray-600 hover:text-black transition-colors duration-300">Help Center</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <Outlet />
        </div>
    )
}

export default Navbar