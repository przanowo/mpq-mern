import React from 'react';
import { Link } from 'react-router-dom';
import Rating from './Rating';
// import AuthContext from '../../hooks/AuthContext';
// import { Link, useNavigate } from 'react-router-dom';
// import { CartContext } from '../../hooks/CartContext';
// import EditProductModal from '../admin/EditProductModal'; // import the modal component

interface Product {
  _id: string;
  category: string;
  createdAt: number;
  currency: string;
  description: string;
  discount: string;
  featured: string;
  images: string[];
  liked: string;
  magazine: string;
  mainImage: string;
  nowe: string;
  price: number;
  quantity: string;
  ratings: number;
  numRatings: number;
  sex: string;
  show: string;
  size: string;
  title: string;
  titletolow: string;
  typ: string;
}

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

  return (
    <div
      key={product._id}
      className='border p-4 rounded-md hover:shadow-lg transition-shadow duration-300'
    >
      <Link to={`/product/${product._id}`} key={product._id}>
        <div className=' bg-gray-200 overflow-hidden rounded-md'>
          <Rating
            value={product.ratings}
            text={`${product.numRatings} reviews`}
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
        <button className=' bg-orange-100 text-black text-center px-2 py-1 rounded-md hover:bg-orange-200 transition duration-200'>
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
  );
};

export default ProductCard;
