import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const SearchSort = ({ isAdmin = false }) => {
  const navigate = useNavigate()
  const {
    keyword: urlKeyword,
    categoryName: urlCategoryName,
    sortBy: urlSortBy,
  } = useParams()
  const [keyword, setKeyword] = useState(urlKeyword || '')
  const [sort, setSort] = useState(urlSortBy || '')
  const [categoryName, setCategoryName] = useState(urlCategoryName || '')

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    let basePath = isAdmin ? '/admin/productlist' : ''
    let searchPath = keyword.trim() ? `/search/${keyword}` : ''
    let sortPath = sort ? `/sort/${sort}` : ''
    let categoryPath = categoryName ? `/category/${categoryName}` : ''
    navigate(`${basePath}${categoryPath}${searchPath}${sortPath}`)
  }

  const clearSearch = () => {
    setKeyword('')
    setCategoryName('')
    setSort('')
    navigate(isAdmin ? '/admin/productlist' : '/')
  }

  return (
    <div className='flex flex-wrap justify-center gap-4 p-4'>
      <form
        className='flex flex-col md:flex-row items-center gap-4 w-full max-w-4xl'
        onSubmit={submitHandler}
      >
        {/* Category Selection */}
        <select
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className='w-full md:w-1/4 p-2 border rounded shadow-sm'
        >
          <option value=''>All Categories</option>
          <option value='soapandpowder'>Soap and Powder</option>
          <option value='gold'>Gold</option>
          <option value='sample'>Sample</option>
          <option value='miniature'>Miniature</option>
          <option value='perfume'>Perfume</option>
          <option value='gift'>Gift</option>
        </select>

        {/* Sorting Selection */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className='w-full md:w-1/4 p-2 border rounded shadow-sm'
        >
          <option value=''>Select Sort</option>
          <option value='priceAsc'>Price: Low to High</option>
          <option value='priceDesc'>Price: High to Low</option>
          <option value='titleAsc'>Title: Low to High</option>
          <option value='titleDesc'>Title: High to Low</option>
          <option value='quantityAsc'>Quantity: Low to High</option>
          <option value='quantityDesc'>Quantity: High to Low</option>
          <option value='updatedAsc'>Updated: Newest first</option>
          <option value='updatedDesc'>Updated: Oldest first</option>
          {/* Add more sorting options as needed */}
        </select>

        {/* Keyword Search Input */}
        <input
          type='text'
          placeholder='Search Products...'
          onChange={(e) => setKeyword(e.target.value)}
          value={keyword}
          className='w-full md:w-1/4 p-2 border rounded shadow-sm'
        />

        <div className='flex gap-2'>
          <button
            type='button'
            onClick={clearSearch}
            className='w-full md:w-auto bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300'
          >
            Clear
          </button>
          <button
            type='submit'
            className='w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300'
          >
            Search
          </button>
        </div>
      </form>
    </div>
  )
}

export default SearchSort
