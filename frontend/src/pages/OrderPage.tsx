import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
} from '../slices/ordersApiSlice';
import { useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { Product } from '../types/ProductType';
import { IOrder, IOrderItem } from '../types/OrderType';
import {
  PayPalButtons,
  usePayPalScriptReducer,
  SCRIPT_LOADING_STATE,
  PayPalScriptProvider,
} from '@paypal/react-paypal-js';
import {
  usePayOrderMutation,
  useGetPaypalClientIdQuery,
} from '../slices/ordersApiSlice';
import { toast } from 'react-toastify';

const OrderPage = () => {
  const { orderId } = useParams<{ orderId: string }>();

  const {
    data: order,
    refetch,
    error,
    isLoading,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: isPaying }] = usePayOrderMutation();

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const {
    data: paypal,
    isLoading: isPayingPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery({});

  const { userInfo } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (!errorPayPal && !isPayingPal && paypal.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: 'resetOptions',
          value: {
            clientId: paypal.clientId,
            currency: 'USD',
          },
        });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPayPalScript();
        }
      }
    }
  }, [paypal, isPayingPal, errorPayPal, order, paypalDispatch]);

  function createOrder(data: any, actions: any) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: order.totalPrice.toFixed(2),
            },
          },
        ],
      })
      .then((orderId: any) => {
        return orderId;
      });
  }

  function onApprove(data: any, actions: any) {
    return actions.order.capture().then(async function (details: any) {
      try {
        await payOrder({
          orderId: order._id,
          // paymentResult: details,
          details,
        });
        refetch();
        toast.success('Payment successful');
      } catch (error: any) {
        toast.error('Payment failed.', error?.message || error?.data?.message);
      }
    });
  }
  function onError(err: any) {
    toast.error(err?.message || err?.data?.message);
  }
  function onCancel(data: any) {
    toast.error('Payment cancelled');
  }

  const deliverOrderHandler = async () => {
    try {
      await deliverOrder({ orderId: order._id });
      console.log('delivered', order._id, orderId);
      refetch();
      toast.success('Order delivered');
    } catch (error: any) {
      toast.error(error?.message || error?.data?.message);
    }
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message type='error' message='Error displaying order' />
  ) : (
    <div className='flex flex-col mt-28 max-w-4xl mx-auto rounded bg-gray-200/75 my-4 shadow-md'>
      <div className='p-8'>
        <h1 className='text-3xl font-bold mb-6'>Order {order._id}</h1>
        <div className='flex flex-col md:flex-row'>
          <div className='flex flex-col flex-grow'>
            <ul className='space-y-4'>
              <li>
                <h2 className='text-xl font-semibold'>Shipping</h2>
                <p>
                  <strong>Name:</strong>{' '}
                  {order.shippingAddress.firstName +
                    ' ' +
                    order.shippingAddress.lastName}
                </p>
                <p>
                  <strong>Email:</strong> {order.user.email}
                </p>
                <p>
                  <strong>Address:</strong> {order.shippingAddress.addressLine1}
                  , {order.shippingAddress.addressLine2}{' '}
                  {order.shippingAddress.city}, {order.shippingAddress.postcode}{' '}
                  {order.shippingAddress.country}
                </p>
                {order.isDelivered ? (
                  <Message
                    type='success'
                    message={`Delivered on ${order.deliveredAt}`}
                  />
                ) : (
                  <Message type='error' message='Not delivered' />
                )}
              </li>
              <li>
                <h2 className='text-xl font-semibold'>Payment Method</h2>
                <p>
                  <strong>Method:</strong> {order.paymentMethod}
                </p>
                {order.isPaid ? (
                  <Message type='success' message={`Paid on ${order.paidAt}`} />
                ) : (
                  <Message type='error' message='Not paid' />
                )}
              </li>
              <li>
                <h2 className='text-xl font-semibold'>Order Items</h2>
                {order.orderItems.length === 0 ? (
                  <Message type='error' message='Order is empty' />
                ) : (
                  <ul className='space-y-4'>
                    {order.orderItems.map((item: IOrderItem) => (
                      <li
                        key={item._id}
                        className='flex justify-between items-center'
                      >
                        <div className='flex items-center'>
                          <img
                            src={item.mainImage}
                            alt={item.title}
                            className='object-cover h-32 w-full rounded-md shadow-md mr-4'
                          />
                          <Link
                            to={`/product/${item.product}`}
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
              </li>
            </ul>
          </div>
          <div className='flex flex-col flex-grow mt-6 md:mt-0 md:ml-6'>
            <ul className='space-y-4'>
              <li className='border-b pb-4'>
                <h2 className='text-xl font-semibold'>Order Summary</h2>
                <div className='flex justify-between mt-2'>
                  <div>Items</div>
                  <div>${order.itemsPrice.toFixed(2)}</div>
                </div>
                <div className='flex justify-between mt-2'>
                  <div>Shipping</div>
                  <div>${order.shippingPrice.toFixed(2)}</div>
                </div>
                <div className='flex justify-between mt-2'>
                  <div>Tax</div>
                  <div>${order.taxPrice.toFixed(2)}</div>
                </div>
                <div className='flex justify-between mt-2'>
                  <div>
                    <strong>Total</strong>
                  </div>
                  <div>
                    <strong>${order.totalPrice.toFixed(2)}</strong>
                  </div>
                </div>
                {!order.isPaid && (
                  <div>
                    {isPaying && <Loader />}
                    {isPending ? (
                      <Loader />
                    ) : (
                      <div>
                        {/* <button
                          className='primary block bg-blue-500 hover:bg-blue-400 text-gray-600 px-4 py-2 mt-4 rounded shadow-md'
                          onClick={onApproveTest}
                        >
                          Go to test payment
                        </button> */}
                        <div>
                          <PayPalButtons
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={onError}
                            onCancel={onCancel}
                          ></PayPalButtons>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </li>

              {loadingDeliver && <Loader />}

              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <li>
                    <button
                      className='primary block bg-blue-500 hover:bg-blue-400 text-gray-600 px-4 py-2 mt-4 rounded shadow-md'
                      onClick={deliverOrderHandler}
                    >
                      Mark as delivered
                    </button>
                  </li>
                )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
