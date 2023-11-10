import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
// import EditProductModal from '../admin/EditProductModal'; // import the modal component
// import ImageGallery from './ImageGallery';

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

const ProductScreen = () => {
  const user = null;
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);

  console.log(product);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await axios.get(`/api/products/${id}`);
      setProduct(data);
    };
    fetchProduct();
  }, [id]);
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

  return (
    <div className='flex mx-auto mt-24 p-6 bg-white shadow-lg rounded-md items-center justify-center w-4/5 h-3/4'>
      {/* <Link to='/' className='flex'>
        <button className='bg-orange-100 mx-2 px-4 py-2 rounded-md hover:bg-orange-200 transition duration-200'>
          Go Back
        </button>
      </Link> */}
      {product ? (
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
            <button
              className='bg-orange-100 px-4 py-2 rounded-md hover:bg-orange-200  transition duration-200'
              // onClick={handleAddToCart}
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
      ) : (
        <div>Product not found</div>
      )}
    </div>
  );
};

export default ProductScreen;
