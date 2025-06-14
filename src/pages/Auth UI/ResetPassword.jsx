import React, { useState } from 'react';
import { Input } from "@/components/ui/input"
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';


const ResetPassword = () => {

  const naviagte = useNavigate()


  return (
    <div className="flex items-center justify-center h-[calc(100vh-4rem)] px-4  ">

      <div className="flex flex-col md:flex-row w-full max-w-5xl h-[40rem] md:shadow-[var(--shadow)] xl:shadow-[var(--shadow)] lg:shadow-[var(--shadow)] overflow-hidden">

        <div className="w-full md:w-1/2 bg-blue-500  hidden md:block ">
          <img
            src="/public/photo-1656664317725-427313ae4b97.avif"
            alt="Login"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 p-6 flex flex-col ">
          <div className='mb-4 space-y-2'>
            <h1 className="text-2xl font-bold  text-[#333333] text-center sm:text-left ">Reset Your Password</h1>
            <span className="block text-sm text-[#666666] text-center sm:text-left mx-auto">
              Enter your email and we'll send you a link to reset your password.
            </span>
          </div>

          <div className='space-y-5 w-full'>
            <div className="grid w-full  items-center gap-1.5">
              <label htmlFor="email" className='text-sm text-gray-600' >Email</label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full"
              />
            </div>

          </div>

          <div className='text-red-600'>
            <span className='text-[12px]'>We can not find your email.</span>
          </div>

          <div className='mt-5'>
            <NavLink to="/login">
              <Button className="bg-[var(--purple)] hover:bg-[var(--purple)] text-white  cursor-pointer w-28">
                Send
              </Button>
            </NavLink>
            <div className='text-gray-500 ' onClick={() => naviagte('/login')}>
              <span className='text-[12px]'>Back to </span><span className='text-[12px] cursor-pointer underline hover:text-[var(--purple)]'>Login</span>
            </div>

          </div>


        </div>


      </div>
    </div>
  );
};

export default ResetPassword;


