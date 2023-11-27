import React from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import { useGetTopProductsQuery } from '../slices/productApiSlice';
import Loader from './Loader';
import Message from './Message';
import { Product } from '../types/ProductType';

const ProductCarousel = () => {
  const { data, isLoading, error } = useGetTopProductsQuery({});
  const products = data as Product[];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false, // Disable side arrows
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message message={error as string} type='error' />
  ) : (
    <div className='carousel-container'>
      <Slider {...settings}>
        {products?.map((product) => (
          <div key={product._id} className='carousel-item'>
            <img
              src={product.mainImage}
              alt={product.title}
              className='max-h-96'
            />
            <div className=''>
              <p className=''>{product.title}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProductCarousel;
