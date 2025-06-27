import React from 'react';
import { Input } from "@/components/ui/input"
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';

const ResetPassword = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="flex flex-col md:flex-row w-full max-w-5xl h-[40rem] bg-white shadow-lg overflow-hidden rounded-lg">
        <div className="w-full md:w-1/2 bg-blue-500 hidden md:block">
          <img
            src="/public/photo-1656664317725-427313ae4b97.avif"
            alt="Reset Password"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <div className='mb-6 space-y-2'>
            <h1 className="text-3xl font-bold text-black text-center">Reset Your Password</h1>
            <span className="block text-sm text-gray-500 text-center">
              Enter your email and we'll send you a link to reset your password.
            </span>
          </div>
          <div className='space-y-5 w-full'>
            <div>
              <label htmlFor="email" className='text-sm text-gray-600'>Email</label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full"
              />
            </div>
          </div>
          <div className='text-red-600 mt-2'>
            <span className='text-xs'>We can not find your email.</span>
          </div>
          <div className='mt-6'>
            <NavLink to="/auth/login">
              <Button className="bg-black hover:bg-gray-800 text-white w-full py-3 rounded transition">
                Send
              </Button>
            </NavLink>
            <div className='text-gray-500 mt-4 text-center'>
              <span className='text-xs'>Back to </span>
              <span className='text-xs cursor-pointer underline hover:text-black' onClick={() => navigate('/auth/login')}>Login</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;


