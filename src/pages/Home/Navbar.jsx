import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { BsCart2 } from 'react-icons/bs'
import { CiHeart, CiUser, CiSearch } from 'react-icons/ci'
import { HiMenu, HiX } from 'react-icons/hi'

const navLinks = [
    { to: '/men', label: 'Men' },
    { to: '/women', label: 'Women' },
    { to: '/gen-z', label: 'Gen Z' },
    { to: '/classic-luxury', label: 'Classic Luxury' },
]

const accountLinks = [
    { to: '/cart', label: 'My Cart', icon: <BsCart2 className="text-xl" /> },
    { to: '/wishlist', label: 'Wishlist', icon: <CiHeart className="text-xl" /> },
    { to: '/profile', label: 'Profile', icon: <CiUser className="text-xl" /> },
]

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    return (
        <div>
            {/* Navbar */}
            <div className="flex items-center h-14 px-4 md:px-8 border-b-2 relative justify-between bg-white">
                {/* Logo always left */}
                <div className="flex-shrink-0 flex items-center h-14">
                    <h1 className='love-light-regular text-3xl font-bold'>Euphoria</h1>
                </div>

                {/* Navigation Items - Hidden on mobile */}
                <div className="hidden md:flex gap-6 ml-8">
                    {navLinks.map(link => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className="text-sm text-gray-700 font-medium transition-colors py-2 border-b border-gray-100 md:border-0"
                            onClick={toggleMobileMenu}
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </div>

                {/* Search Bar - Hidden on mobile */}
                <div className="hidden md:flex items-center flex-1 justify-center mx-8 max-w-sm">
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full pl-4 pr-10 py-1.5 text-sm border border-gray-300 rounded-sm"
                        />
                        <CiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                    </div>
                </div>

                {/* Icons for desktop */}
                <div className="hidden md:flex gap-2 items-center ml-2">
                    <button className="p-2 bg-gray-100 rounded-md">
                        <CiHeart className="text-lg text-gray-700 transition-colors" />
                    </button>
                    <button className="p-2 bg-gray-100 rounded-md">
                        <BsCart2 className="text-lg text-gray-700 transition-colors" />
                    </button>
                    <button className="p-2 bg-gray-100 rounded-md">
                        <CiUser className="text-lg text-gray-700 transition-colors" />
                    </button>
                </div>

                {/* Hamburger Menu - Mobile Only (Right side) */}
                {!isMobileMenuOpen && (
                    <button
                        className="md:hidden"
                        onClick={toggleMobileMenu}
                        
                    >
                        <HiMenu />
                    </button>
                )}

            </div>

            {/* Mobile Sidebar Menu */}
            {isMobileMenuOpen && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-[#0000003d] bg-opacity-50 z-40 md:hidden"
                        onClick={toggleMobileMenu}
                    ></div>

                    {/* Sidebar */}
                    <div className="fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-lg md:hidden flex flex-col">
                        {/* Sidebar Header: Logo left, Close right, same height as navbar */}
                        <div className="flex items-center justify-between h-14 px-4 border-b">
                            <h1 className='love-light-regular text-2xl font-bold'>Euphoria</h1>
                            <button
                                onClick={toggleMobileMenu}
                                className="p-2 bg-gray-100 rounded-md"
                                style={{ height: '2.5rem', width: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <HiX className="text-xl text-gray-700" />
                            </button>
                        </div>

                        {/* Nav Items */}
                        <div className="flex-1 flex flex-col gap-2 p-4">
                            {navLinks.map(link => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    className="text-gray-700 hover:text-[var(--purple)] font-medium transition-colors py-2 border-b border-gray-100"
                                    onClick={toggleMobileMenu}
                                >
                                    {link.label}
                                </NavLink>
                            ))}

                            {/* Divider */}
                            <div className="border-t my-3"></div>

                            {/* Account options styled as cards */}
                            <div className="flex flex-col gap-3 mt-2">
                                {accountLinks.map(link => (
                                    <NavLink
                                        key={link.to}
                                        to={link.to}
                                        className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50 text-gray-700 font-medium transition-all border border-gray-100"
                                        onClick={toggleMobileMenu}
                                    >
                                        {link.icon}
                                        {link.label}
                                    </NavLink>
                                ))}
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