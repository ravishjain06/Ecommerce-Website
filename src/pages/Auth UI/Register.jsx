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
    role: 'customer', // Default role
  });

 
  
  const [register, { data, error, loading }] = useRegisterMutation();

  const handleShow = () => setShow(!show);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    console.log("Form Data:", { ...form, [e.target.name]: e.target.value });
  };
  // console.log(import.meta.env.VITE_BASE_URL);
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
  

      console.log("Registration Response:", res);

      if (res?.data?.success) {
        toast.success(res?.data?.message)
        navigate('/auth/verify-code',{state:{email:form.email}});
      } else if (res?.error) {
        toast.error(res?.error?.data?.message || 'Registration failed!')
      }

    } catch (err) {
      console.error("Error while Register", err);
      toast.error('Registration failed. Please try again.')
    }
  };

  return (
    <div className="flex items-center justify-center h-[calc(100vh-4rem)] px-4">

      <div className="flex flex-col md:flex-row w-full max-w-5xl h-[40rem] md:shadow-[var(--shadow)] xl:shadow-[var(--shadow)] lg:shadow-[var(--shadow)] overflow-hidden">

        <div className="w-full md:w-1/2  hidden md:block ">
          <img
            src="/public/img2.avif"
            alt="Login"
            className="relative top-[-66px] left-0  w-full h-[707px] object-cover"
          />
        </div>
        <form className="w-full md:w-1/2 p-6 flex flex-col" onSubmit={handleRegister}>
          <div className='mb-4 space-y-2'>
            <h1 className="text-2xl font-bold  text-[#333333] text-center sm:text-left ">Sign Up. Shop Better</h1>
            <span className="block text-sm text-[#666666] text-center sm:text-left mx-auto">
              Create your Euphoria account to unlock exclusive styles and offers.
            </span>
          </div>
          <div className="flex items-center justify-center mb-4 w-full ">
            <button
              type="button"
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
                name="name"
                type="text"
                placeholder="Enter your name"
                className="w-full"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div className="grid w-full  items-center gap-1.5">
              <label htmlFor="email" className='text-sm text-gray-600' >Email</label>
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
            <div className="grid w-full items-center gap-1.5">
              <div className='flex justify-between items-center'>
                <label htmlFor="password" className='text-sm text-gray-600'>Password</label>
                <div className='flex items-center' onClick={handleShow}>
                  {
                    show ? <EyeIcon className='h-3' /> : <EyeOffIcon className='h-3' />
                  }
                  <span className='text-[12px] text-gray-500'>{show ? "Show" : "Hide"}</span>
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
            <div className="grid w-full items-center gap-1.5">
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
          <div className='mt-5'>
            <Button
              type="submit"
              className="bg-[var(--purple)] hover:bg-[var(--purple)] text-white  cursor-pointer w-28"
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
            <div className='text-gray-500 mt-2' onClick={() => navigate('/auth/login')}>
              <span className='text-[12px]'>Already have an account? </span>
              <span className='text-[12px] cursor-pointer underline hover:text-[var(--purple)]'>Sign In</span>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
