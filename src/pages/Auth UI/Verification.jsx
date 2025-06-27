"use client"

import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from '../../components/ui/button';
import { useVerifyUserMutation } from '../../APIs/user';
import { toast } from 'react-toastify';

const Verification = () => {
  const [value, setValue] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const email = location?.state?.email || "";
  const [verifyUser, { loading }] = useVerifyUserMutation();

  const handleChange = async (value) => {
    try {
      const res = await verifyUser({ email, otp: value });
      if (res?.data?.success) {
        toast.success(res?.data?.message)
        navigate('/auth/login');
        setValue("")
      } else if (res?.error) {
        toast.error(res?.error?.data?.message || 'Verification failed!')
      }
    } catch (error) {
      toast.error('Verification failed. Please try again.')
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="flex flex-col md:flex-row w-full max-w-5xl h-[40rem] bg-white shadow-lg overflow-hidden rounded-lg">
        <div className="w-full md:w-1/2 hidden md:block">
          <img
            src="/public/22ffcfd407a58073b03767656a674f7d.jpg"
            alt="Verification"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <div className='mb-6 space-y-2'>
            <h1 className="text-3xl font-bold text-black text-center">Verification</h1>
            <span className="block text-sm text-gray-500 text-center">
              Enter the 6-digit code we sent to your email or phone.
            </span>
          </div>
          <div className='space-y-5 w-full'>
            <div>
              <label htmlFor="otp" className="text-sm text-gray-600">Verification code</label>
              <InputOTP
                id="otp"
                maxLength={6}
                value={value}
                onChange={(val) => setValue(val)}
                className="w-full"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <div className='text-gray-500 mt-1'>
                <span className='text-xs'>Must be at least 6 characters.</span>
              </div>
            </div>
          </div>
          <div className='mt-6'>
            <Button
              onClick={() => handleChange(value)}
              className="bg-black hover:bg-gray-800 text-white w-full py-3 rounded transition"
              disabled={value.length !== 6 || loading}
            >
              Verify code
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verification;
