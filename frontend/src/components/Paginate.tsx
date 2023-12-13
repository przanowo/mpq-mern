import React from 'react';
import { Link } from 'react-router-dom';
import { PaginateProps } from '../types/ProductType';

const Paginate: React.FC<PaginateProps> = ({
  pages,
  currentPage,
  isAdmin,
  keyword,
  categoryName,
}) => {
  const maxPageButtons = 10; // Now set to display up to 10 page buttons

  let startPage: number, endPage: number;
  if (pages <= maxPageButtons) {
    startPage = 1;
    endPage = pages;
  } else {
    const halfMaxButtons = Math.floor(maxPageButtons / 2);
    if (currentPage <= halfMaxButtons) {
      startPage = 1;
      endPage = maxPageButtons;
    } else if (currentPage + halfMaxButtons >= pages) {
      startPage = pages - maxPageButtons + 1;
      endPage = pages;
    } else {
      startPage = currentPage - halfMaxButtons;
      endPage = currentPage + halfMaxButtons - 1;
    }
  }

  const path = (page: number) => {
    if (categoryName) {
      return keyword
        ? `/category/${categoryName}/search/${keyword}/page/${page}`
        : `/category/${categoryName}/page/${page}`;
    } else {
      return !isAdmin
        ? keyword
          ? `/search/${keyword}/page/${page}`
          : `/page/${page}`
        : `/admin/productlist/page/${page}`;
    }
  };

  return pages > 1 ? (
    <div className='flex justify-center items-center '>
      {currentPage > 1 && (
        <>
          <Link to={path(1)} className='px-3 py-1 rounded-full bg-gray-200'>
            First
          </Link>
          <Link
            to={path(currentPage - 1)}
            className='px-3 py-1 rounded-full bg-gray-200'
          >
            Previous
          </Link>
        </>
      )}

      {/* {startPage > 1 && (
        <>
          <Link to={path(1)} className='px-3 py-1 rounded-full bg-gray-200'>
            1
          </Link>
          {startPage > 2 && <span className='px-3 py-1'>...</span>}
        </>
      )} */}

      {Array.from(
        { length: endPage - startPage + 1 },
        (_, i) => startPage + i
      ).map((page) => (
        <Link
          key={page}
          to={path(page)}
          className={`${
            page === currentPage ? 'bg-gray-900 text-white' : 'bg-gray-200'
          } px-3 py-1 rounded-full`}
        >
          {page}
        </Link>
      ))}

      {endPage < pages && (
        <>
          {endPage < pages - 1 && <span className='px-3 py-1'>...</span>}
          <Link to={path(pages)} className='px-3 py-1 rounded-full bg-gray-200'>
            {pages}
          </Link>
        </>
      )}

      {currentPage < pages && (
        <>
          <Link
            to={path(currentPage + 1)}
            className='px-3 py-1 rounded-full bg-gray-200'
          >
            Next
          </Link>
          <Link to={path(pages)} className='px-3 py-1 rounded-full bg-gray-200'>
            Last
          </Link>
        </>
      )}
    </div>
  ) : null;
};

export default Paginate;
