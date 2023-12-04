import { Link, useParams } from 'react-router-dom';
import { SlArrowDown } from 'react-icons/sl';
import ProductCard from '../components/ProductCard';
import { useGetProductsQuery } from '../slices/productApiSlice';
import { Product } from '../types/ProductType';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import CategoryCarousel from '../components/CategoryCarousel';
import Footer from '../components/Footer';

const Home = () => {
  const { pageNumber, keyword } = useParams<{
    pageNumber: string;
    keyword: string;
  }>();
  const pageNumberNum = pageNumber ? parseInt(pageNumber, 10) : 1;
  const { data, isLoading, error } = useGetProductsQuery({
    keyword: keyword,
    pageNumber: pageNumberNum,
    categoryName: '',
  });

  const isBaseHomePage = !pageNumber && !keyword;
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
          <div className='flex-col h-screen '>
            {isBaseHomePage && (
              <div className='flex justify-center items-end bg-cover bg-center h-screen lg:bg-[url(https://firebasestorage.googleapis.com/v0/b/miniparfumqueen.appspot.com/o/images%2Fbg%2Fmpq-bg.jpg?alt=media&token=68c2375b-3f6c-4bae-9cab-536a93e035f4)]'>
                <button className='cursor-pointer rounded-full bg-white text-white bg-opacity-30 px-28  text-5xl mb-16 lg:mb-6 flex'>
                  <SlArrowDown />
                </button>
              </div>
            )}
            {!keyword && isBaseHomePage ? (
              <div className='flex items-center justify-center mt-24'>
                {/* <ProductCarousel /> */}
                <CategoryCarousel />
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
            <div className='flex-col mt-16 justify-center items-center'>
              <h1 className='text-2xl text-center p-4'>All Products</h1>
              <ul className='grid grid-cols-3 lg:grid-cols-6 gap-4 lg:mx-48'>
                {products?.map((product: Product) => (
                  <li key={product._id}>
                    <ProductCard key={product._id} product={product} />
                  </li>
                ))}
              </ul>
            </div>
            <div className='flex items-center justify-center my-4'>
              <Paginate
                pages={pages}
                currentPage={pageNumberNum}
                keyword={keyword}
              />
            </div>
            <div className='flex items-center w-full justify-center my-4'>
              <Footer />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
