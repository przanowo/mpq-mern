import { FaTimes } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import { useGetOrdersQuery } from '../../slices/ordersApiSlice'

const OrderScreen = () => {
  const dispatch = useDispatch()
  const { data: orders, error, isLoading } = useGetOrdersQuery({})

  return (
    <div className='mt-24'>
      <h1 className='text-2xl font-bold mb-4'>Orders</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message type='error' message='Failed to loading orders' />
      ) : (
        <table className='min-w-full bg-white shadow-md rounded-lg'>
          <thead className='bg-gray-200'>
            <tr>
              <th className='py-2 px-4 text-left'>ID</th>
              <th className='py-2 px-4 text-left'>USER</th>
              <th className='py-2 px-4 text-left'>DATE</th>
              <th className='py-2 px-4 text-left'>TOTAL</th>
              <th className='py-2 px-4 text-left'>PAID</th>
              <th className='py-2 px-4 text-left'>DELIVERED</th>
              <th className='py-2 px-4 text-left'></th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order: any) => (
              <tr key={order._id} className='border-b'>
                <td className='py-2 px-4'>{order._id}</td>
                <td className='py-2 px-4'>{order.user && order.user.name}</td>
                <td className='py-2 px-4'>
                  {order.createdAt.substring(0, 10)}
                </td>
                <td className='py-2 px-4'>${order.totalPrice}</td>
                <td className='py-2 px-4'>
                  {order.isPaid ? (
                    order.paidAt.substring(0, 10)
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td className='py-2 px-4'>
                  {order.isDelivered ? (
                    order.deliveredAt.substring(0, 10)
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td className='py-2 px-4'>
                  <Link to={`/order/${order._id}`}>
                    <button className='text-sm bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline'>
                      Details
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default OrderScreen
