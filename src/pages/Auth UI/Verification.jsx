"use client"

import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from '../../components/ui/button';
import { useVerifyUserMutation, useResendVerificationMutation } from '../../APIs/user';
import { toast } from 'react-toastify';
import { TbLoader3 } from "react-icons/tb";

const Verification = () => {
  const [value, setValue] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const email = location?.state?.email || "";
  const [verifyUser, { isLoading }] = useVerifyUserMutation();
  const [resendVerification, { isLoading: isResending }] = useResendVerificationMutation();

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
            src="/22ffcfd407a58073b03767656a674f7d.jpg"
            alt="Verification"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="w-full md:w-1/2 p-8 flex flex-col ">
          <div className='mb-6 space-y-2 text-center'>
            <h1 className="text-3xl font-bold text-black ">Verification</h1>
            <span className="block text-sm text-gray-500 ">
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
              <div className='text-gray-500 mt-1 flex items-center justify-between'>
                <span className='text-xs'>Must be at least 6 characters.</span>
                <button
                  type="button"
                  className="text-xs underline text-blue-600 hover:text-blue-800 disabled:text-gray-400 ml-2"
                  disabled={isResending}
                  onClick={async () => {
                    try {
                      const res = await resendVerification({ email }).unwrap();
                      if (res.success) {
                        toast.success(res.message || 'Verification code resent!');
                      } else {
                        toast.error(res.message || 'Failed to resend code.');
                      }
                    } catch (err) {
                      toast.error(err?.data?.message || 'Failed to resend code.');
                    }
                  }}
                >
                  {isResending ? 'Resending...' : 'Resend code'}
                </button>
              </div>
            </div>
          </div>
          <div className='mt-6'>
            <Button
              onClick={() => handleChange(value)}
              className="bg-black hover:bg-gray-800 text-white w-full py-3 transition"
              disabled={value.length !== 6 || isLoading}
              style={{ borderRadius: 0 }}
            >
              {isLoading ? <TbLoader3 className="animate-spin" /> : "Verify code"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verification;
