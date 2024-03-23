import React from 'react'
import { Link } from 'react-router-dom'
import { PaginateProps } from '../types/ProductType'

const Paginate: React.FC<PaginateProps> = ({
  pages,
  currentPage,
  isAdmin,
  keyword,
  categoryName,
  sortBy,
}) => {
  const maxPageButtons = 10 // Now set to display up to 10 page buttons

  let startPage: number, endPage: number
  if (pages <= maxPageButtons) {
    startPage = 1
    endPage = pages
  } else {
    const halfMaxButtons = Math.floor(maxPageButtons / 2)
    if (currentPage <= halfMaxButtons) {
      startPage = 1
      endPage = maxPageButtons
    } else if (currentPage + halfMaxButtons >= pages) {
      startPage = pages - maxPageButtons + 1
      endPage = pages
    } else {
      startPage = currentPage - halfMaxButtons
      endPage = currentPage + halfMaxButtons - 1
    }
  }

  const path = (page: number) => {
    let basePath = isAdmin ? '/admin/productlist' : ''
    basePath += categoryName ? `/category/${categoryName}` : ''
    let searchPath = keyword ? `/search/${keyword}` : ''
    let sortPath = sortBy ? `/sort/${sortBy}` : ''
    let pagePath = `/page/${page}`

    return `${basePath}${searchPath}${sortPath}${pagePath}`
  }

  return pages > 1 ? (
    <div className='flex justify-center items-center flex-wrap mt-4'>
      {currentPage > 1 && (
        <>
          <Link
            to={path(1)}
            className='px-2 py-1 mx-1 rounded-full bg-gray-200 text-gray-700 text-sm'
          >
            First
          </Link>
          <Link
            to={path(currentPage - 1)}
            className='px-2 py-1 mx-1 rounded-full bg-gray-200 text-gray-700 text-sm'
          >
            Previous
          </Link>
        </>
      )}

      {Array.from(
        { length: endPage - startPage + 1 },
        (_, i) => startPage + i
      ).map((page) => (
        <Link
          key={page}
          to={path(page)}
          className={`${
            page === currentPage
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          } px-2 py-1 mx-1 rounded-full text-sm`}
        >
          {page}
        </Link>
      ))}

      {endPage < pages && (
        <>
          {endPage < pages - 1 && (
            <span className='px-1 py-1 text-gray-500 text-sm mx-1'>...</span>
          )}
          <Link
            to={path(pages)}
            className='px-2 py-1 mx-1 rounded-full bg-gray-200 text-gray-700 text-sm'
          >
            {pages}
          </Link>
        </>
      )}

      {currentPage < pages && (
        <>
          <Link
            to={path(currentPage + 1)}
            className='px-2 py-1 mx-1 rounded-full bg-gray-200 text-gray-700 text-sm'
          >
            Next
          </Link>
          <Link
            to={path(pages)}
            className='px-2 py-1 mx-1 rounded-full bg-gray-200 text-gray-700 text-sm'
          >
            Last
          </Link>
        </>
      )}
    </div>
  ) : null
}

export default Paginate
