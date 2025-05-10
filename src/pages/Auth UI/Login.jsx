import React, { useState } from 'react';
import { Input } from "@/components/ui/input"
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
const Login = () => {

  const naviagte = useNavigate()
  const [show, setShow] = useState(false)

  const handleShow = () => {
    setShow(!show)
  }

  return (
    <div className="flex items-center justify-center h-[calc(100vh-4rem)] px-4  ">

      <div className="flex flex-col md:flex-row w-full max-w-5xl h-[40rem] shadow-[var(--shadow)] overflow-hidden">

        <div className="w-full md:w-1/2 bg-blue-500  hidden md:block ">
          <img
            src="/loginImg.png"
            alt="Login"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 p-6 flex flex-col ">
          <h1 className="text-2xl font-bold mb-4 text-[#333333]">Welcome, Please Sign In</h1>
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
          </div>

          <div className='text-right underline text-gray-500 cursor-pointer'>
            <span className='text-[12px]  '>Forgot your Password</span>
          </div>

          <div className='mt-5'>
            <NavLink to="/login">
              <Button className="bg-[var(--purple)] hover:bg-[var(--purple)] text-white  cursor-pointer w-28">
                Sign In
              </Button>
            </NavLink>
            <div className='text-gray-500 ' onClick={() => naviagte('/register')}>
              <span className='text-[12px]'>Dont have an account?</span><span className='text-[12px] cursor-pointer underline hover:text-[var(--purple)]'>Sign Up</span>
            </div>

          </div>


        </div>


      </div>
    </div>
  );
};

export default Login;
