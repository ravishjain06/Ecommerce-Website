import { NavLink, Outlet } from 'react-router-dom'

const AuthHeader = () => {
  return (
    <div>
      {/* Desktop Auth Header - hidden on mobile */}
      <div className="hidden md:block">
        {/* Top Bar */}
        <div className="bg-black text-white text-xs py-2 px-4 md:px-8">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <p className="font-light tracking-wide">Secure authentication powered by W E A R E X</p>
            <div className="hidden md:flex items-center gap-4">
              <span>Need help? Call +91 98765 43210</span>
              <span>|</span>
              <span>Support Center</span>
            </div>
          </div>
        </div>

        {/* Main Auth Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="flex justify-between items-center h-16 px-4 md:px-8 max-w-7xl mx-auto">
            {/* Logo */}
            <NavLink to="/" className="flex-shrink-0 flex items-center">
              <h1 className='text-2xl md:text-3xl font-light tracking-wide text-black'>
                W E A R E X
              </h1>
            </NavLink>

            {/* Auth Buttons */}
            <div className='flex gap-3'>
              <NavLink to="/auth/login">
                <button className="bg-black hover:bg-gray-800 text-white font-light px-6 py-2 text-sm tracking-wide transition-all duration-300">
                  LOGIN
                </button>
              </NavLink>
              <NavLink to="/auth/register">
                <button className="bg-white hover:bg-gray-50 text-black border border-gray-300 font-light px-6 py-2 text-sm tracking-wide transition-all duration-300">
                  SIGN UP
                </button>
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Logo Only */}
      <div className="block md:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex justify-center items-center h-16 px-4">
          <NavLink to="/" className="flex-shrink-0 flex items-center">
            <h1 className='text-2xl font-light tracking-wide text-black'>
              W E A R E X
            </h1>
          </NavLink>
        </div>
      </div>

      <Outlet />
    </div>
  )
}

export default AuthHeader