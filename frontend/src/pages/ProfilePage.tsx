import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useProfileMutation } from '../slices/usersApiSlice'
import Loader from '../components/Loader'
import { toast } from 'react-toastify'
import { setCredentials } from '../slices/authSlice'
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice'
import Message from '../components/Message'
import { FaTimes } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const ProfilePage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  const dispatch = useDispatch()

  const { userInfo } = useSelector((state: any) => state.auth)

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation()

  const { data: orders, isLoading, error } = useGetMyOrdersQuery({})

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name)
      setEmail(userInfo.email)
    }
  }, [dispatch, userInfo, userInfo.name, userInfo.email])

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (password !== passwordConfirm) {
      toast.error('Passwords do not match')
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          name,
          email,
          password,
        }).unwrap()
        dispatch(setCredentials(res))
        toast.success('Profile Updated')
      } catch (error: any) {
        toast.error(error?.data?.message || error?.error)
      }
    }
  }
  return (
    <div className='m-4'>
      <form onSubmit={submitHandler} className='space-y-4'>
        <div>
          <h1 className='text-2xl font-bold'>User Profile</h1>
        </div>
        <div>
          <label htmlFor='name' className='block'>
            Name
          </label>
          <input
            type='text'
            id='name'
            placeholder='Enter name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='w-full p-2 border rounded'
          />
        </div>
        <div>
          <label htmlFor='email' className='block'>
            Email Address
          </label>
          <input
            type='email'
            id='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full p-2 border rounded'
          />
        </div>
        <div>
          <label htmlFor='password' className='block'>
            Password
          </label>
          <input
            type='password'
            id='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full p-2 border rounded'
          />
        </div>
        <div>
          <label htmlFor='passwordConfirm' className='block'>
            Confirm Password
          </label>
          <input
            type='password'
            id='passwordConfirm'
            placeholder='Confirm password'
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className='w-full p-2 border rounded'
          />
        </div>
        <div className='flex justify-between items-center'>
          <button
            type='submit'
            className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
          >
            Update
          </button>
          {loadingUpdateProfile && <Loader />}
        </div>
      </form>
      <div className='mt-6'>
        <h2 className='text-xl font-bold'>My Orders</h2>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message message='Error loading orders' type='error' />
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full'>
              <thead>
                <tr>
                  <th className='px-4 py-2 border'>ID</th>
                  <th className='px-4 py-2 border'>DATE</th>
                  <th className='px-4 py-2 border'>TOTAL</th>
                  <th className='px-4 py-2 border'>PAID</th>
                  <th className='px-4 py-2 border'>DELIVERED</th>
                  <th className='px-4 py-2 border'></th>
                </tr>
              </thead>
              <tbody>
                {orders?.map((order: any) => (
                  <tr key={order._id}>
                    <td className='px-4 py-2 border'>{order._id}</td>
                    <td className='px-4 py-2 border'>
                      {order.createdAt.substring(0, 10)}
                    </td>
                    <td className='px-4 py-2 border'>{order.totalPrice}</td>
                    <td className='px-4 py-2 border'>
                      {order.isPaid ? (
                        order.paidAt.substring(0, 10)
                      ) : (
                        <FaTimes style={{ color: 'red' }} />
                      )}
                    </td>
                    <td className='px-4 py-2 border'>
                      {order.isDelivered ? (
                        order.deliveredAt.substring(0, 10)
                      ) : (
                        <FaTimes style={{ color: 'red' }} />
                      )}
                    </td>
                    <td className='px-4 py-2 border'>
                      <Link to={`/order/${order._id}`}>
                        <button
                          type='button'
                          className='px-2 py-1 bg-gray-200 rounded hover:bg-gray-300'
                        >
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
    </div>
  )
}

export default ProfilePage
