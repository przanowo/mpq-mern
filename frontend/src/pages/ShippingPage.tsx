import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { saveShippingAddress } from '../slices/cartSlice'
import { CartAppState } from '../types/CartType'
import CheckoutSteps from '../components/CheckoutSteps'

const ShippingPage = () => {
  const cart = useSelector((state: CartAppState) => state.cart)
  const { shippingAddress } = cart

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const formRef = React.useRef<HTMLFormElement>(null)
  const [formData, setFormData] = React.useState({
    firstName: shippingAddress?.firstName || '',
    lastName: shippingAddress?.lastName || '',
    addressLine1: shippingAddress?.addressLine1 || '',
    addressLine2: shippingAddress?.addressLine2 || '',
    county: shippingAddress?.county || '',
    city: shippingAddress?.city || '',
    postcode: shippingAddress?.postcode || '',
    country: shippingAddress?.country || '',
    // phoneNumber: shippingAddress.phoneNumber || '',
    // email: shippingAddress.email || '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(saveShippingAddress(formData))
    navigate('/payment')
    console.log(formData)
  }

  return (
    <div className='flex flex-col mt-28 w-2/4 mx-auto bg-gray-200/90 my-4 rounded shadow-lg'>
      <div className='p-8 '>
        <form className='w-full' onSubmit={submitHandler}>
          <CheckoutSteps
            step1={false}
            step2={false}
            step3={false}
            step4={false}
          />
          <h2 className='text-3xl font-bold text-center mb-6'>
            Shipping Details
          </h2>
          <div className='space-y-4'>
            <div className='flex flex-col'>
              <label className='mb-1 font-semibold'>First Name:</label>
              <input
                type='text'
                name='firstName'
                value={formData.firstName}
                onChange={handleChange}
                className='border border-gray-300 bg-white px-2 py-1 rounded'
                required
              />
            </div>
            <div className='flex flex-col'>
              <label className='mb-1 font-semibold'>Last Name:</label>
              <input
                type='text'
                name='lastName'
                value={formData.lastName}
                onChange={handleChange}
                className='border border-gray-300 bg-white px-2 py-1 rounded'
                required
              />
            </div>
            <div className='flex flex-col'>
              <label className='mb-1 font-semibold'>Address Line 1:</label>
              <input
                type='text'
                name='addressLine1'
                value={formData.addressLine1}
                onChange={handleChange}
                className='border border-gray-300 bg-white px-2 py-1 rounded w-full'
                required
              />
            </div>
            <div className='flex flex-col'>
              <label className='mb-1 font-semibold'>Address Line 2:</label>
              <input
                type='text'
                name='addressLine2'
                value={formData.addressLine2}
                onChange={handleChange}
                className='border border-gray-300 bg-white px-2 py-1 rounded'
              />
            </div>
            <div className='flex flex-col'>
              <label className='mb-1 font-semibold'>County:</label>
              <input
                type='text'
                name='county'
                value={formData.county}
                onChange={handleChange}
                className='border border-gray-300 bg-white px-2 py-1 rounded'
              />
            </div>
            <div className='flex flex-col'>
              <label className='mb-1 font-semibold'>City:</label>
              <input
                type='text'
                name='city'
                value={formData.city}
                onChange={handleChange}
                className='border border-gray-300 bg-white px-2 py-1 rounded'
                required
              />
            </div>
            <div className='flex flex-col'>
              <label className='mb-1 font-semibold'>Postcode:</label>
              <input
                type='text'
                name='postcode'
                value={formData.postcode}
                onChange={handleChange}
                className='border border-gray-300 bg-white px-2 py-1 rounded'
                required
              />
            </div>
            <div className='flex flex-col'>
              <label className='mb-1 font-semibold'>Country:</label>
              <input
                type='text'
                name='country'
                value={formData.country}
                onChange={handleChange}
                className='border border-gray-300 bg-white px-2 py-1 rounded'
                required
              />
            </div>

            <div className='flex justify-center pt-4'>
              {/* <button
                type='submit'
                className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow'
              >
                Continue to Payment
              </button> */}
              <p className='text-xl text-red-600'>
                The website is currently under development. Payment is not
                possible.
              </p>
              <button
                disabled
                type='submit'
                className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow'
              >
                Continue to Payment
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ShippingPage
