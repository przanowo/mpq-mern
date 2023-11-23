import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
import CheckoutSteps from '../components/CheckoutSteps';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state: any) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();

      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success('Login successful');
    } catch (error: any) {
      toast.error(error?.data?.message || error?.error);
    }
  };

  return (
    <div className='h-screen w-screen snap-y overflow-scroll justify-center items-center'>
      <div
        className='flex bg-cover bg-center items-center justify-center h-screen'
        style={{
          backgroundImage: `url("https://firebasestorage.googleapis.com/v0/b/miniparfumqueen.appspot.com/o/images%2Fbg%2Floginbg.jpg?alt=media&token=97fc37ac-11a2-47fb-af77-462cc4a0d077")`,
        }}
      >
        <div className='flex flex-col bg-gray-300/50 rounded-lg p-6 w-full lg:p-16 lg:w-1/2'>
          <h1 className='text-3xl text-white font-bold p-4 text-center'>
            Login
          </h1>
          <input
            className='p-2 border-2 placeholder:text-white border-white/50 bg-white/25 rounded '
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className='p-2 mt-2 border-2  rounded placeholder:text-white border-white/50 bg-white/25'
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className='p-2 mt-2 bg-orange-400/50 hover:bg-orange-400 text-white rounded'
            onClick={handleLogin}
            disabled={isLoading}
          >
            Login
          </button>
          {isLoading && <Loader />}
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
            Already have an account? Login
          </Link>
          {/* <button
            className='p-2 mt-2 bg-red-500/75 hover:bg-red-500 text-white  rounded'
          >
            Login with Google
          </button> */}
          {/* <button
            className='p-2 mt-2 bg-blue-500/75 hover:bg-blue-500 text-white rounded'
            onClick={handleLogin}
          >
            Login with Facebook
          </button> */}
          {/* <button
            className='p-2 mt-2 text-white underline'
            onClick={handleForgotPassword}
          >
            Forgot password?
          </button> */}
        </div>
      </div>
      {/* <div className=''>
        <Footer />
      </div> */}
    </div>
  );
};

export default Login;
