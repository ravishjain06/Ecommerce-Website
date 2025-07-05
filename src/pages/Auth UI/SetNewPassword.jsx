import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { useParams, useNavigate } from 'react-router-dom';
import { useResetPasswordMutation } from '../../APIs/user';
import { TbLoader3 } from 'react-icons/tb';
import { toast } from 'react-toastify';

const SetNewPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await resetPassword({ token, newPassword }).unwrap();
      if (res.success) {
        toast.success(res.message || "Password reset successful.");
        navigate('/auth/login');
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
            src="/public/photo-1656664317725-427313ae4b97.avif"
            alt="Set New Password"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="w-full md:w-1/2 p-8 flex flex-col ">
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className='mb-6 space-y-2 text-center'>
              <h1 className="text-3xl font-bold text-black ">Set New Password</h1>
              <span className="block text-sm text-gray-500 ">
                Enter your new password below to reset your account password.
              </span>
            </div>
            <div className="space-y-5 w-full">
              <div>
                <label htmlFor="newPassword" className="text-sm text-gray-600">New Password</label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  className="w-full"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className='mt-6'>
              <button
                className="bg-black hover:bg-gray-800 text-white w-full py-3 transition flex justify-center items-center disabled:opacity-60 disabled:cursor-not-allowed"
                type="submit"
                disabled={isLoading || !newPassword}
              >
                {isLoading ? <TbLoader3 className="animate-spin" /> : "Reset Password"}
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

export default SetNewPassword;
