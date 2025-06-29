import React, { useState } from 'react';
import { Input } from "@/components/ui/input"
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
        toast.success(res?.data?.message || 'Login successful!')
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
            src="/public/img1.avif"
            alt="Login"
            className="object-cover w-full h-full"
          />
        </div>
        <form className="w-full md:w-1/2 p-8 flex flex-col justify-center" onSubmit={handleLogin}>
          <h1 className="text-3xl font-bold mb-6 text-black text-center">Welcome, Please Sign In</h1>
          <div className="flex items-center justify-center mb-4 w-full">
            <button
              type="button"
              className="flex items-center justify-center space-x-2 bg-white text-black px-4 py-2 rounded-md transition w-full border border-gray-200 shadow-sm"
            >
              <img src="/google.png" alt="Google" className="h-5 w-5" />
              <span className="text-sm font-medium">Continue With Google</span>
            </button>
          </div>
          <div className="flex items-center w-full my-5 space-x-4 text-gray-400 text-sm">
            <hr className="flex-grow border-t border-gray-200" />
            <span className="whitespace-nowrap">OR</span>
            <hr className="flex-grow border-t border-gray-200" />
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
          <div className='text-right underline text-gray-500 cursor-pointer mt-2 text-xs'>
            <span>Forgot your Password?</span>
          </div>
          <div className='mt-6'>
            <button
              type="submit"
              className="bg-black hover:bg-gray-800 text-white w-full py-3 transition"
              disabled={isLoading}
            >
              {isLoading ? <TbLoader3 className="animate-spin" /> : "Sign In"}
            </button>
            <div className='text-gray-500 mt-4 text-center'>
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