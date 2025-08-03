import React, { useState } from 'react';
import { Input } from "@/components/ui/input"
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useLoginMutation } from '../../APIs/user';
import { toast } from 'react-toastify';
import { TbLoader3 } from "react-icons/tb";
import { useDispatch } from 'react-redux';
import { setUser, setAccessToken } from '../../features/userSlice';

const Login = () => {
  const navigate = useNavigate()
  const [show, setShow] = useState(false)
  const dispatch = useDispatch()
  const handleShow = () => setShow(!show)
  const [form, setform] = useState({ email: "", password: "" })
  const handleChange = (e) => setform({ ...form, [e.target.name]: e.target.value })
  const [login, { isLoading }] = useLoginMutation()

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email: form.email, password: form.password })
      if (res?.data?.success) {

        dispatch(setUser(res?.data?.user))
        dispatch(setAccessToken(res?.data?.accessToken));
        navigate('/');
      } else if (res?.error) {
        toast.error(res?.error?.data?.message)
      }
    } catch (error) {
      toast.error('Login failed. Please try again.')
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="flex flex-col md:flex-row w-full max-w-5xl h-[40rem] bg-white shadow-lg overflow-hidden rounded-lg">
        <div className="w-full md:w-1/2 hidden md:block">
          <img
            src="/img1.avif"
            alt="Login"
            className="object-cover w-full h-full"
          />
        </div>
        <form className="w-full md:w-1/2 p-8 flex flex-col " onSubmit={handleLogin}>
          <div className="mb-6 space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-black text-center">Welcome, Please Sign In</h1>
            <span className="block text-sm text-gray-500 text-center">
              Sign in to your WEAREX account to unlock exclusive styles and offers.
            </span>
          </div>
          <div className='space-y-5 w-full'>
            <div>
              <label htmlFor="email" className='text-sm text-gray-600'>Email</label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                className="w-full"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <div className='flex justify-between items-center'>
                <label htmlFor="password" className='text-sm text-gray-600'>Password</label>
                <div className='flex items-center cursor-pointer' onClick={handleShow}>
                  {show ? <EyeIcon className='h-4 w-4' /> : <EyeOffIcon className='h-4 w-4' />}
                  <span className='text-xs text-gray-500 ml-1'>{show ? "Show" : "Hide"}</span>
                </div>
              </div>
              <Input
                name="password"
                id="password"
                type={show ? "text" : "password"}
                placeholder="Enter your Password"
                className="w-full"
                value={form.password}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className='text-right mt-2 text-xs'>
            <NavLink to="/auth/reset-password" className="underline text-gray-500 hover:text-black cursor-pointer">
              Forgot your Password?
            </NavLink>
          </div>
          <div className='mt-6'>
            <button
              type="submit"
              className="bg-black hover:bg-gray-800 text-white w-full py-3 transition flex justify-center items-center"
              disabled={isLoading}
            >
          {isLoading
  ? <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin duration-500"></div>
  : "Sign In"}
            </button>
            <div className='text-gray-500 mt-4 text-right'>
              <span className='text-xs'>Don't have an account? </span>
              <span className='text-xs cursor-pointer underline hover:text-black' onClick={() => navigate('/auth/register')}>Sign Up</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;