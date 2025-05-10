import { NavLink, Outlet } from 'react-router-dom'
import { Button } from '../../components/ui/button'

const AuthHeader = () => {
  return (
    <div className=''>
      <div className='flex justify-between items-center h-16 px-15 border-b-2'>
        <div>
          <h1 className='love-light-regular text-3xl font-bold '>Euphoria</h1>
        </div>
        <div className='flex gap-5'>
          <NavLink to="/login">
            <Button className="bg-[var(--purple)] hover:bg-[var(--purple)] text-white  cursor-pointer w-20">Login</Button>
          </NavLink>
          <NavLink to="/register">
            <Button className="bg-white hover:bg-white text-[#8A33FD] border-1 shadow-[var(--shadow)] font-semibold cursor-pointer w-24">Sign Up</Button>
          </NavLink>
        </div>
      </div>


      <Outlet />
    </div>
  )
}

export default AuthHeader
