import { SlArrowDown } from 'react-icons/sl';
import ProductCard from '../components/ProductCard';
import { useGetProductsQuery } from '../slices/productApiSlice';
import { Product } from '../types/ProductType';
import Loader from '../components/Loader';
import Message from '../components/Message';

const Home = () => {
  const { data, isLoading, error } = useGetProductsQuery();

  const products = data as Product[] | undefined;

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
            <ul className='grid grid-cols-3 lg:grid-cols-6 gap-4 mx-4'>
              {products?.map((product: Product) => (
                <li key={product._id}>
                  <ProductCard key={product._id} product={product} />
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
