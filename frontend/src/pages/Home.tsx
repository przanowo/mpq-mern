import React, { useEffect, useState } from 'react';
import { SlArrowDown } from 'react-icons/sl';
import ProductCard from '../components/ProductCard';
import axios from 'axios';

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

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await axios.get('/api/products');
      setProducts(data);
    };
    fetchProducts();
  }, []);

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
          <li key={product._id}>
            <ProductCard key={product._id} product={product} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
