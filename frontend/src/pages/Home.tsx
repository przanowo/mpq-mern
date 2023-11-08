import React from 'react';
import { SlArrowDown } from 'react-icons/sl';
import { products } from '../products';
import ProductCard from '../components/ProductCard';

const Home = () => {
  return (
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
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard key={product.id} product={product} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
