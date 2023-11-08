import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

type RatingProps = {
  value: number;
  text: string;
};

const Rating: React.FC<RatingProps> = ({ value, text }) => {
  return (
    <div className='flex items-center text-sm'>
      <span className='text-yellow-500'>
        {value >= 1 ? (
          <FaStar />
        ) : value >= 0.5 ? (
          <FaStarHalfAlt />
        ) : (
          <FaRegStar />
        )}
      </span>
      <span className='text-yellow-500'>
        {value >= 2 ? (
          <FaStar />
        ) : value >= 1.5 ? (
          <FaStarHalfAlt />
        ) : (
          <FaRegStar />
        )}
      </span>
      <span className='text-yellow-500'>
        {value >= 3 ? (
          <FaStar />
        ) : value >= 2.5 ? (
          <FaStarHalfAlt />
        ) : (
          <FaRegStar />
        )}
      </span>
      <span className='text-yellow-500'>
        {value >= 4 ? (
          <FaStar />
        ) : value >= 3.5 ? (
          <FaStarHalfAlt />
        ) : (
          <FaRegStar />
        )}
      </span>
      <span className='text-yellow-500'>
        {value >= 5 ? (
          <FaStar />
        ) : value >= 4.5 ? (
          <FaStarHalfAlt />
        ) : (
          <FaRegStar />
        )}
      </span>
      <span className=''>{text && text}</span>
    </div>
  );
};

export default Rating;
