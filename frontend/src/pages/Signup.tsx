import React, { useEffect } from 'react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useRegisterMutation } from '../slices/usersApiSlice';
import e from 'express';
import { setCredentials } from '../slices/authSlice';
import Loader from '../components/Loader';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state: any) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const handleSignUp = async (e: any) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      toast.error('Passwords do not match');
      return;
    } else {
      try {
        const res = await register({ name, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
        toast.success('Logout successful');
      } catch (error: any) {
        toast.error(error?.data?.message || error?.error);
      }
    }
  };

  return (
    <div className='h-screen w-screen snap-y overflow-scroll justify-center items-center'>
      <div
        className='flex bg-cover bg-center items-center justify-center h-screen '
        style={{
          backgroundImage: `url("https://firebasestorage.googleapis.com/v0/b/miniparfumqueen.appspot.com/o/images%2Fbg%2Floginbg.jpg?alt=media&token=97fc37ac-11a2-47fb-af77-462cc4a0d077")`,
        }}
      >
        <div className='flex flex-col bg-gray-300/50 rounded-lg p-6 w-full lg:p-16 lg:w-1/2'>
          <h1 className='text-3xl text-white font-bold p-4 text-center'>
            Register
          </h1>
          <input
            className='p-2 placeholder:text-white border-white/50 bg-white/25 rounded'
            type='test'
            placeholder='Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className='p-2 placeholder:text-white border-white/50 bg-white/25 rounded'
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className='p-2 mt-2 border-2 placeholder:text-white border-white/50 bg-white/25 rounded'
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            className='p-2 mt-2 border-2 placeholder:text-white border-white/50 bg-white/25 rounded'
            type='password'
            placeholder='Confirm Password'
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
          />
          <button
            className='p-2 mt-2 bg-orange-400/50 hover:bg-orange-400 text-white rounded'
            onClick={handleSignUp}
          >
            Register
          </button>
          {isLoading && <Loader />}
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
            Already have an account? Login
          </Link>
        </div>
      </div>
      {/* <div className=''>
        <Footer />
      </div> */}
    </div>
  );
};

export default Signup;
