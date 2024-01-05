import React, { useEffect, useState } from 'react'
import {
  useUpdateProductMutation,
  useGetProductDetailsQuery,
  useUploadProductImageMutation,
} from '../../slices/productApiSlice'
import Loader from '../../components/Loader'
import Message from '../../components/Message'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from '../../slices/usersApiSlice'

const UserEditScreen = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: user, isLoading, error } = useGetUserDetailsQuery(id ?? '')

  const [updateUser, { isLoading: loadingUpdate, error: errorUpdate }] =
    useUpdateUserMutation()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
      setIsAdmin(user.isAdmin)
    }
  }, [user])

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const updatedUser = {
      _id: id,
      name,
      email,
      isAdmin,
    }

    const result = await updateUser(updatedUser)
    try {
      if ('data' in result && result.data) {
        toast.success('Product updated successfully')
        navigate('/admin/userlist')
      } else if ('error' in result) {
        toast.error('Error updating product')
        console.log(result.error)
      }
    } catch (error: any) {
      toast.error('Error updating product catch')
      console.log(error)
    }
  }

  return (
    <div className='flex w-full p-12 mb-16 bg-white'>
      <Link
        to='/admin/userlist'
        className='flex mt-24 text-blue-500 hover:text-blue-600 text-2xl font-bold'
      >
        Go Back
      </Link>
      <div className='flex flex-col items-center justify-center'>
        <h1 className='text-3xl mt-24 mb-8 font-bold'>Edit Users</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && (
          <Message type='error' message={errorUpdate.toString()} />
        )}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message type='error' message={error.toString()} />
        ) : (
          <div className='flex w-full'>
            <form className='flex-row w-full' onSubmit={submitHandler}>
              <div className='flex flex-wrap -mx-3 mb-6'>
                <div className='w-full px-3'>
                  <label htmlFor='name'>Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white'
                    id='name'
                    type='text'
                    placeholder='Enter name'
                  />
                </div>
              </div>
              <div className='flex flex-wrap -mx-3 mb-6'>
                <div className='w-full px-3'>
                  <label htmlFor='email'>Email</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white'
                    id='email'
                    type='email'
                    placeholder='Enter email'
                  />
                </div>
              </div>
              <div className='flex flex-wrap -mx-3 mb-6'>
                <div className='w-full px-3'>
                  <label htmlFor='isAdmin'>Is Admin</label>
                  <input
                    checked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)}
                    className='form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300'
                    id='isAdmin'
                    type='checkbox'
                  />
                </div>
              </div>
              <button
                type='submit'
                className='bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded'
              >
                Update User
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserEditScreen
