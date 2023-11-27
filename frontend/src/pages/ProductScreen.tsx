import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useCreateReviewMutation,
  useGetProductDetailsQuery,
} from '../slices/productApiSlice';
import { useDispatch } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { addToCart } from '../slices/cartSlice';
import { useSelector } from 'react-redux';
import { UserAppState } from '../types/UserType';
import { toast } from 'react-toastify';
import { Review, ReviewData } from '../types/ProductType';
// import EditProductModal from '../admin/EditProductModal'; // import the modal component
// import ImageGallery from './ImageGallery';
import Meta from '../components/Meta';

const ProductScreen = () => {
  const { productId } = useParams<{ productId: string }>();
  const { userInfo } = useSelector((state: UserAppState) => state.auth);
  const { data, isLoading, error, refetch } = useGetProductDetailsQuery(
    productId ?? ''
  );
  const product = data;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Navigates back to the previous page
  };

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const quantityOptions =
    product && product.quantity > 0
      ? [...Array(product.quantity).keys()].map((x) => (
          <option key={x + 1} value={x + 1}>
            {x + 1}
          </option>
        ))
      : null;

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const reviewData: ReviewData = {
        rating,
        comment,
      };

      const result = await createReview({
        productId: product?._id,
        reviewData,
      });

      if ('data' in result && result.data) {
        toast.success('Review submitted successfully');
        setRating(0);
        setComment('');
        refetch();
      } else if ('error' in result) {
        toast.error('Error submitting review');
        console.log(result);
      }
    } catch (error) {
      toast.error('Error submitting review');
      console.log(error);
    }
  };

  return (
    <div className='flex-col mx-auto mt-24 p-6 bg-white shadow-lg rounded-md items-center justify-center w-4/5 h-3/4'>
      <div className='flex justify-between items-center mb-4'>
        <button
          className=' bg-orange-100 px-4 py-2 rounded-md hover:bg-orange-200  transition duration-200'
          onClick={handleBack}
        >
          Go Back
        </button>
      </div>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message
          message={
            (error as any)?.data?.message ||
            (error as any)?.error ||
            'An error occurred'
          }
          type='error'
        />
      ) : !product ? (
        <Message message='Product not found' type='error' />
      ) : (
        <div className='flex justify-between'>
          <Meta title={product.title} />

          <div className='flex '>
            <div className='p-4 w-2/5 h-3/4 relative'>
              <img
                src={product.mainImage}
                alt={product.title}
                className='w-full h-full object-cover mb-4 rounded-md cursor-pointer'
                // onClick={handleImageClick}
              />
              <div className='grid grid-cols-3 gap-2 cursor-pointer w-2/3'>
                {product.images &&
                  product.images.length > 0 &&
                  product.images.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Product ${idx}`}
                      className='w-full h-24 object-cover rounded-md'
                      // onClick={handleImageClick}
                    />
                  ))}
              </div>
            </div>
          </div>
          <div className='flex '>
            <div className=' w-1/2 pl-4 pt-12'>
              <h2 className='text-2xl font-bold mb-2'>{product.title}</h2>
              <p className='text-gray-600 my-6'>
                Description: {product.description}
              </p>
              <p className='text-gray-600'>Stock: {product.quantity}</p>
              <p className='text-gray-600'>Sex: {product.sex}</p>
              <p className='text-gray-600'>Category: {product.category}</p>
              <p className='text-gray-600'>Type: {product.typ}</p>
              <p className='text-gray-600'>{`Size: {product.size} ml`}</p>

              <p className='text-xl font-bold my-4'>${product.price}</p>
              {/* <p className="mb-2"><span className="font-semibold">Brand:</span> {product.brand}</p> */}
              {/* <p className="mb-2">{product.ml} ml</p> */}

              {product && product.quantity > 0 && (
                <div className='flex items-center'>
                  <p className='mr-2'>Quantity:</p>
                  <select
                    className='border border-gray-300 rounded-md px-2 py-1'
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                  >
                    {quantityOptions}
                  </select>
                </div>
              )}

              <button
                className='bg-orange-100 px-4 py-2 rounded-md hover:bg-orange-200  transition duration-200'
                disabled={product && product.quantity === 0}
                onClick={handleAddToCart}
              >
                Add to cart
              </button>
            </div>
          </div>

          <div className='flex mt-12'>
            <div className='flex flex-col'>
              <h2 className='text-2xl font-bold mb-2'>Reviews</h2>
              {product.reviews.length === 0 && (
                <Message message='No Reviews' type='info' />
              )}
              {product.reviews.map((review) => (
                <div
                  key={review._id}
                  className='flex flex-col border border-gray-300 rounded-md p-4 my-4'
                >
                  <div className='flex items-center'>
                    <p className='font-semibold mr-2'>{review.name}</p>
                    <p className='text-gray-600'>{review.createdAt}</p>
                  </div>
                  <p className='text-gray-600'>{review.comment}</p>
                </div>
              ))}
              <div className='flex flex-col'>
                <h2 className='text-2xl font-bold mb-2'>
                  Write a customer review
                </h2>
                {loadingProductReview && <Loader />}
                {userInfo ? (
                  <form className='flex flex-col' onSubmit={submitHandler}>
                    <div className='flex items-center'>
                      <label className='mr-2'>Rating</label>
                      <select
                        className='border border-gray-300 rounded-md px-2 py-1'
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                      >
                        <option value=''>Select...</option>
                        <option value='1'>1 - Poor</option>
                        <option value='2'>2 - Fair</option>
                        <option value='3'>3 - Good</option>
                        <option value='4'>4 - Very Good</option>
                        <option value='5'>5 - Excellent</option>
                      </select>
                    </div>
                    <div className='flex flex-col'>
                      <label className='mt-4'>Comment</label>
                      <textarea
                        className='border border-gray-300 rounded-md px-2 py-1'
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      ></textarea>
                    </div>
                    <button
                      className='bg-orange-100 px-4 py-2 rounded-md hover:bg-orange-200  transition duration-200'
                      type='submit'
                      disabled={loadingProductReview}
                    >
                      Submit
                    </button>
                  </form>
                ) : (
                  <Message
                    message='Please login to write a review'
                    type='info'
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductScreen;
