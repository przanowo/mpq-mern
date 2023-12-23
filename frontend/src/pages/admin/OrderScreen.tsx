import { FaTimes } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import { useGetOrdersQuery } from '../../slices/ordersApiSlice'

const OrderScreen = () => {
  const { data: orders, error, isLoading } = useGetOrdersQuery({})

  return (
    <div className='mt-6 mx-auto p-4'>
      <h1 className='text-xl font-bold mb-4'>Orders</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message type='error' message='Failed to loading orders' />
      ) : (
        <div className='overflow-x-auto'>
          <table className='min-w-full bg-white shadow-md rounded-lg'>
            <thead className='bg-gray-200'>
              <tr>
                <th className='py-2 px-3 text-left text-sm'>ID</th>
                <th className='py-2 px-3 text-left text-sm'>USER</th>
                <th className='py-2 px-3 text-left text-sm'>DATE</th>
                <th className='py-2 px-3 text-left text-sm'>TOTAL</th>
                <th className='py-2 px-3 text-left text-sm'>PAID</th>
                <th className='py-2 px-3 text-left text-sm'>DELIVERED</th>
                <th className='py-2 px-3 text-left text-sm'></th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order: any) => (
                <tr key={order._id} className='border-b'>
                  <td className='py-2 px-3 text-sm'>{order._id}</td>
                  <td className='py-2 px-3 text-sm'>
                    {order.user && order.user.name}
                  </td>
                  <td className='py-2 px-3 text-sm'>
                    {order.createdAt.substring(0, 10)}
                  </td>
                  <td className='py-2 px-3 text-sm'>${order.totalPrice}</td>
                  <td className='py-2 px-3 text-sm'>
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <FaTimes className='text-red-500' />
                    )}
                  </td>
                  <td className='py-2 px-3 text-sm'>
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <FaTimes className='text-red-500' />
                    )}
                  </td>
                  <td className='py-2 px-3 text-sm'>
                    <Link to={`/order/${order._id}`}>
                      <button className='bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded text-xs'>
                        Details
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default OrderScreen
