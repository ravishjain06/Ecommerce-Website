import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { BsCart2 } from 'react-icons/bs'
import { CiHeart, CiUser, CiSearch } from 'react-icons/ci'
import { HiMenu, HiX } from 'react-icons/hi'
import { useSelector } from 'react-redux'
import { Button } from '../../components/ui/button'
// Update your navLinks to redirect to products with clothing filter
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

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    console.log(isAuthenticated);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    return (
        <div>
            {/* Navbar */}
            <div className="flex items-center h-14 px-4 md:px-8 border-b-2 relative justify-between bg-white">
                {/* Logo always left */}
                <NavLink to={"/"} className="flex-shrink-0 flex items-center h-14">
                    <h1 className='love-light-regular text-3xl font-bold'>Euphoria</h1>
                </NavLink>

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

                {isAuthenticated ?
                    <div className="hidden md:flex gap-2 items-center ml-2">
                        <button className="p-2 bg-gray-100 rounded-md">
                            <CiHeart className="text-lg text-gray-700 transition-colors" />
                        </button>
                        <NavLink to={"/cart"} className="p-2 bg-gray-100 rounded-md">
                            <BsCart2 className="text-lg text-gray-700 transition-colors" />
                        </NavLink>
                        <NavLink to={"/profile"} className="p-2 bg-gray-100 rounded-md">
                            <CiUser className="text-lg text-gray-700 transition-colors" />
                        </NavLink>
                    </div>
                    :
                    <div className='gap-5 hidden md:flex ml-auto'>
                        <NavLink to="/auth/login">
                            <Button className="bg-[var(--purple)] hover:bg-[var(--purple)] text-white cursor-pointer w-20">Login</Button>
                        </NavLink>
                        <NavLink to="/auth/register">
                            <Button className="bg-white hover:bg-white text-[#8A33FD] border-1 shadow-[var(--shadow)] font-semibold cursor-pointer w-24">Sign Up</Button>
                        </NavLink>
                    </div>


                }

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