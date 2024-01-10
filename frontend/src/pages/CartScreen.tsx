import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { CartAppState, CartItem } from '../types/CartType'
import { Product } from '../types/ProductType'
import { useState } from 'react'
import { addToCart, removeFromCart } from '../slices/cartSlice'
// import { Message } from '../components/Message';

const CartScreen = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [qty, setQty] = useState(1)
  const cart = useSelector((state: CartAppState) => state.cart)
  const { cartItems } = cart

  const addToCartHandler = (product: CartItem, qty: number) => {
    dispatch(addToCart({ ...product, qty }))
  }

  const removeFromCartHandler = (id: string) => {
    dispatch(removeFromCart(id))
  }

  const increaseQuantity = (id: string) => {
    const product = cartItems.find((item) => item._id === id)
    if (product && product.quantity > product.qty) {
      dispatch(addToCart({ ...product, qty: product.qty + 1 }))
    }
  }

  const decreaseQuantity = (id: string) => {
    const product = cartItems.find((item) => item._id === id)
    if (product && product.qty > 1) {
      dispatch(addToCart({ ...product, qty: product.qty - 1 }))
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className='flex flex-grow justify-center'>
        Your cart is empty.<Link to={'/'}>Go back</Link>
      </div>
    )
  }

  return (
    <div className='mt-24 mx-auto w-full px-4'>
      <div className='bg-gray-200 p-4 rounded-md shadow-md text-center'>
        <h2 className='text-2xl font-bold mb-4'>Your Cart</h2>
        <ul>
          {cartItems?.map((product) => (
            <li
              key={product._id}
              className='mb-4 border-b pb-4 last:border-b-0'
            >
              <div className='flex flex-row items-center'>
                <div className='flex-shrink-0 mr-4'>
                  <Link to={`/product/${product._id}`}>
                    <img
                      src={product.mainImage}
                      alt={product.title}
                      className='object-cover h-32 w-32 rounded-md shadow-md'
                    />
                  </Link>
                </div>
                <div className='flex-1 overflow-hidden'>
                  <Link to={`/product/${product._id}`} className='block'>
                    <h3 className='text-lg font-semibold truncate'>
                      {product.title}
                    </h3>
                    <p className='text-xl font-bold mt-1'>${product.price}</p>
                    <p>Quantity: {product.qty}</p>
                  </Link>
                  <div className='flex items-center mt-2 space-x-2'>
                    <button
                      onClick={() => increaseQuantity(product._id)}
                      className='bg-blue-500 hover:bg-blue-400 text-white px-2 py-1 rounded-full shadow-md text-sm'
                    >
                      +
                    </button>
                    {product && product.qty > 0 && (
                      <select
                        className='border border-gray-300 text-gray-700 rounded-md px-2 py-1 text-sm'
                        value={product.qty}
                        onChange={(e) =>
                          addToCartHandler(product, Number(e.target.value))
                        }
                      >
                        {cartItems && product.quantity > 0
                          ? [...Array(product.quantity).keys()].map((x) => (
                              <option key={x + 1} value={x + 1}>
                                {x + 1}
                              </option>
                            ))
                          : null}
                      </select>
                    )}
                    <button
                      onClick={() => decreaseQuantity(product._id)}
                      disabled={product.quantity <= 1}
                      className={`px-2 py-1 rounded-full shadow-md text-sm ${
                        product.quantity <= 1
                          ? 'bg-gray-200/25 cursor-not-allowed'
                          : 'bg-gray-400 hover:bg-gray-500 text-white'
                      }`}
                    >
                      -
                    </button>
                    <button
                      onClick={() => removeFromCartHandler(product._id)}
                      className='bg-red-300 hover:bg-red-400 text-white px-2 py-1 rounded-md shadow-md text-sm'
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className='flex justify-between mt-4'>
          <span className='text-lg font-semibold'>
            Total: €{cart.totalPrice.toFixed(2)}
          </span>
          {/* <Link to='/shipping'>
            <button className='bg-orange-400 hover:bg-orange-500 text-white px-3 py-1 rounded text-sm'>
              Add Shipping Details
            </button>
          </Link> */}
          <p className='text-xl text-red-600'>
            The website is currently under development. Payment is not possible.
          </p>
        </div>
      </div>
    </div>
  )
}

export default CartScreen
