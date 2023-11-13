import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProductDetailsQuery } from '../slices/productApiSlice';
import { useDispatch } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { addToCart } from '../slices/cartSlice';
// import EditProductModal from '../admin/EditProductModal'; // import the modal component
// import ImageGallery from './ImageGallery';

const ProductScreen = () => {
  const { productId } = useParams<{ productId: string }>();
  const { data, isLoading, error } = useGetProductDetailsQuery(productId ?? '');
  const product = data;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = null;

  const [qty, setQty] = useState(1);

  // const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // const galleryImages =
  //   product && product.images && product. images.length > 0
  //     ? product.images
  //     : [product?.mainImage];

  // const handleImageClick = () => {
  //   setIsGalleryOpen(true);
  // };

  // const handleCloseGallery = () => {
  //   setIsGalleryOpen(false);
  // };
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // const handleCloseModal = () => {
  //   setIsEditModalOpen(false);
  // };

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

  return (
    <div className='flex mx-auto mt-24 p-6 bg-white shadow-lg rounded-md items-center justify-center w-4/5 h-3/4'>
      {/* <Link to='/' className='flex'>
        <button className='bg-orange-100 mx-2 px-4 py-2 rounded-md hover:bg-orange-200 transition duration-200'>
          Go Back
        </button>
      </Link> */}

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
        <div className='flex items-start'>
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
          <div className='w-1/2 pl-4 pt-12'>
            <h2 className='text-2xl font-bold mb-2'>{product.title}</h2>
            <p className='text-gray-600 my-6'>
              Description: {product.description}
            </p>
            <p className='text-gray-600'>Stock: {product.quantity}</p>
            <p className='text-gray-600'>Sex: {product.sex}</p>
            <p className='text-gray-600'>Category: {product.category}</p>
            <p className='text-gray-600'>Type: {product.typ}</p>
            <p className='text-gray-600'>Size: {product.size} ml</p>

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
            {user ? (
              <button
                className='bg-orange-100 mx-2 px-4 py-2 rounded-md hover:bg-orange-200 transition duration-200'
                // onClick={handleEditProduct}
              >
                Edit
              </button>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductScreen;
