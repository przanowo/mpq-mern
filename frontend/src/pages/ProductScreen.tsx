import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  useCreateReviewMutation,
  useGetProductDetailsQuery,
} from '../slices/productApiSlice'
import { useDispatch } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { addToCart } from '../slices/cartSlice'
import { useSelector } from 'react-redux'
import { UserAppState } from '../types/UserType'
import { toast } from 'react-toastify'
import { Review, ReviewData } from '../types/ProductType'
// import EditProductModal from '../admin/EditProductModal'; // import the modal component
// import ImageGallery from './ImageGallery';
import Meta from '../components/Meta'
import ImageViewerModal from '../components/ImageViewerModal'

const ProductScreen = () => {
  const { productId } = useParams<{ productId: string }>()
  const { userInfo } = useSelector((state: UserAppState) => state.auth)
  const { data, isLoading, error, refetch } = useGetProductDetailsQuery(
    productId ?? ''
  )
  const product = data
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1) // Navigates back to the previous page
  }

  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isViewerOpen, setViewerOpen] = useState(false)
  const [allImages, setAllImages] = useState<string[]>([])

  const openImageViewer = (images: string[]) => {
    setAllImages(images)
    setViewerOpen(true)
  }

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation()

  const quantityOptions =
    product && product.quantity > 0
      ? [...Array(product.quantity).keys()].map((x) => (
          <option key={x + 1} value={x + 1}>
            {x + 1}
          </option>
        ))
      : null

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, qty }))
    navigate('/cart')
  }

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const reviewData: ReviewData = {
        rating,
        comment,
      }

      const result = await createReview({
        productId: product?._id,
        reviewData,
      })

      if ('data' in result && result.data) {
        toast.success('Review submitted successfully')
        setRating(0)
        setComment('')
        refetch()
      } else if ('error' in result) {
        toast.error('Error submitting review')
        console.log(result)
      }
    } catch (error) {
      toast.error('Error submitting review')
      console.log(error)
    }
  }

  return (
    <div className='flex-col m-auto lg:mt-24 mb-12 p-6 bg-white shadow-lg rounded-md items-center justify-center w-full h-full sm:w-4/5'>
      <Meta title={product ? product.title : 'Product Details'} />
      <div className='flex justify-between items-center mb-4'>
        <button
          className='bg-orange-100 px-3 py-2 rounded-md hover:bg-orange-200 transition duration-200 text-sm'
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
        <div className='flex flex-col sm:flex-col md:flex-row lg:flex-row'>
          <div className='flex flex-col md:w-5/12 md:p-2 lg:p-4 lg:w-5/12 '>
            <img
              src={product.mainImage}
              alt={product.title}
              className='w-full h-auto object-cover mb-4 rounded-md'
              onClick={() =>
                openImageViewer([product.mainImage, ...product.images])
              }
            />
            <div className='grid grid-cols-3 gap-2'>
              {product.images &&
                product.images.length > 0 &&
                product.images.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Product ${idx}`}
                    className='w-full h-24 object-cover rounded-md'
                    onClick={() =>
                      openImageViewer([product.mainImage, ...product.images])
                    }
                  />
                ))}
            </div>
          </div>
          <div className='flex flex-col md:w-7/12 md:p-2 lg:p-4 lg:w-7/12 '>
            <div className='flex flex-col lg:h-2/3'>
              <h2 className='text-2xl font-bold mb-2'>{product.title}</h2>
              <p className='text-gray-600 my-6'>
                Description: {product.description}
              </p>
              {/* <p>Size: {product.size} ml</p> */}
              {/* ... other product details ... */}
              {/* <p className='text-xl font-bold my-4'>${product.price}</p> */}

              {/* ... Quantity and Add to Cart ... */}
              

            </div>
           
          </div>
          <ImageViewerModal
            isOpen={isViewerOpen}
            images={allImages}
            onClose={() => setViewerOpen(false)}
          />
        </div>
      )}
    </div>
  )
}

export default ProductScreen
