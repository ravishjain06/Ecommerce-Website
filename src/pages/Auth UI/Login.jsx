import React, { useState } from 'react';
import { Input } from "@/components/ui/input"
import { EyeIcon, EyeOffIcon, LoaderCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { useLoginMutation } from '../../APIs/user';
import { toast } from 'react-toastify';
import { TbLoader3 } from "react-icons/tb";
import { useDispatch } from 'react-redux';
import { setUser ,setAccessToken} from '../../features/userSlice';
const Login = () => {
  const navigate = useNavigate()
  const [show, setShow] = useState(false)
  
  const dispatch = useDispatch()
 
  const handleShow = () => {
    setShow(!show)
  }

  const [form, setform] = useState({
    email: "",
    password: ""
  })

  const handleChange = (e) => {
    setform({
      ...form,
      [e.target.name]: e.target.value
    })

  }
  const [login, { data, error, isLoading }] = useLoginMutation()

  const handleLogin = async (e) => {
    console.log("working");

    e.preventDefault();
    try {
      const res = await login({
        email: form.email,
        password: form.password
      })
      if (res?.data?.success) {
        console.log(res?.data?.user);
        toast.success(res?.data?.message || 'Registration successful!')
        dispatch(setUser(res?.data?.user))
       dispatch(setAccessToken(res?.data?.accessToken));

        navigate('/');
      } else if (res?.error) {
        toast.error(res?.error?.data?.message || 'Registration failed!')
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center h-[calc(100vh-4rem)] px-4">
      <div className="flex flex-col md:flex-row w-full max-w-5xl h-[40rem] md:shadow-[var(--shadow)] xl:shadow-[var(--shadow)] lg:shadow-[var(--shadow)] overflow-hidden">
        <div className="w-full md:w-1/2 hidden md:block">
          <img
            src="/public/img1.avif"
            alt="Login"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Wrap inputs in form element */}
        <form className="w-full md:w-1/2 p-6 flex flex-col" onSubmit={handleLogin}>
          <h1 className="text-2xl font-bold mb-4 text-[#333333] sm:text-left">
            Welcome, Please Sign In
          </h1>
          <div className="flex items-center justify-center mb-4 w-full">
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
            <div className="grid w-full items-center gap-1.5">
              <label htmlFor="email" className='text-sm text-gray-600'>Email</label>
              <Input
                id="email"
                name="email"  // Added missing name attribute
                type="email"
                placeholder="Enter your email"
                className="w-full"
                value={form.email}  // Added value prop for controlled input
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
                name="password"
                id="password"
                type={show ? "text" : "password"}
                placeholder="Enter your Password"
                className="w-full"
                value={form.password}  // Added value prop for controlled input
                onChange={handleChange}
              />
            </div>
          </div>

          <div className='text-right underline text-gray-500 cursor-pointer'>
            <span className='text-[12px]'>Forgot your Password</span>
          </div>

          <div className='mt-5'>
            <Button
              type="submit"
              className="bg-[var(--purple)] hover:bg-[var(--purple)] text-white cursor-pointer w-28"
              disabled={isLoading} // Disable the button while loading
            >
              {isLoading ? <TbLoader3 className="animate-spin" /> : "Sign In"}
            </Button>

            <div className='text-gray-500 mt-2' onClick={() => navigate('/auth/register')}>
              <span className='text-[12px]'>Don't have an account? </span>
              <span className='text-[12px] cursor-pointer underline hover:text-[var(--purple)]'>Sign Up </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;