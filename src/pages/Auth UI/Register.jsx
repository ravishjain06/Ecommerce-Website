import React, { useState } from 'react';
import { Input } from "@/components/ui/input"
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const Register = () => {

  const naviagte = useNavigate()
  const [show, setShow] = useState(false)

  const handleShow = () => {
    setShow(!show)
  }

  return (
    <div className="flex items-center justify-center h-[calc(100vh-4rem)] px-4  ">

      <div className="flex flex-col md:flex-row w-full max-w-5xl h-[40rem] shadow-[var(--shadow)] overflow-hidden">

        <div className="w-full md:w-1/2  hidden md:block ">
          <img
            src="/Image.png"
            alt="Login"
            className="relative top-[-66px] left-0  w-full h-[707px] object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 p-6 flex flex-col ">
          <div className='mb-4'>
            <h1 className="text-2xl font-bold text-[#333333]">Sign Up</h1>
            <span className='text-sm text-[#666666]'>Create your Euphoria account to unlock exclusive styles and offers.</span>
          </div>

          <div className="flex items-center justify-center mb-4 w-full ">
            <button
              className="flex items-center cursor-pointer justify-center space-x-2 bg-white text-black px-4 py-2 rounded-md transition w-full"
              style={{
                boxShadow:
                  'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
              }}
            >
              <img src="/google.png" alt="Google" className="h-5 w-5" />
              <span className="text-sm font-medium">Continue With Google</span>
            </button>
          </div>

          <div className="flex items-center w-full my-5 space-x-4 text-gray-500 text-sm">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="whitespace-nowrap">OR</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>


          <div className='space-y-5 w-full'>
            <div className="grid w-full  items-center gap-1.5">
              <label htmlFor="name" className='text-sm text-gray-600' >Name</label>
              <Input
                id="name"
                type="name"
                placeholder="Enter your name"
                className="w-full"
              />
            </div>
            <div className="grid w-full  items-center gap-1.5">
              <label htmlFor="email" className='text-sm text-gray-600' >Email</label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full"
              />
            </div>


            <div className="grid w-full items-center gap-1.5">
              <div className='flex justify-between items-center'>
                <label htmlFor="email" className='text-sm text-gray-600'>Password</label>
                <div className='flex items-center' onClick={handleShow}>
                  {
                    show ? <EyeIcon className='h-3' /> : <EyeOffIcon className='h-3' />
                  }
                  <span className='text-[12px] text-gray-500'>{show ? "Show" : "Hide"}</span>
                </div>
              </div>

              <Input
                id="email"
                type={show ? "text" : "password"}
                placeholder="Enter your Password"
                className="w-full"
              />
            </div>
          <div className="grid w-full items-center gap-1.5">
            <label className='text-sm text-gray-600 mb-1'>Choose an Option</label>
            <RadioGroup defaultValue="option-one" className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-one" id="option-one" />
                <label htmlFor="option-one" className="text-sm text-gray-600">Customer</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-two" id="option-two" />
                <label htmlFor="option-two" className="text-sm text-gray-600">Admin</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-three" id="option-three" />
                <label htmlFor="option-three" className="text-sm text-gray-600">Delivery</label>
              </div>
            </RadioGroup>
          </div>
          </div>



          <div className='mt-5'>
            <NavLink to="/login">
              <Button className="bg-[var(--purple)] hover:bg-[var(--purple)] text-white  cursor-pointer w-28">
                Sign In
              </Button>
            </NavLink>
            <div className='text-gray-500 ' onClick={() => naviagte('/register')}>
              <span className='text-[12px]'>Already have an account? </span><span className='text-[12px] cursor-pointer underline hover:text-[var(--purple)]'>Sign Up</span>
            </div>

          </div>


        </div>


      </div>
    </div>
  );
};

export default Register;
