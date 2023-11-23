import { useEffect, useState } from 'react';
import CheckoutSteps from '../components/CheckoutSteps';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../slices/cartSlice';
import { CartAppState } from '../types/CartType';

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state: CartAppState) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <div className='flex mt-28 justify-center items-center mx-auto text-xl font-semibold rounded bg-gray-200/90 my-4'>
      <div className='flex-col justify-center p-6  w-full'>
        <CheckoutSteps step1={true} step2={true} step3={true} step4={false} />
        <h2 className='text-center text-4xl p-4'>Payment Method</h2>
        <form onSubmit={submitHandler} className='flex p-1'>
          <div className='flex flex-col p-1'>
            <label htmlFor='paypal'>PayPal</label>
            <input
              type='radio'
              name='paymentMethod'
              id='paypal'
              value='PayPal'
              checked={paymentMethod === 'PayPal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className='flex flex-col p-1'>
            <label htmlFor='stripe'>Stripe</label>
            <input
              type='radio'
              name='paymentMethod'
              id='stripe'
              value='Stripe'
              checked={paymentMethod === 'Stripe'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className='flex flex-col p-1'>
            <button
              type='submit'
              className='p-2 mt-2 bg-orange-400/50 hover:bg-orange-400 text-white rounded'
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Payment;
