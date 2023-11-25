import React from 'react';
import { Link } from 'react-router-dom';
import { PaginateProps } from '../types/ProductType';

const Paginate: React.FC<PaginateProps> = ({
  pages,
  currentPage,
  isAdmin,
  keyword,
}) => {
  return pages > 1 ? (
    <div className='flex justify-center items-center space-x-2'>
      {[...Array(pages).keys()].map((x) => (
        <Link
          key={x + 1}
          to={
            !isAdmin
              ? keyword
                ? `/search/${keyword}/page/${x + 1}`
                : `/page/${x + 1}`
              : `/admin/productlist/${x + 1}`
          }
          className={`${
            x + 1 === currentPage ? 'bg-gray-900 text-white' : 'bg-gray-200'
          } px-3 py-1 rounded-full`}
        >
          {x + 1}
        </Link>
      ))}
    </div>
  ) : null;
};

export default Paginate;
