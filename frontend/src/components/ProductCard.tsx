import { Link } from 'react-router-dom'
import Rating from './Rating'
import { Product } from '../types/ProductType'
import { useDispatch } from 'react-redux'
import { addToCart } from '../slices/cartSlice'
// import AuthContext from '../../hooks/AuthContext';
// import { Link, useNavigate } from 'react-router-dom';
// import { CartContext } from '../../hooks/CartContext';
// import EditProductModal from '../admin/EditProductModal'; // import the modal component

const ProductCard = ({ product }: { product: Product }) => {
  // const navigate = useNavigate();
  // const user = null;
  // const cart = [];
  // const [currentProduct, setCurrentProduct] = useState(product);
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // const handleEditProduct = () => {
  //   setIsEditModalOpen(true);
  // };

  // const handleCloseModal = () => {
  //   setIsEditModalOpen(false);
  // };

  // const handleSaveProduct = (editedProduct) => {
  //   // Save the edited product to the database or wherever necessary.
  //   setCurrentProduct(editedProduct); // update the displayed product
  // };

  const dispatch = useDispatch()
  const qty = 1

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, qty }))
  }

  return (
    <div
      key={product._id}
      className='border p-4 rounded-md hover:shadow-lg transition-shadow duration-300'
    >
      <Link to={`/product/${product._id}`} key={product._id}>
        <div className=' bg-gray-200 overflow-hidden rounded-md'>
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
          <img
            src={product.mainImage}
            alt={product.title}
            className='object-cover h-full w-full'
          />
        </div>
        <div></div>
        <div className='mt-4'>
          <h3 className='text-sm text-gray-700 font-semibold overflow-hidden h-[60px]'>
            {product.title}
          </h3>

          <p className='text-lg font-bold mt-2 text-gray-700'>
            ${product.price}
          </p>
        </div>
      </Link>
      <div className='mt-2'>
        <button
          className=' bg-orange-100 text-black text-center px-2 py-1 rounded-md hover:bg-orange-200 transition duration-200'
          disabled={product.quantity === 0}
          onClick={handleAddToCart}
        >
          Add to cart
        </button>
        {/* {user ? (
          <button
            className='hidden lg:inline-block bg-orange-100 text-black text-center px-2 py-1 rounded-md hover:bg-orange-200 transition duration-200'
            
          >
            Edit
          </button>
        ) : null} */}
      </div>
      {/* Conditionally render the EditProductModal */}
      {/* {isEditModalOpen &&
        (console.log(currentProduct),
        (
          <EditProductModal
            product={currentProduct}
            onClose={handleCloseModal}
            onSave={handleSaveProduct}
            productId={productId}
          />
        ))} */}
    </div>
  )
}

export default ProductCard
