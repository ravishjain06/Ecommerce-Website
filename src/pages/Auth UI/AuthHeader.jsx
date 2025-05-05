import { Link, Outlet } from 'react-router-dom'

const AuthHeader = () => {
  return (
    <div className='bg-red-400 text-black'>
      AuthHeader

     

      <Outlet />
    </div>
  )
}

export default AuthHeader
