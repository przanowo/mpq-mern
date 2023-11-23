import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { CartAppState } from '../types/CartType';
import CheckoutSteps from '../components/CheckoutSteps';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCart } from '../slices/cartSlice';

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state: CartAppState) => state.cart);
  const {
    cartItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = cart;

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!paymentMethod) {
      navigate('/payment');
    }
    if (!shippingAddress) {
      navigate('/shipping');
    }
  }, [navigate, paymentMethod, shippingAddress]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice: itemsPrice,
        shippingPrice: shippingPrice,
        taxPrice: taxPrice,
        totalPrice: totalPrice,
      }).unwrap();
      dispatch(clearCart());
      navigate(`/order/${res._id}`);
    } catch (error: any) {
      // toast.error(error?.data?.message || error?.error);
      console.log(error);
    }
  };

  return (
    <div className='flex mt-28 max-w-4xl justify-center items-center mx-auto text-xl font-semibold rounded bg-gray-200/75 my-4'>
      <div className='flex flex-col flex-grow bg-gray-200/75 p-8 rounded-md shadow-md w-full max-w-4xl mx-auto'>
        <div className='flex justify-center mb-6'>
          <CheckoutSteps step1={true} step2={true} step3={true} step4={true} />
        </div>

        <div className='flex flex-col md:flex-row justify-between'>
          <div className='flex-1 mb-4 md:mb-0 md:mr-4'>
            <ul>
              <li className='border-b pb-4 mb-4'>
                <h2 className='text-3xl font-bold mb-2'>Shipping</h2>
                <p>
                  <strong>Address:</strong>
                  {shippingAddress?.addressLine1},{' '}
                  {shippingAddress?.addressLine2},{shippingAddress?.city},{' '}
                  {shippingAddress?.postcode}, {shippingAddress?.country}
                </p>
              </li>
            </ul>
          </div>

          <div className='flex-1 mb-4 md:mb-0 md:mr-4'>
            <ul>
              <li className='border-b pb-4 mb-4'>
                <h2 className='text-3xl font-bold mb-2'>Payment Method:</h2>
                <p>
                  <strong>Method:</strong> {paymentMethod}
                </p>
              </li>
            </ul>
          </div>
        </div>
        <div className='flex-col'>
          <h2 className='text-3xl font-bold mb-2'>Order Items:</h2>
          {cartItems.length === 0 ? (
            <Message message='Your cart is empty.' type='info' />
          ) : (
            <ul>
              {cartItems.map((item, index) => (
                <li
                  key={index}
                  className='flex justify-between items-center border-b pb-4 mb-4'
                >
                  <div className='flex items-center'>
                    <img
                      src={item.mainImage}
                      alt={item.title}
                      className='h-32 w-32 object-cover rounded-md shadow-md mr-4'
                    />
                    <Link
                      to={`/product/${item._id}`}
                      className='text-lg text-gray-600 font-semibold'
                    >
                      {item.title}
                    </Link>
                  </div>
                  <div className='text-xl text-gray-600 font-bold'>
                    {item.qty} x ${item.price} = ${item.qty * item.price}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className='flex flex-col mt-6'>
          <h2 className='text-3xl font-bold mb-2'>Order Summary:</h2>
          <ul>
            <li className='flex justify-between mb-2'>
              <div>Items:</div>
              <div>€{cart.itemsPrice}</div>
            </li>
            <li className='flex justify-between mb-2'>
              <div>Shipping:</div>
              <div>€{cart.shippingPrice}</div>
            </li>
            <li className='flex justify-between mb-2'>
              <div>Tax:</div>
              <div>€{cart.taxPrice}</div>
            </li>
            <li className='flex justify-between mb-4'>
              <div>
                <strong>Total:</strong>
              </div>
              <div>
                <strong>€{cart.totalPrice}</strong>
              </div>
            </li>
            <li>
              {error && (
                <Message message='Error cannot place order' type='error' />
              )}
            </li>
            <li className='flex justify-center'>
              <button
                type='button'
                className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow-md disabled:bg-gray-200/50'
                disabled={cartItems.length === 0}
                onClick={placeOrderHandler}
              >
                Place Order
              </button>
              {isLoading && <Loader />}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
