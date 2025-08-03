import React, { useState } from 'react';
import { Input } from "@/components/ui/input"
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../../APIs/user';
import { toast } from 'react-toastify';
import { TbLoader3 } from 'react-icons/tb';

const Register = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const [register, { isLoading }] = useRegisterMutation();

  const handleShow = () => setShow(!show);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  // Validation function
  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    } else if (!/^[A-Za-z\s]{2,32}$/.test(form.name.trim())) {
      newErrors.name = "Name must be 2-32 letters";
    }
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(form.email.trim())) {
      newErrors.email = "Enter a valid email address";
    }
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (form.password.length > 32) {
      newErrors.password = "Password must be at most 32 characters";
    }
    return newErrors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      // Do NOT show toast, just show errors below fields
      return;
    }
    try {
      const res = await register({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      if (res?.data?.success) {
        navigate('/auth/verify-code', { state: { email: form.email } });
      } else if (res?.error) {
        setErrors(prev => ({
          ...prev,
          general: res?.error?.data?.message || 'Registration failed!'
        }));
      }
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        general: 'Registration failed. Please try again.'
      }));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="flex flex-col md:flex-row w-full max-w-5xl h-[40rem] bg-white shadow-lg overflow-hidden rounded-lg">
        <div className="w-full md:w-1/2 hidden md:block">
          <img
            src="/img2.avif"
            alt="Register"
            className="object-cover w-full h-full"
          />
        </div>
        <form className="w-full md:w-1/2 p-8 flex flex-col" onSubmit={handleRegister}>
          <div className='mb-6 space-y-2 text-center'>
            <h1 className="text-3xl font-bold text-black ">Sign Up. Shop Better</h1>
            <span className="block text-sm text-gray-500 ">
              Create your WEAREX account to unlock exclusive styles and offers.
            </span>
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
              {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
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
              {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
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
              {errors.password && <span className="text-xs text-red-500">{errors.password}</span>}
            </div>
          </div>
          {errors.general && (
  <div className="text-red-500 text-xs mt-2 text-center">{errors.general}</div>
)}
          <div className='mt-6'>
            <button
              type="submit"
              className="bg-black hover:bg-gray-800 text-white w-full py-3  transition flex justify-center items-center"
              disabled={isLoading}
            >
              {isLoading ?<div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin duration-500"></div> : "Sign Up"}
            </button>
            <div className='text-gray-500 mt-4 text-right'>
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
