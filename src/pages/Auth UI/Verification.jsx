"use client"

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from '../../components/ui/button';

const Verification = () => {
  const [value, setValue] = useState("");

  return (
    <div className="flex items-center justify-center h-[calc(100vh-4rem)] px-4">
      <div className="flex flex-col md:flex-row w-full max-w-5xl h-[40rem] md:shadow-[var(--shadow)] xl:shadow-[var(--shadow)] lg:shadow-[var(--shadow)] overflow-hidden">

        <div className="w-full md:w-1/2 hidden md:block">
          <img
            src="/public/22ffcfd407a58073b03767656a674f7d.jpg"
            alt="Login"
            className="w-full  "
          />
        </div>

        <div className="w-full md:w-1/2 p-6 flex flex-col">
          <div className='mb-4 space-y-2'>
            <h1 className="text-2xl font-bold text-[#333333] text-center sm:text-left">
              Verification
            </h1>
            <span className="block text-sm text-[#666666] text-center sm:text-left mx-auto">
              Enter the 6-digit code we sent to your email or phone.
            </span>
          </div>

          <div className='space-y-5 w-full'>
            <div className="grid w-full items-center gap-1.5">
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

              <div className='text-gray-500'>
                <span className='text-[12px]'>Must be at least 6 characters.</span>
              </div>
            </div>
          </div>

          <div className='mt-5'>
            <NavLink to="/login">
              <Button
                className="bg-[var(--purple)] hover:bg-[var(--purple)] text-white cursor-pointer w-28"
                disabled={value.length !== 6}
              >
                Verify code
              </Button>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verification;
