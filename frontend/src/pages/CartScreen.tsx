import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { AppState, CartItem } from '../types/CartType';
import { Product } from '../types/ProductType';
import { useState } from 'react';
import { addToCart, removeFromCart } from '../slices/cartSlice';
// import { Message } from '../components/Message';

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [qty, setQty] = useState(1);
  const cart = useSelector((state: AppState) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product: CartItem, qty: number) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id: string) => {
    dispatch(removeFromCart(id));
  };

  if (cartItems.length === 0) {
    return (
      <div className='flex flex-grow justify-center'>
        Your cart is empty.<Link to={'/'}>Go back</Link>
      </div>
    );
  }

  return (
    <div className='flex flex-col flex-grow bg-gray-200/50 p-8 rounded-md shadow-md w-full max-w-4xl mx-auto'>
      <div className='flex justify-center'>
        <h2 className='flex text-3xl font-bold mb-6'>Your Cart</h2>
      </div>
      <div>
        <ul>
          {cartItems?.map((product) => (
            <li
              key={product._id}
              className='mb-4 border-b pb-4 last:border-b-0'
            >
              <div className='flex justify-between items-center'>
                <div className='max-w-xl mr-4'>
                  <Link to={`/product/${product._id}`}>
                    <img
                      src={product.mainImage}
                      alt={product.title}
                      className='object-cover h-32 w-full rounded-md shadow-md'
                    />
                  </Link>
                </div>
                <div className='flex-1'>
                  <Link to={`/product/${product._id}`}>
                    <h3 className='text-lg font-semibold'>{product.title}</h3>
                    <p className='text-xl font-bold mt-2'>${product.price}</p>
                    <p className='text-gray-600'>Quantity: {product.qty}</p>
                  </Link>
                </div>

                <div className='flex items-center'>
                  <button
                    // onClick={() => increaseQuantity(product.id)}
                    className='bg-blue-500 hover:bg-blue-400 text-white px-3 py-1 rounded-full shadow-md mr-2'
                  >
                    +
                  </button>
                  {product && product.qty > 0 && (
                    <div className='flex items-center'>
                      <p className='mr-2'>Quantity:</p>
                      <select
                        className='border border-gray-300 rounded-md px-2 py-1'
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
                    </div>
                  )}
                  <button
                    // onClick={() => decreaseQuantity(product.id)}
                    disabled={product.quantity <= 1}
                    className={`px-3 py-1 rounded-full shadow-md ${
                      product.quantity <= 1
                        ? 'bg-gray-200/25 cursor-not-allowed'
                        : 'bg-gray-400 hover:bg-gray-500 text-white'
                    }`}
                  >
                    -
                  </button>
                  <button
                    onClick={() => removeFromCartHandler(product._id)}
                    className='ml-2 bg-red-300 hover:bg-red-400 text-white px-4 py-1 rounded-full shadow-md'
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className='mt-6'>
        <strong className='text-xl font-semibold'>Total: </strong>
        <span className='text-xl'>
          $
          {cartItems
            .reduce((acc, product) => acc + product.price * product.quantity, 0)
            .toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default CartScreen;
