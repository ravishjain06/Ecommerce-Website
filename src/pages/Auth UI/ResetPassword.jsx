import React, { useState } from 'react';
import { Input } from "@/components/ui/input"
import { NavLink, useNavigate } from 'react-router-dom';
import { useForgotPasswordMutation } from '../../APIs/user';
import { TbLoader3 } from 'react-icons/tb';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await forgotPassword({ email }).unwrap();
      if (res.success) {
        toast.success(res.message || "Reset link sent to your email.");
      } else {
        toast.error(res.message || "Something went wrong.");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="flex flex-col md:flex-row w-full max-w-5xl h-[40rem] bg-white shadow-lg overflow-hidden rounded-lg">
        <div className="w-full md:w-1/2 bg-blue-500 hidden md:block">
          <img
            src="/photo-1656664317725-427313ae4b97.avif"
            alt="Reset Password"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="w-full md:w-1/2 p-8 flex flex-col ">
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className='mb-6 space-y-2 text-center'>
              <h1 className="text-3xl font-bold text-black ">Reset Your Password</h1>
              <span className="block text-sm text-gray-500 ">
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
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className='mt-6'>
              <button
                type="submit"
                className="bg-black hover:bg-gray-800 text-white w-full py-3 transition flex justify-center items-center"
                disabled={isLoading || !email}
              >
                {isLoading ? <TbLoader3 className="animate-spin" /> : "Send"}
              </button>
              <div className='text-gray-500 mt-4 text-right'>
                <span className='text-xs'>Back to </span>
                <span className='text-xs cursor-pointer underline hover:text-black' onClick={() => navigate('/auth/login')}>Login</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;


