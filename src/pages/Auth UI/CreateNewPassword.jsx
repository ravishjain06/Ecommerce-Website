import React, { useState } from 'react';
import { Input } from "@/components/ui/input"
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const CreateNewPassword = () => {

  const naviagte = useNavigate()
  const [show, setShow] = useState(false)

  const handleShow = () => {
    setShow(!show)
  }

  return (
    <div className="flex items-center justify-center h-[calc(100vh-4rem)] px-4  ">

      <div className="flex flex-col md:flex-row w-full max-w-5xl h-[40rem] md:shadow-[var(--shadow)] xl:shadow-[var(--shadow)] lg:shadow-[var(--shadow)] overflow-hidden">

        <div className="w-full md:w-1/2  hidden md:block ">
          <img
            src="/public/143c9cf90e1f4e72b7a1fb8ddae0662a.jpg"
            alt="Login"
            className="relative top-[-66px] left-0  w-full h-[707px] object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 p-6 flex flex-col ">
          <div className='mb-4 space-y-2'>
            <h1 className="text-2xl font-bold  text-[#333333] text-center sm:text-left ">
              Create New Password </h1>
            <span className="block text-sm text-[#666666] text-center sm:text-left mx-auto">
              Your new password must be different from previous used passwords.
            </span>
          </div>

          <div className='space-y-5 w-full'>




            <div className="grid w-full items-center gap-1.5">
              <label htmlFor="password" className="text-sm text-gray-600">Password</label>
              <div className="relative w-full">
                <Input
                  id="password"
                  type={show ? "text" : "password"}
                  placeholder="Enter your Password"
                  className="w-full pr-10"
                />
                <div
                  className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
                  onClick={handleShow}
                >
                  {show ? <EyeIcon className="h-4 w-4 text-gray-500" /> : <EyeOffIcon className="h-4 w-4 text-gray-500" />}
                </div>
              </div>
              <div className='text-gray-500'>
                <span className='text-[12px]'>Must be at least 8 characters.</span>
              </div>
            </div>

            <div className="grid w-full items-center gap-1.5">
              <label htmlFor="password" className="text-sm text-gray-600">Confirm Password</label>
              <div className="relative w-full">
                <Input
                  id="password"
                  type={show ? "text" : "password"}
                  placeholder="Enter your Password"
                  className="w-full pr-10"
                />
                <div
                  className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
                  onClick={handleShow}
                >
                  {show ? <EyeIcon className="h-4 w-4 text-gray-500" /> : <EyeOffIcon className="h-4 w-4 text-gray-500" />}
                </div>
              </div>
              <div className='text-red-600'>
                <span className='text-[12px]'>We can not find your email.</span>
              </div>
            </div>
          </div>

          <div className='mt-5'>
            <NavLink to="/login">
              <Button className="bg-[var(--purple)] hover:bg-[var(--purple)] text-white  cursor-pointer w-28">
                Reset Password
              </Button>
            </NavLink>


          </div>


        </div>


      </div>
    </div>
  );
};

export default CreateNewPassword;
