import React from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const categories = [
  {
    name: 'vintage',
    imageUrl:
      'https://firebasestorage.googleapis.com/v0/b/miniparfumqueen.appspot.com/o/images%2Fbg%2Fvintage.jpg?alt=media&token=a46c7ea3-0988-4307-bd54-2d31e25d6832',
  },
  {
    name: 'miniature',
    imageUrl:
      'https://firebasestorage.googleapis.com/v0/b/miniparfumqueen.appspot.com/o/images%2Fbg%2Fminiature.jpg?alt=media&token=4012f362-73f8-4b5f-a371-5845355a944d',
  },
  {
    name: 'perfume',
    imageUrl:
      'https://firebasestorage.googleapis.com/v0/b/miniparfumqueen.appspot.com/o/images%2Fbg%2Fperfume.jpg?alt=media&token=d396d83c-5a15-40a2-8938-6fc55a31463a',
  },
  {
    name: 'sample',
    imageUrl:
      'https://firebasestorage.googleapis.com/v0/b/miniparfumqueen.appspot.com/o/images%2Fbg%2Fsample.jpg?alt=media&token=35f967b0-d218-4c2e-8867-5e0a8575a48c',
  },
  {
    name: 'soap',
    imageUrl:
      'https://firebasestorage.googleapis.com/v0/b/miniparfumqueen.appspot.com/o/images%2Fbg%2FSOAP.jpg?alt=media&token=0c4d3b4b-8816-4081-b27e-b03e1a81fae5',
  },
  {
    name: 'gift',
    imageUrl:
      'https://firebasestorage.googleapis.com/v0/b/miniparfumqueen.appspot.com/o/images%2Fbg%2FGIFT.jpg?alt=media&token=813c0bc1-33f1-4575-b553-9fa1b1b3e074',
  },
  {
    name: 'gold',
    imageUrl:
      'https://firebasestorage.googleapis.com/v0/b/miniparfumqueen.appspot.com/o/images%2Fbg%2FGOLD.jpg?alt=media&token=d3b8c8d9-9219-436a-bcca-27b82ac333f8',
  },
];

const CategoryCarousel = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/category/${categoryName}`);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    responsive: [
      // ... your responsive settings
    ],
  };

  return (
    <div className='carousel-container w-3/4'>
      <Slider {...settings}>
        {categories.map((category) => (
          <div
            key={category.name}
            className='category-item w-full bg-cover bg-center cursor-pointer'
            onClick={() => handleCategoryClick(category.name)}
          >
            <img src={category.imageUrl} alt={category.name} className='' />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CategoryCarousel;
