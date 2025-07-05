import React, { useState } from 'react';
import { Input } from "@/components/ui/input"
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';

const CreateNewPassword = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(!show);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="flex flex-col md:flex-row w-full max-w-5xl h-[40rem] bg-white shadow-lg overflow-hidden rounded-lg">
        <div className="w-full md:w-1/2 hidden md:block">
          <img
            src="/143c9cf90e1f4e72b7a1fb8ddae0662a.jpg"
            alt="Create New Password"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <div className='mb-6 space-y-2'>
            <h1 className="text-3xl font-bold text-black text-center">Create New Password</h1>
            <span className="block text-sm text-gray-500 text-center">
              Your new password must be different from previous used passwords.
            </span>
          </div>
          <div className='space-y-5 w-full'>
            <div>
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
              <div className='text-gray-500 mt-1'>
                <span className='text-xs'>Must be at least 8 characters.</span>
              </div>
            </div>
            <div>
              <label htmlFor="confirm-password" className="text-sm text-gray-600">Confirm Password</label>
              <div className="relative w-full">
                <Input
                  id="confirm-password"
                  type={show ? "text" : "password"}
                  placeholder="Confirm your Password"
                  className="w-full pr-10"
                />
                <div
                  className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
                  onClick={handleShow}
                >
                  {show ? <EyeIcon className="h-4 w-4 text-gray-500" /> : <EyeOffIcon className="h-4 w-4 text-gray-500" />}
                </div>
              </div>
              <div className='text-red-600 mt-1'>
                <span className='text-xs'>Passwords must match.</span>
              </div>
            </div>
          </div>
          <div className='mt-6'>
            <NavLink to="/auth/login">
              <Button className="bg-black hover:bg-gray-800 text-white w-full py-3 rounded transition">
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
