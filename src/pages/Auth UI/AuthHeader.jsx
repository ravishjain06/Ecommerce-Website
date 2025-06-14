import { NavLink, Outlet } from 'react-router-dom'
import { Button } from '../../components/ui/button'

const AuthHeader = () => {
  return (
    <div>
      <div className='flex justify-between items-center h-16 px-15 border-b-2 relative'>
        
        <div className='w-full md:w-auto text-center md:text-left absolute left-1/2 -translate-x-1/2 md:relative md:left-0 md:translate-x-0'>
          <h1 className='love-light-regular text-3xl font-bold'>Euphoria</h1>
        </div>

      
        <div className='gap-5 hidden md:flex ml-auto'>
          <NavLink to="/auth/login">
            <Button className="bg-[var(--purple)] hover:bg-[var(--purple)] text-white cursor-pointer w-20">Login</Button>
          </NavLink>
          <NavLink to="/auth/register">
            <Button className="bg-white hover:bg-white text-[#8A33FD] border-1 shadow-[var(--shadow)] font-semibold cursor-pointer w-24">Sign Up</Button>
          </NavLink>
        </div>
      </div>

      <Outlet />
    </div>
  )
}

export default AuthHeader
