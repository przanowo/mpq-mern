import { Link, useParams } from 'react-router-dom';
import { SlArrowDown } from 'react-icons/sl';
import ProductCard from '../components/ProductCard';
import { useGetProductsQuery } from '../slices/productApiSlice';
import { Product } from '../types/ProductType';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';

const Home = () => {
  const { pageNumber, keyword } = useParams<{
    pageNumber: string;
    keyword: string;
  }>();
  const pageNumberNum = pageNumber ? parseInt(pageNumber, 10) : 1;
  const { data, isLoading, error } = useGetProductsQuery({
    keyword: keyword,
    pageNumber: pageNumberNum,
    categoryName : ''
  });

  const products = data?.products as Product[];
  const pages = data?.pages as number;

  return (
    <>
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
      ) : (
        <>
          {' '}
          <div className='h-screen'>
            <div className='flex justify-center items-end bg-cover bg-center h-screen lg:bg-[url(https://firebasestorage.googleapis.com/v0/b/miniparfumqueen.appspot.com/o/images%2Fbg%2Fmpq-bg.jpg?alt=media&token=68c2375b-3f6c-4bae-9cab-536a93e035f4)]'>
              <button
                className='cursor-pointer rounded-full bg-white text-white bg-opacity-30 px-28  text-5xl mb-16 lg:mb-6 flex'
                // onClick={() =>
                //   nextDivRef.current.scrollIntoView({ behavior: 'smooth' })
                // }
              >
                <SlArrowDown />
              </button>
            </div>
            {!keyword ? (
              <div className=' '>
                <ProductCarousel />
              </div>
            ) : (
              <Link
                to='/'
                className='text-gray-500 hover:text-gray-900 lg:text-xl m-2'
              >
                <button className=' bg-orange-100 text-black text-center px-2 py-1 rounded-md hover:bg-orange-200 transition duration-200'>
                  Go Back
                </button>
              </Link>
            )}

            <h1>Products</h1>
            <ul className='grid grid-cols-3 lg:grid-cols-6 gap-4 mx-4'>
              {products?.map((product: Product) => (
                <li key={product._id}>
                  <ProductCard key={product._id} product={product} />
                </li>
              ))}
            </ul>
            <div className='my-4'>
              <Paginate
                pages={pages}
                currentPage={pageNumberNum}
                keyword={keyword}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
