import React, { useState } from 'react';
import { Input } from "@/components/ui/input"
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRegisterMutation } from '../../APIs/user';
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
  });

  const [register, { loading }] = useRegisterMutation();

  const handleShow = () => setShow(!show);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (value) => {
    setForm({ ...form, role: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      if (res?.data?.success) {
        toast.success(res?.data?.message)
        navigate('/auth/verify-code', { state: { email: form.email } });
      } else if (res?.error) {
        toast.error(res?.error?.data?.message || 'Registration failed!')
      }
    } catch (err) {
      toast.error('Registration failed. Please try again.')
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="flex flex-col md:flex-row w-full max-w-5xl h-[40rem] bg-white shadow-lg overflow-hidden rounded-lg">
        <div className="w-full md:w-1/2 hidden md:block">
          <img
            src="/public/img2.avif"
            alt="Register"
            className="object-cover w-full h-full"
          />
        </div>
        <form className="w-full md:w-1/2 p-8 flex flex-col justify-center" onSubmit={handleRegister}>
          <div className='mb-6 space-y-2'>
            <h1 className="text-3xl font-bold text-black text-center">Sign Up. Shop Better</h1>
            <span className="block text-sm text-gray-500 text-center">
              Create your W E A R E X account to unlock exclusive styles and offers.
            </span>
          </div>
          <div className="flex items-center justify-center mb-4 w-full">
            <button
              type="button"
              className="flex items-center justify-center space-x-2 bg-white text-black px-4 py-2 rounded-md transition w-full border border-gray-200 shadow-sm"
            >
              <img src="/google.png" alt="Google" className="h-5 w-5" />
              <span className="text-sm font-medium">Continue With Google</span>
            </button>
          </div>
          <div className="flex items-center w-full my-5 space-x-4 text-gray-400 text-sm">
            <hr className="flex-grow border-t border-gray-200" />
            <span className="whitespace-nowrap">OR</span>
            <hr className="flex-grow border-t border-gray-200" />
          </div>
          <div className='space-y-5 w-full'>
            <div>
              <label htmlFor="name" className='text-sm text-gray-600'>Name</label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                className="w-full"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className='text-sm text-gray-600'>Email</label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                className="w-full"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <div className='flex justify-between items-center'>
                <label htmlFor="password" className='text-sm text-gray-600'>Password</label>
                <div className='flex items-center cursor-pointer' onClick={handleShow}>
                  {show ? <EyeIcon className='h-4 w-4' /> : <EyeOffIcon className='h-4 w-4' />}
                  <span className='text-xs text-gray-500 ml-1'>{show ? "Show" : "Hide"}</span>
                </div>
              </div>
              <Input
                id="password"
                name="password"
                type={show ? "text" : "password"}
                placeholder="Enter your Password"
                className="w-full"
                value={form.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className='text-sm text-gray-600 mb-1'>Choose an Option</label>
              <RadioGroup defaultValue={form.role} className="flex gap-6" onValueChange={handleRoleChange}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="customer" id="customer" />
                  <label htmlFor="customer" className="text-sm text-gray-600">Customer</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="admin" id="admin" />
                  <label htmlFor="admin" className="text-sm text-gray-600">Admin</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="delivery" id="delivery" />
                  <label htmlFor="delivery" className="text-sm text-gray-600">Delivery</label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <div className='mt-6'>
            <Button
              type="submit"
              className="bg-black hover:bg-gray-800 text-white w-full py-3 rounded transition"
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
            <div className='text-gray-500 mt-4 text-center'>
              <span className='text-xs'>Already have an account? </span>
              <NavLink to="/auth/login" className='text-xs cursor-pointer underline hover:text-black'>Sign In</NavLink>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
